import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Expense", "Income"],
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);
