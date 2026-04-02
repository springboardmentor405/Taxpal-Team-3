import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MetricCard from '../components/Dashboard/MetricCard';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import ExpenseBreakdownChart from '../components/Dashboard/ExpenseBreakdownChart';
import TransactionModal from '../components/Dashboard/TransactionModal';
import '../sass/Dashboard.scss';

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null); // 'income' | 'expense' | null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('Alex');

  const [currentSummary, setCurrentSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    totalTransactions: 0,
  });
  const [lastSummary, setLastSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    totalTransactions: 0,
  });
  const [barData, setBarData] = useState([]);
  const [expenseBreakdownData, setExpenseBreakdownData] = useState([]);

  // Ensure we always call the backend API base (mounted at `/api`).
  // Your `frontend/.env` uses `VITE_API_URL=http://localhost:5000` (no `/api`), so normalize here.
  const API_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_URL = (() => {
    const base = String(API_URL_RAW).replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  })();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fmtMoney = (n) =>
    Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const pctChange = (current, previous) => {
    const c = Number(current || 0);
    const p = Number(previous || 0);
    if (p === 0) return c === 0 ? 0 : 100;
    return ((c - p) / Math.abs(p)) * 100;
  };

  const buildMonthlySeries = (transactions, monthsBack) => {
    const now = new Date();
    const buckets = new Map(); // key: YYYY-MM => { income, expense }

    for (let i = monthsBack - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, { income: 0, expense: 0, date: d });
    }

    transactions.forEach((t) => {
      const dt = new Date(t.date);
      if (Number.isNaN(dt.getTime())) return;
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      const bucket = buckets.get(key);
      if (!bucket) return;
      if (t.type && t.type.toLowerCase() === 'income') bucket.income += Number(t.amount || 0);
      if (t.type && t.type.toLowerCase() === 'expense') bucket.expense += Number(t.amount || 0);
    });

    const monthLabel = (d) =>
      d.toLocaleString('en-US', { month: 'short' });

    return Array.from(buckets.values()).map((b) => ({
      name: monthLabel(b.date),
      Income: Math.round(b.income * 100) / 100,
      Expenses: Math.round(b.expense * 100) / 100,
    }));
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in again.');
        return;
      }

      let txRes = null;
      let profileRes = null;
      let loadedAny = false;

      try {
        txRes = await axios.get(`${API_URL}/transactions`, {
          ...getAuthHeaders(),
          params: (() => {
            const end = new Date();
            const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
            return { startDate: start.toISOString(), endDate: end.toISOString() };
          })(),
        });
        if (Array.isArray(txRes?.data)) loadedAny = true;
      } catch (e) {
        console.error('Dashboard transactions failed:', e);
      }

      try {
        profileRes = await axios.get(`${API_URL}/users/profile`, getAuthHeaders());
      } catch (e) {
        // Optional; don't block dashboard if profile endpoint fails.
      }

      if (Array.isArray(txRes?.data)) {
        const txs = txRes.data;
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        let curIncome = 0; let curExpense = 0; let curTxCount = 0;
        let lastIncome = 0; let lastExpense = 0; let lastTxCount = 0;
        const expensePie = {};

        txs.forEach((t) => {
          const d = new Date(t.date);
          const type = t.type ? t.type.toLowerCase() : '';
          const amt = Number(t.amount || 0);

          if (d >= currentMonthStart && d <= currentMonthEnd) {
            curTxCount++;
            if (type === 'income') curIncome += amt;
            if (type === 'expense') {
              curExpense += amt;
              expensePie[t.category] = (expensePie[t.category] || 0) + amt;
            }
          } else if (d >= lastMonthStart && d <= lastMonthEnd) {
            lastTxCount++;
            if (type === 'income') lastIncome += amt;
            if (type === 'expense') lastExpense += amt;
          }
        });

        setCurrentSummary({
          totalIncome: curIncome,
          totalExpense: curExpense,
          netBalance: curIncome - curExpense,
          totalTransactions: curTxCount,
        });

        setLastSummary({
          totalIncome: lastIncome,
          totalExpense: lastExpense,
          netBalance: lastIncome - lastExpense,
          totalTransactions: lastTxCount,
        });

        const pie = Object.entries(expensePie)
          .map(([k, v]) => ({ name: k || 'Other', value: v }))
          .filter((x) => x.value > 0);
        setExpenseBreakdownData(pie);

        setBarData(buildMonthlySeries(txs, 6));
      }

      const username = profileRes?.data?.name || profileRes?.data?.username;
      if (username) setName(username);

      // If *everything* failed, show an actionable error.
      if (!loadedAny) {
        setError('Failed to load dashboard data. Please check login/token and try again.');
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
      setError('Failed to load dashboard data. Please log in again or try later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (form) => {
    try {
      const payload = {
        description: form.description,
        amount: parseFloat(form.amount),
        type: activeModal === 'income' ? 'income' : 'expense',
        category: form.category || 'Other',
        date: form.date,
        note: form.notes,
      };
      await axios.post(`${API_URL}/transactions`, payload, getAuthHeaders());
      await fetchDashboard();
    } catch (e) {
      console.error('Failed to save transaction:', e);
      setError('Failed to save transaction. Please try again.');
    }
  };

  const monthlyExpensePct = useMemo(
    () => pctChange(currentSummary.totalExpense, lastSummary.totalExpense),
    [currentSummary.totalExpense, lastSummary.totalExpense]
  );
  const monthlyIncomePct = useMemo(
    () => pctChange(currentSummary.totalIncome, lastSummary.totalIncome),
    [currentSummary.totalIncome, lastSummary.totalIncome]
  );
  const savingsRate = useMemo(() => {
    const income = Number(currentSummary.totalIncome || 0);
    const expense = Number(currentSummary.totalExpense || 0);
    if (income <= 0) return 0;
    return ((income - expense) / income) * 100;
  }, [currentSummary.totalIncome, currentSummary.totalExpense]);

  return (
    <div className="dashboard-page">
      {activeModal && (
        <TransactionModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Good Morning, {name}</h1>
          <p>Here's what's happening with your business today.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-blue" onClick={() => setActiveModal('income')}>Add New Income</button>
          <button className="btn-blue" onClick={() => setActiveModal('expense')}>Add New Expenses</button>
        </div>
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: '0.75rem' }}>{error}</p>
      )}

      <div className="metrics-grid">
        <MetricCard
          title="Monthly Expenses"
          amount={fmtMoney(currentSummary.totalExpense)}
          percentage={Math.abs(monthlyExpensePct).toFixed(1)}
          period="last month"
          isPositive={monthlyExpensePct <= 0}
          chartData="M0 20 Q25 10, 50 25 T100 15"
        />
        <MetricCard
          title="Savings Rate"
          amount={Number(savingsRate).toFixed(1)}
          percentage={Math.abs(savingsRate).toFixed(1)}
          period="last month"
          isPositive={savingsRate >= 0}
          chartData="M0 25 L40 20 L60 15 L80 10 L100 5"
        />
        <MetricCard
          title="Monthly Income"
          amount={fmtMoney(currentSummary.totalIncome)}
          percentage={Math.abs(monthlyIncomePct).toFixed(1)}
          period="last month"
          isPositive={monthlyIncomePct >= 0}
          chartData="M0 25 Q20 20, 40 15 T80 5 T100 10"
        />
      </div>

      <div className="charts-grid">
        <IncomeExpenseChart data={barData} />
        <ExpenseBreakdownChart data={expenseBreakdownData} />
      </div>
    </div>
  );
};

export default Dashboard;