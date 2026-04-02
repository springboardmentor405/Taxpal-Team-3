import express from 'express';
import { estimateTax, getTaxDeadlines } from '../controllers/taxController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/estimate', protect, estimateTax);
router.get('/deadlines', getTaxDeadlines);

export default router;
