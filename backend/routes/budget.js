import express from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} from '../controllers/Budget.js';

const router = express.Router();

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;