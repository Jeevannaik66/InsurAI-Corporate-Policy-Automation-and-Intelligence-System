const express = require('express');
const { 
    register, 
    login, 
    verifyOtp, 
    resendOtp, 
    logout, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 🔹 Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/logout', authMiddleware, logout);

// 🔹 Forgot Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
