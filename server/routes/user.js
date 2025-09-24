const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);
// Admin only: update user role/permissions
// Only admin can update user roles/permissions
// ...existing code...

module.exports = router;
