import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MetricCard from '../components/Dashboard/MetricCard';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import ExpenseBreakdownChart from '../components/Dashboard/ExpenseBreakdownChart';
import TransactionModal from '../components/Dashboard/TransactionModal';
import MonthPicker from '../components/Common/MonthPicker';
import '../sass/Dashboard.scss';
import { API_BASE as API_URL } from '../config/api';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const Dashboard = () => {
  const now = new Date();
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [name, setName]               = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null); // null = current month
  const [transactions, setTransactions]   = useState([]);
  const [barData, setBarData]             = useState([]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const fmtMoney = (n) =>
    Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Returns null when there's no meaningful previous data to compare against
  const pctChange = (current, previous) => {
    const c = Number(current || 0);
    const p = Number(previous || 0);
    if (p === 0 && c === 0) return null;   // no data at all — show "No previous data"
    if (p === 0) return 100;               // went from nothing to something
    return ((c - p) / Math.abs(p)) * 100;
  };

  const buildMonthlySeries = (txs, monthsBack) => {
    const buckets = new Map();
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, { income: 0, expense: 0, date: d });
    }
    txs.forEach(t => {
      const dt  = new Date(t.date);
      if (isNaN(dt.getTime())) return;
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      const b   = buckets.get(key);
      if (!b) return;
      const type = (t.type || '').toLowerCase();
      if (type === 'income')  b.income  += Number(t.amount || 0);
      if (type === 'expense') b.expense += Number(t.amount || 0);
    });
    return Array.from(buckets.values()).map(b => ({
      name:     b.date.toLocaleString('en-US', { month: 'short' }),
      Income:   Math.round(b.income  * 100) / 100,
      Expenses: Math.round(b.expense * 100) / 100,
    }));
  };

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not logged in. Please log in again.');
        setLoading(false);
        return;
      }

      // Fetch last 12 months of transactions + user profile in parallel
      const end   = new Date();
      const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);

      const [txRes, profileRes] = await Promise.allSettled([
        axios.get(`${API_URL}/transactions`, {
          ...getAuthHeaders(),
          params: { startDate: start.toISOString(), endDate: end.toISOString() },
        }),
        axios.get(`${API_URL}/users/profile`, getAuthHeaders()),
      ]);

      if (txRes.status === 'fulfilled' && Array.isArray(txRes.value?.data)) {
        const txs = txRes.value.data;
        setTransactions(txs);
        setBarData(buildMonthlySeries(txs, 6));
      } else {
        console.warn('Transactions fetch failed or returned unexpected data:', txRes);
        setError('Could not load transaction data. Check that the backend is running.');
      }

      if (profileRes.status === 'fulfilled') {
        const u = profileRes.value?.data;
        setName(u?.firstName || u?.name || '');
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
      setError('Failed to load dashboard. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived stats for selected month ─────────────────────────────────
  const targetYear  = selectedMonth ? selectedMonth.year  : now.getFullYear();
  const targetMonth = selectedMonth ? selectedMonth.month : now.getMonth();
  const prevYear    = targetMonth === 0 ? targetYear - 1 : targetYear;
  const prevMonth   = targetMonth === 0 ? 11 : targetMonth - 1;

  const { curIncome, curExpense, expensePie } = useMemo(() => {
    let curIncome = 0, curExpense = 0;
    const expensePie = {};
    transactions.forEach(t => {
      const d    = new Date(t.date);
      const type = (t.type || '').toLowerCase();
      const amt  = Number(t.amount || 0);
      if (d.getFullYear() === targetYear && d.getMonth() === targetMonth) {
        if (type === 'income')  curIncome += amt;
        if (type === 'expense') {
          curExpense += amt;
          expensePie[t.category] = (expensePie[t.category] || 0) + amt;
        }
      }
    });
    return { curIncome, curExpense, expensePie };
  }, [transactions, targetYear, targetMonth]);

  const { lastIncome, lastExpense } = useMemo(() => {
    let lastIncome = 0, lastExpense = 0;
    transactions.forEach(t => {
      const d    = new Date(t.date);
      const type = (t.type || '').toLowerCase();
      const amt  = Number(t.amount || 0);
      if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
        if (type === 'income')  lastIncome  += amt;
        if (type === 'expense') lastExpense += amt;
      }
    });
    return { lastIncome, lastExpense };
  }, [transactions, prevYear, prevMonth]);

  const expenseBreakdownData = useMemo(() =>
    Object.entries(expensePie)
      .map(([k, v]) => ({ name: k || 'Other', value: v }))
      .filter(x => x.value > 0),
    [expensePie]
  );

  // null means "no previous data" → MetricCard shows "No previous data"
  const expensePct  = pctChange(curExpense, lastExpense);
  const incomePct   = pctChange(curIncome,  lastIncome);
  const savingsRate = curIncome > 0 ? ((curIncome - curExpense) / curIncome) * 100 : 0;
  const lastSavingsRate = lastIncome > 0 ? ((lastIncome - lastExpense) / lastIncome) * 100 : 0;
  const savingsRatePct = pctChange(savingsRate, lastSavingsRate);

  // ── Save transaction ──────────────────────────────────────────────────
  const handleSave = async (form) => {
    try {
      await axios.post(`${API_URL}/transactions`, {
        description: form.description,
        amount:      parseFloat(form.amount),
        type:        activeModal === 'income' ? 'income' : 'expense',
        category:    form.category || 'Other',
        date:        form.date,
        note:        form.notes,
      }, getAuthHeaders());
      await fetchDashboard();
    } catch (e) {
      console.error('Save transaction error:', e);
      setError('Failed to save transaction. Please try again.');
    }
  };

  const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthLabel = selectedMonth
    ? `${MONTHS[selectedMonth.month]} ${selectedMonth.year}`
    : `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="dashboard-page">
      {activeModal && (
        <TransactionModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Good Morning{name ? `, ${name}` : ''} 👋</h1>
          <p>Here's what's happening with your finances today.</p>
        </div>
        <div className="welcome-actions">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} placeholder="Current Month" />
          <button className="btn-blue" onClick={() => setActiveModal('income')}>+ Add Income</button>
          <button className="btn-blue" onClick={() => setActiveModal('expense')}>+ Add Expense</button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.6rem 1rem', color: '#991b1b', fontSize: '0.85rem' }}>
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#666', padding: '2rem 0', textAlign: 'center' }}>Loading dashboard…</div>
      ) : (
        <>
          <div className="metrics-month-label">
            Showing data for <strong>{monthLabel}</strong>
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth(null)}
                style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: '#1C88C7', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Reset to current month ×
              </button>
            )}
          </div>

          {/* Metric cards */}
          <div className="metrics-grid">
            <MetricCard
              title="Monthly Income"
              amount={fmtMoney(curIncome)}
              percentage={incomePct !== null ? Math.abs(incomePct).toFixed(1) : null}
              period="vs prev month"
              isPositive={incomePct === null ? true : incomePct >= 0}
              chartData="M0 25 Q20 20, 40 15 T80 5 T100 10"
            />
            <MetricCard
              title="Monthly Expenses"
              amount={fmtMoney(curExpense)}
              percentage={expensePct !== null ? Math.abs(expensePct).toFixed(1) : null}
              period="vs prev month"
              isPositive={expensePct === null ? true : expensePct <= 0}
              chartData="M0 20 Q25 10, 50 25 T100 15"
            />
            <MetricCard
              title="Savings Rate"
              amount={`${savingsRate.toFixed(1)}%`}
              percentage={savingsRatePct !== null ? Math.abs(savingsRatePct).toFixed(1) : null}
              period="vs prev month"
              isPositive={savingsRatePct === null ? true : savingsRatePct >= 0}
              chartData="M0 25 L40 20 L60 15 L80 10 L100 5"
            />
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <IncomeExpenseChart data={barData} />
            <ExpenseBreakdownChart data={expenseBreakdownData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
