const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, avatar, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.profile = {
      ...user.profile,
      fullName: fullName || user.profile.fullName,
      avatar: avatar || user.profile.avatar,
      bio: bio || user.profile.bio,
    };
    await user.save();
    res.json({ message: 'Profile updated', profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ...existing code...
exports.updateRole = async (req, res) => {
  try {
    const { userId, role, permissions } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    await user.save();
    res.json({ message: 'User role/permissions updated', user: { id: user._id, role: user.role, permissions: user.permissions } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
