const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { sendTokenResponse, generateAccessToken } = require('../utils/tokenUtils');



const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  sendTokenResponse(user, 200, res);
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token not found, please login again.');
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401);
            throw new Error('User not found.');
        }
        const accessToken = generateAccessToken(user._id);
        const sanitizedUser = { _id: user._id, name: user.name, email: user.email, role: user.role };
        res.json({ accessToken, user: sanitizedUser });
    } catch (error) {
        res.status(403);
        throw new Error('Invalid refresh token, please login again.');
    }
});


const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { loginUser, refreshToken, logoutUser, getMe }; 