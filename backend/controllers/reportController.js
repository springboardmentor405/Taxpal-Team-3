import Transaction from '../models/Transaction.js';


const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;
  endDate = new Date(now);

  switch (period) {
    case 'Last Month': {
      const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate = firstOfLastMonth;
      endDate = lastOfLastMonth;
      break;
    }
    case 'Last Quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      const startMonth = (quarter - 1) * 3;
      startDate = new Date(now.getFullYear(), startMonth < 0 ? 9 : startMonth, 1);
      endDate = new Date(now.getFullYear(), startMonth < 0 ? 12 : startMonth + 3, 0);
      break;
    }
    case 'Year to Date': {
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    }
    case 'Current Month':
    default: {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
  }
  return { startDate, endDate };
};

export const getReport = async (req, res) => {
  try {
    const { reportType = 'Income Statement', period = 'Current Month' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    
    const expenseByCategory = {};
    transactions
      .filter((t) => t.type === 'Expense')
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    const incomeByCategory = {};
    transactions
      .filter((t) => t.type === 'Income')
      .forEach((t) => {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      });

    res.json({
      reportType,
      period,
      startDate,
      endDate,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        totalTransactions: transactions.length,
      },
      incomeByCategory,
      expenseByCategory,
      transactions,
    });
  } catch (err) {
    console.error('getReport error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
