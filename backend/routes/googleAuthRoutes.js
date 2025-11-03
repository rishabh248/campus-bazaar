const express = require('express');
const passport = require('passport');
const router = express.Router();
const { sendTokenResponse } = require('../utils/tokenUtils');

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
    sendTokenResponse(req.user, 200, res);
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
  }
);

module.exports = router;