import React, { useState, useEffect } from 'react';
import '../sass/Transactions.scss';
import { getTransactions, addTransaction, deleteTransaction } from '../config/api';

import TransMetric from '../components/Transactions/TransMetric';
import DatePickerTrigger from '../components/Transactions/DatePickerTrigger';
import { Search } from 'lucide-react';
import SelectTrigger from '../components/Transactions/SelectTrigger';
import TransactionTable from '../components/Transactions/TransactionTable';
import TransactionModal from '../components/Transactions/TransactionModal';

const Transactions = () => {

    const [activeModal, setActiveModal] = useState(null);
    const [currentDate, setCurrentDate] = useState('Mar 2026');
    const [isOpen, setIsOpen] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState("");
    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
        console.log("Open calendar picker UI here");
    };

    const [transactions, setTransactions] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedType, setSelectedType] = useState("All Types");

    // ✅ FETCH DATA
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await getTransactions(token);

            if (res?.data) {
                const normalized = res.data.map(t => ({
                    ...t,
                    type: t.type === "income" ? "Income" : "Expense",
                    amount: Number(t.amount)
                }));
                setTransactions(normalized);
            }
        } catch (err) {
            console.error("FETCH ERROR:", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // ✅ SAVE DATA
    const handleSave = async (data) => {
        try {
            const token = localStorage.getItem("token");

            await addTransaction({
                ...data,
                type: data.type === "income" ? "income" : "expense"
            }, token);

            await fetchTransactions(); // 🔥 REFRESH UI

        } catch (error) {
            console.error("SAVE ERROR:", error);
        }
    };
    // ✅ DELETE DATA
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const token = localStorage.getItem("token");
            await deleteTransaction(id, token);
            await fetchTransactions(); // 🔥 REFRESH UI
        } catch (error) {
            console.error("DELETE ERROR:", error);
        }
    };

    // ✅ FILTER
    const filteredTransactions = transactions.filter(t => {

        const matchSearch =
            t.description?.toLowerCase().includes(search.toLowerCase()) ||
            t.category?.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            selectedCategory === "All Categories" || t.category === selectedCategory;

        const matchType =
            selectedType === "All Types" || t.type === selectedType;

        // ✅ MONTH FILTER
        const matchMonth =
            !selectedMonth ||
            new Date(t.date).getMonth() === new Date(selectedMonth).getMonth() &&
            new Date(t.date).getFullYear() === new Date(selectedMonth).getFullYear();

        return matchSearch && matchCategory && matchType && matchMonth;
    });

    // ✅ METRICS
    const totalIncome = filteredTransactions
        .filter(t => t.type === "Income")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === "Expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // ✅ STEP 1: DEFINE FUNCTION FIRST
    const getMonthlyStats = (type) => {
        const now = new Date();

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentTotal = transactions
            .filter(t =>
                t.type === type &&
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear
            )
            .reduce((acc, t) => acc + t.amount, 0);

        const prevTotal = transactions
            .filter(t =>
                t.type === type &&
                new Date(t.date).getMonth() === prevMonth &&
                new Date(t.date).getFullYear() === prevYear
            )
            .reduce((acc, t) => acc + t.amount, 0);

        let percentage = 0;

        if (prevTotal > 0) {
            percentage = ((currentTotal - prevTotal) / prevTotal) * 100;
        }

        return {
            percentage: percentage.toFixed(1),
            isPositive: percentage >= 0
        };
    };


    // ✅ STEP 2: THEN USE IT
    const incomeStats = getMonthlyStats("Income");
    const expenseStats = getMonthlyStats("Expense");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;

    const currentData = filteredTransactions.slice(indexOfFirst, indexOfLast);
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
                    <p>View and Manage all your income and Expense Record</p>
                </div>
                <div className="welcome-actions">
                    <button className="btn-secondary" onClick={() => setActiveModal('income')}>Record Income</button>
                    <button className="btn-blue" onClick={() => setActiveModal('expense')}>Record Expense</button>
                </div>
            </div>


            {/* METRICS */}
            <div className="transmetrics-grid">


                <TransMetric
                    title="Total Income"
                    amount={`₹ ${totalIncome.toLocaleString('en-IN')}`}
                    percentage={incomeStats.percentage}
                    period="vs last month"
                    type={incomeStats.isPositive ? "positive" : "negative"}
                />

                <TransMetric
                    title="Total Expense"
                    amount={`₹ ${totalExpense.toLocaleString('en-IN')}`}
                    percentage={expenseStats.percentage}
                    period="vs last month"
                    type={expenseStats.isPositive ? "negative" : "positive"}
                />
                <TransMetric title="Net Balance" amount={`₹ ${netBalance.toLocaleString('en-IN')}`} type="success" />
                <TransMetric title="Total Transactions" amount={filteredTransactions.length} type="plain" />
            </div>

            {/* FILTER */}
            <div className="top-header">
                <div style={{ flex: 1 }}></div>

                <div className="header-actions">

                    <SelectTrigger
                        label={selectedCategory}
                        options={["All Categories", "Food", "Travel", "Shopping", "Bills"]}
                        onSelect={setSelectedCategory}
                    />

                    <SelectTrigger
                        label={selectedType}
                        options={["All Types", "Income", "Expense"]}
                        onSelect={setSelectedType}
                        variant="grey"
                    />
                </div>
            </div>

            {/* TABLE */}
            <TransactionTable
                data={currentData}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTransactions.length / perPage)}
                onPageChange={setCurrentPage}
                onDelete={handleDelete}
            />

        </div>
    );
};

export default Transactions;