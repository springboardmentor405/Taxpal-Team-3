import express from "express";
import {
  registerUser,
  loginUser,
  getDashboard,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Auth Routes ──────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route for dashboard — requires valid JWT
router.get("/dashboard", protect, getDashboard);

// ─── Reset Password Routes ────────────────────────────────────────────────────
// Step 1: User submits email → gets reset link in email
router.post("/forgot-password", forgotPassword);

// Step 2: Frontend verifies token is valid before showing reset form
router.get("/reset-password/:token", verifyResetToken);

// Step 3: User submits new password
router.post("/reset-password/:token", resetPassword);

export default router;
