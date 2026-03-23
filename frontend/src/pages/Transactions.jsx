import React, { useState } from 'react';
import '../sass/Transactions.scss';
import TransMetric from '../components/Transactions/TransMetric.';
import DatePickerTrigger from '../components/Transactions/DatePickerTrigger';
import { Search, Bell } from 'lucide-react';
import SelectTrigger from '../components/Transactions/SelectTrigger';
import ExportButton from '../components/Transactions/Exportbtn';
import TransactionTable from '../components/Transactions/TransactionTable';


const Transactions = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [currentDate, setCurrentDate] = useState('May 5-2025');
    const [isOpen, setIsOpen] = useState(false);

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
        console.log("Open calendar picker UI here");
    };

    const handleSave = (data) => {
        console.log('Saved transaction:', data);
        // TODO: send to backend
    };

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
                    amount="$ 4,500.00"
                    percentage="8.2"
                    period="last month"
                    type="positive"
                />
                <TransMetric
                    title="Total Expense"
                    amount="$ 7,245.00"
                    percentage="8.2"
                    period="last month"
                    type="negative"
                />
                <TransMetric
                    title="Net Balance"
                    amount="$ 5,234.400"
                    period="Positive"
                    type="success"
                />
                <TransMetric
                    title="Total Transactions"
                    amount="40"
                    period="This Month"
                    type="plain"
                />
            </div>

            <div className="top-header">
                {location.pathname !== '/settings' && (
                    <div className="search-bar">
                        <Search className="search-icon" size={20} />
                        <input type="text" placeholder="Search transactions......" />
                    </div>
                )}
                <div className="header-actions">


                    <SelectTrigger
                        label="All Categories"
                        variant="default"
                    />
                    <SelectTrigger
                        label="All Types"
                        variant="grey"
                    />
                    <DatePickerTrigger
                        date={currentDate}
                        onClick={toggleDatePicker}
                    />
                    <ExportButton />

                </div>
            </div>
            <TransactionTable />
        </div>

    );
};
export default Transactions;