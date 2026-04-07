import Transaction from "../models/Transaction.js";

// ➕ Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    if (!type || !category || !amount) {
      return res.status(400).json({ message: "type, category, and amount are required" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount: Number(amount),
      description,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("addTransaction error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Transactions (with optional startDate/endDate query params)
export const getTransactions = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Apply date range filter if provided
    const { startDate, endDate } = req.query;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    // Make sure the transaction belongs to the requesting user
    if (tx.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("deleteTransaction error:", error);
    res.status(500).json({ message: error.message });
  }
};
