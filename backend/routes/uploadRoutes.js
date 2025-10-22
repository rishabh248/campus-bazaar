const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/images', protect, upload.array('images', 5), uploadImages);

module.exports = router;
