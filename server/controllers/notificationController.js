const Notification = require('../models/Notification');

// GET /api/notifications - ทั้งหมด (ล่าสุดก่อน)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/notifications/:id/read - mark as read (by admin)
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Not found' });
    const adminId = req.user._id; // ต้องมี middleware auth
    if (!notification.readBy.includes(adminId)) {
      notification.readBy.push(adminId);
      await notification.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
