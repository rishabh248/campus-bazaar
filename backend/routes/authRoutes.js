const express = require('express');
const passport = require('passport');
const router = express.Router();
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
      secure: process.env.NODE_ENV === 'production', // Production mein 'true' hoga
      
      // --- YEH RAHA ASLI FIX ---
      // 'strict' ko 'none' mein badlein taaki cross-domain (Vercel to Render) cookie bheji jaa sake
      sameSite: 'none', 
      // --- FIX KHATAM ---

      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
      path: '/',
    };
    
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    // Seedha dashboard par redirect karein
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
  }
);

module.exports = router;