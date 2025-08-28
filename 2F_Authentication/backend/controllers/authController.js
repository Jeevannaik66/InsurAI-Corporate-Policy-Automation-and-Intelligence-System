const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 🔹 Email Transporter Setup (Secure Config)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// ✅ Register a New User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user in the database
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Login & Send OTP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 mins
        await user.save();

        // Send OTP via email with a better format
await transporter.sendMail({
    from: `"Support Team" <naikjeevan666@gmail.com>`, // Update sender email
    to: email,
    subject: "🔐 Your OTP Code for Secure Login",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
            <h2 style="color: #007bff; text-align: center;">🔑 Verify Your Login</h2>
            <p>Dear User,</p>
            <p>Your <strong>One-Time Password (OTP)</strong> for login verification is:</p>
            
            <!-- ✅ Make OTP Stand Out -->
            <div style="text-align: center; padding: 15px; background: #eee; border-radius: 8px;">
                <h2 style="color: #333; font-size: 28px; margin: 0;">${otp}</h2>
            </div>
            
            <p>This OTP is valid for <strong>5 minutes</strong>. Please enter it on the verification page to proceed.</p>
            <p><strong>⚠️ Do not share this OTP</strong> with anyone for security reasons.</p>
            
            <hr>
            <p style="text-align: center;">Need help? Contact our support at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
            <p style="text-align: center;"></p>
        </div>
    `,
});
console.log(`✅ OTP Email Sent: ${otp} to ${email}`);  // Debugging log


        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Verify OTP & Generate JWT
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input fields
        if (!email || !otp) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP fields after successful verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'OTP verified successfully', token });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Resend OTP
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 mins
        await user.save();

        // Send OTP via email with a more professional template
        await transporter.sendMail({
            from: `"Support Team" <naikjeevan666@gmail.com>`,
            to: email,
            subject: "🔐 Your OTP Code for Secure Login",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
                    <h2 style="color: #007bff; text-align: center;">🔑 Verify Your Login</h2>
                    <p>Dear User,</p>
                    <p>Your <strong>One-Time Password (OTP)</strong> for login verification is:</p>
                    <div style="text-align: center; padding: 15px; background: #eee; border-radius: 8px;">
                        <h2 style="color: #333; font-size: 28px; margin: 0;">${otp}</h2>
                    </div>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Please enter it on the verification page to proceed.</p>
                    <p><strong>⚠️ Do not share this OTP</strong> with anyone for security reasons.</p>
                    <hr>
                    <p style="text-align: center;">Need help? Contact our support at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
                    <p style="text-align: center;">Best Regards,<br><strong>Your Company Name</strong></p>
                </div>
            `,
        });
        
        
        console.log(`✅ OTP Sent: ${otp} to ${email}`); // Debugging log
        res.status(200).json({ message: "New OTP sent successfully. Please check your email." });

    } catch (error) {
        console.error("❌ Resend OTP Error:", error);
        res.status(500).json({ message: "Failed to resend OTP. Please try again." });
    }
};

// ✅ Logout User (Frontend should remove token)
exports.logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Forgot Password (Generate Reset Link)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate unique reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 mins
        await user.save();

        // Send email with reset link
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: `"Support Team" <naikjeevan666@gmail.com>`,
            to: email,
            subject: "🔐 Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
                    <h2 style="color: #007bff; text-align: center;">🔑 Reset Your Password</h2>
                    <p>Dear User,</p>
                    <p>We received a request to reset your password. Click the link below to reset it:</p>
                    <div style="text-align: center; padding: 15px; background: #eee; border-radius: 8px;">
                        <a href="${resetLink}" style="color: #fff; background: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    </div>
                    <p>This link is valid for <strong>15 minutes</strong>.</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <hr>
                    <p style="text-align: center;">Need help? Contact our support at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
                </div>
            `,
        });

        res.status(200).json({ message: "Reset password link sent to your email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Reset Password (Verify Token & Update Password)
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully. You can now log in." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};