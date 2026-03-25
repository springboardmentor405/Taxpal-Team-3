import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);

export default router;