import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ─── Generate JWT ────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const normalizedEmail = email && String(email).toLowerCase().trim();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    console.log("Register attempt for:", normalizedEmail);

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email: normalizedEmail, password });

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─── DASHBOARD (Protected) ───────────────────────────────────────────────────
export const getDashboard = (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user?.name || "user"}!`,
  });
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Body: { email }
// → Generates a reset token, saves it to DB, sends reset link via email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email && String(email).toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal whether email exists — security best practice
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving to DB (same reason we hash passwords)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token + expiry (15 minutes) to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save({ validateBeforeSave: false });

    // Build reset URL — frontend will read token from URL params
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (not your actual password)
      },
    });

    const mailOptions = {
      from: `"TaxPal Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "TaxPal - Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #0d6efd;">Reset Your TaxPal Password</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetURL}" 
             style="display:inline-block; padding:12px 24px; background:#0d6efd; 
                    color:#fff; text-decoration:none; border-radius:6px; margin:16px 0;">
            Reset Password
          </a>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr/>
          <small style="color:#999;">© 2025 TaxPal. All rights reserved.</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Reset email sent to:", user.email);
    return res.status(200).json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    // If email fails, clear the token so user can try again
    try {
      const user = await User.findOne({
        email: String(req.body.email).toLowerCase().trim(),
      });
      if (user) {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save({ validateBeforeSave: false });
      }
    } catch (_) {}

    return res.status(500).json({ message: "Email could not be sent. Try again." });
  }
};

// ─── VERIFY RESET TOKEN ───────────────────────────────────────────────────────
// GET /api/auth/reset-password/:token
// → Frontend calls this to check if token is valid before showing the form
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash incoming token to match what we stored in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// Body: { password, confirmPassword }
// → Sets new password if token is valid and not expired
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash incoming token to match what we stored in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password — pre-save hook will hash it automatically
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    console.log("Password reset successful for:", user.email);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
