import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const startServer = async () => {
  await connectDB();
  try {
    const { default: User } = await import("./models/User.js");
    await User.syncIndexes();
    console.log("MongoDB indexes synchronized");
  } catch (syncError) {
    console.error("Index sync error:", syncError.message);
  }
};

startServer();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});