const pool = require('../config/db');

exports.listOrders = async (req, res) => {
	try {
		const connection = await pool.getConnection();
		let rows;
		const role = req.user?.role;
		const userId = req.user?.id;

		if (role === 'Admin') {
			[rows] = await connection.query(`SELECT o.id, o.customer_name, o.total, o.status, o.created_at, o.items, o.user_id, o.driver_id FROM orders o ORDER BY o.created_at DESC`);
		} else if (role === 'Driver') {
			// 配送员只看分配给自己的订单
			const [drvRows] = await connection.query('SELECT id FROM drivers WHERE user_id = ? LIMIT 1', [userId]);
			const driverIdForUser = drvRows?.[0]?.id || null;
			if (!driverIdForUser) {
				connection.release();
				return res.json([]);
			}
			[rows] = await connection.query(
				`SELECT o.id, o.customer_name, o.total, o.status, o.created_at, o.items, o.user_id, o.driver_id
         FROM orders o
         WHERE o.driver_id = ?
         ORDER BY o.created_at DESC`,
				[driverIdForUser]
			);
		} else {
			// 普通用户：只能看自己的订单
			[rows] = await connection.query(
				`SELECT o.id, o.customer_name, o.total, o.status, o.created_at, o.items, o.user_id, o.driver_id
         FROM orders o
         WHERE o.user_id = ?
         ORDER BY o.created_at DESC`,
				[userId]
			);
		}
		connection.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const connection = await pool.getConnection();
		const [rows] = await connection.query('SELECT id, customer_name, total, status, items, created_at FROM orders WHERE id = ?', [id]);
		connection.release();
		if (!rows || rows.length === 0) return res.status(404).json({ message: 'Not found' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.createOrder = async (req, res) => {
	try {
		const { customer_name, items, total } = req.body;
		const userId = req.user?.id || null;
		const role = req.user?.role;
		// 只有登录用户可以创建订单；司机不创建订单
		if (role === 'Driver') return res.status(403).json({ message: 'Drivers cannot create orders' });

		const connection = await pool.getConnection();
		let safeCustomerName = customer_name;

		// 如果未传 customer_name，则尝试用登录用户名称填充
		if (!safeCustomerName && userId) {
			const [userRows] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
			if (userRows && userRows[0]?.name) {
				safeCustomerName = userRows[0].name;
			}
		}
		if (!safeCustomerName) safeCustomerName = '未知客户';

		const [result] = await connection.query(
			'INSERT INTO orders (customer_name, items, total, status, user_id) VALUES (?, ?, ?, ?, ?)',
			[safeCustomerName, JSON.stringify(items || []), total || 0, 'Pending', userId]
		);
		connection.release();
		res.json({ id: result.insertId, customer_name: safeCustomerName, items, total, status: 'Pending', user_id: userId, driver_id: null });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const { customer_name, items, total, status } = req.body;
		const role = req.user?.role;
		if (role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });

		const connection = await pool.getConnection();
		await connection.query('UPDATE orders SET customer_name = ?, items = ?, total = ?, status = ? WHERE id = ?', [customer_name, JSON.stringify(items || []), total, status, id]);
		connection.release();
		res.json({ message: 'Updated' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const role = req.user?.role;
		const userId = req.user?.id;

		const connection = await pool.getConnection();
		let driverIdForUser = null;
		if (role === 'Driver') {
			const [drvRows] = await connection.query('SELECT id FROM drivers WHERE user_id = ? LIMIT 1', [userId]);
			driverIdForUser = drvRows?.[0]?.id || null;
			if (!driverIdForUser) {
				connection.release();
				return res.status(403).json({ message: 'Driver profile not found' });
			}
		}

		// 先取当前订单
		const [rows] = await connection.query('SELECT id, driver_id, user_id, status FROM orders WHERE id = ?', [id]);
		if (!rows || rows.length === 0) {
			connection.release();
			return res.status(404).json({ message: 'Not found' });
		}
		const order = rows[0];

		const allowedTransitions = {
			Admin: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
			Driver: {
				Pending: ['Processing', 'Cancelled', 'Failed'],
				Processing: ['Delivered', 'Cancelled', 'Failed']
			}
		};

		if (role === 'Admin') {
		await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
		} else if (role === 'Driver') {
			// 司机：必须是自己的订单，且遵循流程
			if (!driverIdForUser || order.driver_id !== driverIdForUser) {
				connection.release();
				return res.status(403).json({ message: 'Order assigned to another driver' });
			}
			const nexts = allowedTransitions.Driver[order.status] || [];
			if (!nexts.includes(status)) {
				connection.release();
				return res.status(400).json({ message: 'Invalid status transition' });
			}
			await connection.query('UPDATE orders SET status = ?, driver_id = ? WHERE id = ?', [status, driverIdForUser, id]);
		} else {
			connection.release();
			return res.status(403).json({ message: 'Forbidden' });
		}

		connection.release();
		res.json({ message: 'Status updated' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const role = req.user?.role;
		if (role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });

		const connection = await pool.getConnection();
		await connection.query('DELETE FROM orders WHERE id = ?', [id]);
		connection.release();
		res.json({ message: 'Deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

