import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized. User not found." });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized. Token failed." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }
};
