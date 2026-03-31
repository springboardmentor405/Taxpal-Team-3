import Transaction from "../models/Transaction.js";

// ➕ Add Transaction
export const addTransaction = async (req, res) => {
    try {
        const { type, category, amount, description, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            category,
            amount,
            description,
            date,
        });

        await transaction.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📥 Get All Transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.user.id,
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ❌ Delete Transaction
export const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};