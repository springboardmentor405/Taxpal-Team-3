import Transaction from '../models/Transaction.js';


export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      note,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('createTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = { user: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get transaction summary metrics
export const getTransactionMetrics = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      totalTransactions: transactions.length,
    });
  } catch (err) {
    console.error('getTransactionMetrics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('deleteTransaction error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
