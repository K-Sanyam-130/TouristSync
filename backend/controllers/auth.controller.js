// controllers/auth.controller.js — Authentication controller
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const axios = require('axios');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { blacklistToken } = require('../middleware/auth.middleware');

/**
 * Generate a signed JWT token for a user.
 * @param {string} id - User's MongoDB _id
 * @param {string} email - User's email
 * @returns {string} Signed JWT
 */
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 **/
const register = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  // Create user (passwordHash is hashed via pre-save hook)
  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  // Generate JWT
  const token = generateToken(user._id, user.email);

  // Return user data (passwordHash excluded by toJSON transform)
  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferredLanguage: user.preferredLanguage,
      homeCountry: user.homeCountry,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  });
});

/**
 * /**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  console.log('\n========== LOGIN ATTEMPT ==========');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('❌ Validation Errors:', errors.array());

    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  console.log('📧 Email:', email);

  // Find user and include passwordHash
  const user = await User.findOne({ email }).select('+passwordHash');

  console.log('👤 User Found:', !!user);

  if (!user) {
    console.log('❌ User not found');

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  console.log('🔐 Comparing password...');

  const isMatch = await user.comparePassword(password);

  console.log('🔐 Password Match:', isMatch);

  if (!isMatch) {
    console.log('❌ Password incorrect');

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  console.log('✅ Login successful');

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.email);

  console.log('🎟️ Token generated');

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferredLanguage: user.preferredLanguage,
      homeCountry: user.homeCountry,
      bio: user.bio,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
});
/**
 * @desc    Update user profile (name, avatar, preferredLanguage, bio, homeCountry)
 * @route   PATCH /api/auth/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Only allow updating specific fields
  const allowedFields = ['name', 'avatar', 'preferredLanguage', 'bio', 'homeCountry', 'username', 'isPrivate'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @desc    Logout user (blacklist token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Add token to blacklist
  if (req.token) {
    blacklistToken(req.token);
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Sign in or sign up with Google OAuth
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleSignIn = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Google ID token is required',
    });
  }

  // Verify the Google ID token
  let googleUser;
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    googleUser = response.data;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Google token',
    });
  }

  // Extract user info from Google token
  const { sub: googleId, email, name, picture } = googleUser;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Could not retrieve email from Google account',
    });
  }

  // Find existing user by googleId or email (merge accounts)
  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  });

  if (user) {
    // Existing user — link Google ID if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = user.passwordHash ? user.authProvider : 'google';
    }
    // Update avatar from Google if user doesn't have one
    if (!user.avatar && picture) {
      user.avatar = picture;
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    // New user — create account from Google profile
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      googleId,
      authProvider: 'google',
      avatar: picture || null,
    });
  }

  // Generate JWT
  const token = generateToken(user._id, user.email);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferredLanguage: user.preferredLanguage,
      homeCountry: user.homeCountry,
      bio: user.bio,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
});

module.exports = { register, login, googleSignIn, getMe, getUserById, updateMe, logout };
