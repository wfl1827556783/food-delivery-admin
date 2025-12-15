const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// 统一和 middleware/auth.js 使用同一个默认密钥，避免登录后校验失败
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.login = async (req, res) => {
  try {
    const identity = req.body.identity || req.body.email || req.body.username || req.body.phone;
    const password = req.body.password;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, phone, password, role FROM users WHERE email = ? OR name = ? OR phone = ?', [identity, identity, identity]);
    connection.release();
    if (!rows || rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = rows[0];
    // Plaintext password comparison (no hashing)
    if (password !== user.password) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role, vehicle } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    const allowedRoles = ['Admin', 'Customer', 'Driver'];
    const finalRole = allowedRoles.includes(role) ? role : 'Customer';

  const connection = await pool.getConnection();
    try {
      // 检查手机号和邮箱是否已存在
      const [dup] = await connection.query(
        'SELECT id FROM users WHERE phone = ? OR (email IS NOT NULL AND email = ?)',
        [phone, email || null]
      );
      if (dup && dup.length > 0) {
        return res.status(400).json({ message: 'Phone or email already exists' });
      }

      const [result] = await connection.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, email || null, phone, password, finalRole]
      );
      const userId = result.insertId;

      // 若注册角色为司机，同步创建司机档案并关联 user_id
      if (finalRole === 'Driver') {
        await connection.query(
          'INSERT INTO drivers (name, phone, vehicle, deliveries, rating, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, phone, vehicle || '', 0, 5.0, 'Online', userId]
        );
      }
      const token = jwt.sign({ id: userId, role: finalRole }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: userId, name, phone, email, role: finalRole } });
    } finally {
    connection.release();
    }
  } catch (err) {
    // 可能是唯一索引冲突等错误
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Phone already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    connection.release();
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { name, email } = req.body;
    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    connection.release();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { oldPassword, newPassword } = req.body;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (!rows || rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    // Plaintext password comparison and update
    if (oldPassword !== rows[0].password) {
      connection.release();
      return res.status(400).json({ message: 'Old password incorrect' });
    }
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    connection.release();
    res.json({ message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
