import express from "express";
import {
  registerUser,
  loginUser,
  getDashboard
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// Protected route for the dashboard; requires a valid JWT in the
// Authorization header.
router.get("/dashboard", protect, getDashboard);

export default router;