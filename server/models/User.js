const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Removed email verification fields
  resetToken: String,
  resetTokenExpiry: Date,
  refreshToken: String,
  role: {
    type: String,
    enum: ['user', 'admin'], // เพิ่ม 'admin' ให้รองรับ role แอดมิน
    default: 'user',
  },
  permissions: [String],
  profile: {
    fullName: String,
    avatar: String,
    bio: String,
  },
  social: {
    googleId: String,
    facebookId: String,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
