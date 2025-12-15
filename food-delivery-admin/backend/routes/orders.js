const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/', auth, orderController.listOrders);
router.put('/:id/status', auth, orderController.updateStatus);
router.get('/:id', auth, orderController.getOrder);
router.post('/', auth, orderController.createOrder);
router.put('/:id', auth, orderController.updateOrder);
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
