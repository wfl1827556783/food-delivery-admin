const pool = require('../config/db');

exports.listUsers = async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [rows] = await connection.query('SELECT id, name, email, role FROM users');
		connection.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.createUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		// password should be hashed by register flow; here accept raw for simplicity
		const connection = await pool.getConnection();
		const [result] = await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password || '', role || 'user']);
		connection.release();
		res.json({ id: result.insertId, name, email, role: role || 'user' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, role } = req.body;
		const connection = await pool.getConnection();
		await connection.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, id]);
		connection.release();
		res.json({ message: 'Updated' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const connection = await pool.getConnection();
		await connection.query('DELETE FROM users WHERE id = ?', [id]);
		connection.release();
		res.json({ message: 'Deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
