const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

router.get('/', auth, analyticsController.getAnalytics);

module.exports = router;
