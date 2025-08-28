const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: String,
    otpExpiry: Date,
    resetPasswordToken: String,  // ✅ Add this field
    resetPasswordExpires: Date,  // ✅ Add this field
});

module.exports = mongoose.model('User', userSchema);
