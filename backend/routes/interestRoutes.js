const express = require('express');
const router = express.Router();
const {
    showInterest,
    getSellerContact,
    getMyInterests,
    getMyNotifications,
    markNotificationAsRead
} = require('../controllers/interestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyInterests);
router.get('/notifications', protect, getMyNotifications);
router.put('/notifications/:id/read', protect, markNotificationAsRead);
router.post('/:productId/show', protect, showInterest);
router.get('/:productId/seller-contact', protect, getSellerContact);

module.exports = router;
