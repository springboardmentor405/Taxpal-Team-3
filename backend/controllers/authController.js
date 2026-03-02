import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// REGISTER
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
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// DASHBOARD
// A protected endpoint that simply echoes a welcome message. The front–end
// expects to hit `/api/auth/dashboard` after logging in to verify that the
// token is valid and to display any user-specific information.
export const getDashboard = (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user?.name || "user"}!` });
};