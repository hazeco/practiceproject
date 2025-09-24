const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


// POST /api/admin/login
router.post('/login', adminController.login);

// GET /api/admin/users
router.get('/users', adminController.getUsers);

// PATCH /api/admin/profile/avatar
const auth = require('../middleware/auth');
router.patch('/profile/avatar', auth, adminController.updateAvatar);

module.exports = router;
