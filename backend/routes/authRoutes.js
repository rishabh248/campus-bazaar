const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser); // No protect middleware here, relies on cookie
router.get('/me', protect, getMe);

module.exports = router;
