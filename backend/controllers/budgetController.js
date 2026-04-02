import Budget from '../models/Budget.js';

const getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter);
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, budget_amount, month, description } = req.body;
    const existing = await Budget.findOne({ category, month });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Budget for this category and month already exists!' 
      });
    }
    const budget = await Budget.create({ category, budget_amount, month, description });
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getBudgets, createBudget, updateBudget, deleteBudget };