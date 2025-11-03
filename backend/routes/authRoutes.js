const express = require('express');
const router = express.Router();

const { loginUser, refreshToken, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');


router.post('/login', loginLimiter, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;