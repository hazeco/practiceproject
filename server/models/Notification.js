const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['message', 'system', 'other'], default: 'other' },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
  // ใครอ่านแล้วบ้าง (admin user id)
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Notification', notificationSchema);
