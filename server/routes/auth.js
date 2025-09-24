const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);
// ...removed email verification endpoints...
router.post('/refresh-token', authController.refreshToken);

// Social login (Google, Facebook, etc.)
router.post('/social-login', authController.socialLogin);

router.post('/reset-password', authController.requestReset);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
