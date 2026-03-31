import express from "express";
import { signup, login, forgotPassword, verifyOtp, resetPassword } from "../controllers/authController.js";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put("/change-password", protect, changePassword);

export default router;