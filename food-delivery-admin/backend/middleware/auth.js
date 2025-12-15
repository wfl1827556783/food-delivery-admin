const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader) return res.status(401).json({ message: 'No token provided' });

	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
