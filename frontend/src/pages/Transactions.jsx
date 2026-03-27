import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Transactions.scss';
import TransMetric from '../components/Transactions/TransMetric.';
import DatePickerTrigger from '../components/Transactions/DatePickerTrigger';
import { Search } from 'lucide-react';
import SelectTrigger from '../components/Transactions/SelectTrigger';
import ExportButton from '../components/Transactions/Exportbtn';
import TransactionTable from '../components/Transactions/TransactionTable';
import TransactionModal from '../components/Dashboard/TransactionModal';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const Transactions = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [currentDate, setCurrentDate] = useState('May 5-2025');
    const [isOpen, setIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [metrics, setMetrics] = useState({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        totalTransactions: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [txRes, metricsRes] = await Promise.all([
                axios.get(`${API_URL}/transactions`, getAuthHeaders()),
                axios.get(`${API_URL}/transactions/metrics`, getAuthHeaders()),
            ]);
            setTransactions(txRes.data);
            setMetrics(metricsRes.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
    };

    const handleSave = async (form) => {
        try {
            const payload = {
                title: form.description,
                amount: parseFloat(form.amount),
                type: activeModal === 'income' ? 'Income' : 'Expense',
                category: form.category || 'Other',
                date: form.date,
                note: form.notes,
            };
            await axios.post(`${API_URL}/transactions`, payload, getAuthHeaders());
            await fetchData(); // Refresh data after saving
        } catch (err) {
            console.error('Failed to save transaction:', err);
        }
    };

    const fmt = (n) =>
        `$ ${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <div className="transactions-page">
            {activeModal && (
                <TransactionModal
                    type={activeModal}
                    onClose={() => setActiveModal(null)}
                    onSave={handleSave}
                />
            )}

            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>Transactions</h1>
                    <p>View and Manage all your income and Expense Record</p>
                </div>
                <div className="welcome-actions">
                    <button className="btn-secondary" onClick={() => setActiveModal('income')}>Record Income</button>
                    <button className="btn-blue" onClick={() => setActiveModal('expense')}>Record Expense</button>
                </div>
            </div>

            <div className="transmetrics-grid">
                <TransMetric
                    title="Total Income"
                    amount={fmt(metrics.totalIncome)}
                    percentage="8.2"
                    period="last month"
                    type="positive"
                />
                <TransMetric
                    title="Total Expense"
                    amount={fmt(metrics.totalExpense)}
                    percentage="8.2"
                    period="last month"
                    type="negative"
                />
                <TransMetric
                    title="Net Balance"
                    amount={fmt(metrics.netBalance)}
                    period={metrics.netBalance >= 0 ? 'Positive' : 'Negative'}
                    type="success"
                />
                <TransMetric
                    title="Total Transactions"
                    amount={String(metrics.totalTransactions)}
                    period="All Time"
                    type="plain"
                />
            </div>

            <div className="top-header">
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input type="text" placeholder="Search transactions......" />
                </div>
                <div className="header-actions">
                    <SelectTrigger label="All Categories" variant="default" />
                    <SelectTrigger label="All Types" variant="grey" />
                    <DatePickerTrigger date={currentDate} onClick={toggleDatePicker} />
                    <ExportButton />
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading transactions...</p>
            ) : (
                <TransactionTable data={transactions} />
            )}
        </div>
    );
};

export default Transactions;