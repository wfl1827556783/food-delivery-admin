const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const driverController = require('../controllers/driverController');

router.get('/', auth, driverController.listDrivers);
router.post('/', auth, driverController.createDriver);
router.delete('/:id', auth, driverController.deleteDriver);

module.exports = router;
