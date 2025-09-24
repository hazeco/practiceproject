// Social login (Google example)
exports.socialLogin = async (req, res) => {
  try {
    const { provider, socialId, email, username, avatar } = req.body;
    let user = await User.findOne({ [`social.${provider}Id`]: socialId });
    if (!user) {
      user = new User({
        username: username || email,
        email,
        profile: { avatar },
        social: { [`${provider}Id`]: socialId },
      });
      await user.save();
    }
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await user.save();
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

// Register user (no email verification)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user with refresh token (no email verification check)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }
    if (!user.password) {
      return res.status(401).json({ message: 'User does not have a password set. Please use social login.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await user.save();
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ...removed email verification endpoints...
// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request password reset
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real application, send email here
    res.json({
      message: 'Password reset email sent',
      // For development only:
      token: resetToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
