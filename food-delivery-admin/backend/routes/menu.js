const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const menuController = require('../controllers/menuController');

router.get('/', auth, menuController.listMenu);
router.post('/', auth, menuController.createMenuItem);
router.get('/:id', auth, menuController.getMenuItem);
router.put('/:id', auth, menuController.updateMenuItem);
router.delete('/:id', auth, menuController.deleteMenuItem);
router.patch('/:id/status', auth, menuController.toggleStatus);

module.exports = router;
