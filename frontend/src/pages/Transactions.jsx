import React, { useState, useEffect, useMemo } from 'react';
import '../sass/Transactions.scss';
import { getTransactions, addTransaction, deleteTransaction } from '../config/api';

import TransMetric from '../components/Transactions/TransMetric';
import { Search } from 'lucide-react';
import SelectTrigger from '../components/Transactions/SelectTrigger';
import TransactionTable from '../components/Transactions/TransactionTable';
import TransactionModal from '../components/Transactions/TransactionModal';
import MonthPicker from '../components/Common/MonthPicker';

const Transactions = () => {
  const now = new Date();

  const [activeModal, setActiveModal]           = useState(null);
  const [transactions, setTransactions]         = useState([]);
  const [search, setSearch]                     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType]         = useState('All Types');
  const [selectedMonth, setSelectedMonth]       = useState(null); // { year, month } | null
  const [currentPage, setCurrentPage]           = useState(1);
  const perPage = 5;

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await getTransactions(token);
      if (res?.data) {
        setTransactions(
          res.data.map(t => ({
            ...t,
            // Normalise type to Title case for display
            type:   t.type === 'income' ? 'Income' : 'Expense',
            amount: Number(t.amount),
          }))
        );
      }
    } catch (err) {
      console.error('FETCH ERROR:', err);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // ── Save / Delete ─────────────────────────────────────────────────────
  const handleSave = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await addTransaction(
        { ...data, type: data.type === 'income' ? 'income' : 'expense' },
        token
      );
      await fetchTransactions();
    } catch (err) {
      console.error('SAVE ERROR:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteTransaction(id, token);
      await fetchTransactions();
    } catch (err) {
      console.error('DELETE ERROR:', err);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => transactions.filter(t => {
    const matchSearch =
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === 'All Categories' || t.category === selectedCategory;

    const matchType =
      selectedType === 'All Types' || t.type === selectedType;

    const matchMonth = !selectedMonth || (
      new Date(t.date).getMonth()    === selectedMonth.month &&
      new Date(t.date).getFullYear() === selectedMonth.year
    );

    return matchSearch && matchCategory && matchType && matchMonth;
  }), [transactions, search, selectedCategory, selectedType, selectedMonth]);

  // ── Metrics (fixed to current/selected month vs prev) ─────────────────
  const { totalIncome, totalExpense, netBalance, incomeStats, expenseStats } = useMemo(() => {
    const targetYear  = selectedMonth ? selectedMonth.year  : now.getFullYear();
    const targetMonth = selectedMonth ? selectedMonth.month : now.getMonth();
    const prevYear    = targetMonth === 0 ? targetYear - 1 : targetYear;
    const prevMonth   = targetMonth === 0 ? 11 : targetMonth - 1;

    const inCur  = transactions.filter(t => t.type === 'Income'  && new Date(t.date).getMonth() === targetMonth && new Date(t.date).getFullYear() === targetYear).reduce((a, t) => a + t.amount, 0);
    const inPrev = transactions.filter(t => t.type === 'Income'  && new Date(t.date).getMonth() === prevMonth   && new Date(t.date).getFullYear() === prevYear).reduce((a, t) => a + t.amount, 0);
    const exCur  = transactions.filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === targetMonth && new Date(t.date).getFullYear() === targetYear).reduce((a, t) => a + t.amount, 0);
    const exPrev = transactions.filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === prevMonth   && new Date(t.date).getFullYear() === prevYear).reduce((a, t) => a + t.amount, 0);

    const calcPct = (cur, prev) => {
      if (prev === 0 && cur === 0) return { percentage: null, isPositive: true };
      const pct = prev === 0 ? 100 : ((cur - prev) / Math.abs(prev)) * 100;
      return { percentage: Math.abs(pct).toFixed(1), isPositive: pct >= 0 };
    };

    return {
      totalIncome: inCur,
      totalExpense: exCur,
      netBalance: inCur - exCur,
      incomeStats:  calcPct(inCur, inPrev),
      expenseStats: calcPct(exCur, exPrev),
    };
  }, [transactions, selectedMonth]);

  // ── Pagination ────────────────────────────────────────────────────────
  const totalPages  = Math.ceil(filteredTransactions.length / perPage);
  const currentData = filteredTransactions.slice((currentPage - 1) * perPage, currentPage * perPage);

  const MONTHS      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const activeLabel = selectedMonth
    ? `${MONTHS[selectedMonth.month]} ${selectedMonth.year}`
    : 'All Months';

  // Build unique categories from actual data for the dropdown
  const categoryOptions = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category).filter(Boolean))].sort();
    return ['All Categories', ...cats];
  }, [transactions]);

  return (
    <div className="transactions-page">
      {activeModal && (
        <TransactionModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
        />
      )}

      {/* HEADER */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Transactions</h1>
          <p>View and manage all your income and expense records</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-secondary" onClick={() => setActiveModal('income')}>+ Record Income</button>
          <button className="btn-blue"      onClick={() => setActiveModal('expense')}>+ Record Expense</button>
        </div>
      </div>

      {/* METRICS — values update based on active filters */}
      <div className="transmetrics-grid">
        <TransMetric
          title="Total Income"
          amount={`₹ ${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          percentage={incomeStats.percentage}
          period="vs prev month"
          type={incomeStats.percentage === null ? 'plain' : (incomeStats.isPositive ? 'positive' : 'negative')}
        />
        <TransMetric
          title="Total Expense"
          amount={`₹ ${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          percentage={expenseStats.percentage}
          period="vs prev month"
          // For expenses: going up is negative (bad), going down is positive (good)
          type={expenseStats.percentage === null ? 'plain' : (expenseStats.isPositive ? 'negative' : 'positive')}
        />
        <TransMetric
          title="Net Balance"
          amount={`₹ ${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          type={netBalance >= 0 ? 'success' : 'negative'}
        />
        <TransMetric
          title="Total Transactions"
          amount={filteredTransactions.length}
          type="plain"
        />
      </div>

      {/* FILTER BAR */}
      <div className="top-header">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            placeholder="Search by name or category…"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="header-actions">
          <MonthPicker
            value={selectedMonth}
            onChange={v => { setSelectedMonth(v); setCurrentPage(1); }}
            placeholder="All Months"
          />
          <SelectTrigger
            label={selectedCategory}
            options={categoryOptions}
            onSelect={v => { setSelectedCategory(v); setCurrentPage(1); }}
          />
          <SelectTrigger
            label={selectedType}
            options={['All Types', 'Income', 'Expense']}
            onSelect={v => { setSelectedType(v); setCurrentPage(1); }}
            variant="grey"
          />
        </div>
      </div>

      {/* Active filter badge */}
      {selectedMonth && (
        <div className="active-filter-badge">
          Showing transactions for <strong>{activeLabel}</strong>
          <button onClick={() => { setSelectedMonth(null); setCurrentPage(1); }}>Clear ×</button>
        </div>
      )}

      {/* TABLE */}
      <TransactionTable
        data={currentData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Transactions;
