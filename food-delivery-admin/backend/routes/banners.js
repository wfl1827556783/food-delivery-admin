const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bannerController = require('../controllers/bannerController');

router.get('/', auth, bannerController.listBanners);
router.get('/:id', auth, bannerController.getBanner);
router.post('/', auth, bannerController.createBanner);
router.put('/:id', auth, bannerController.updateBanner);
router.delete('/:id', auth, bannerController.deleteBanner);
router.patch('/:id/status', auth, bannerController.toggleBanner);

module.exports = router;
