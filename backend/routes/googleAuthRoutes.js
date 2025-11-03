const express = require('express');
const passport = require('passport');
const router = express.Router();
// Hum poora 'sendTokenResponse' nahi, sirf 'generateRefreshToken' import karenge
const { generateRefreshToken } = require('../utils/tokenUtils');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CORS_ORIGIN}/login?error=google-auth-failed`,
    session: false,
  }),
  (req, res) => {
    
    
    const refreshToken = generateRefreshToken(req.user._id);

    
    const refreshTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',
    };
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

  
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
  }
);

module.exports = router;