const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// GET /api/notifications
router.get('/notifications', auth, notificationController.getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/notifications/:id/read', auth, notificationController.markAsRead);

module.exports = router;
