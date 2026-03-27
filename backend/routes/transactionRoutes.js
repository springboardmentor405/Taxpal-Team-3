import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionMetrics,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTransactions);
router.get('/metrics', protect, getTransactionMetrics);
router.post('/', protect, createTransaction);
router.delete('/:id', protect, deleteTransaction);

export default router;
