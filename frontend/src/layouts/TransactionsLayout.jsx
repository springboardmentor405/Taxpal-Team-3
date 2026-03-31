import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DatePickerTrigger from '../components/Transactions/DatePickerTrigger'; // Ensure this path is correct
import { Search, Bell } from 'lucide-react';
import '../sass/TransactionsLayout.scss';

const TransactionsLayout = ({ children }) => {
    const [currentDate, setCurrentDate] = useState('Oct 2026');
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
        console.log("Open calendar picker UI here");
    };

    return (
        <div className="transactions-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    <h2>TaxPal - Transactions</h2>
                    <div className="header-actions">
                        <div className="filter-section">
                            <DatePickerTrigger
                                date={currentDate}
                                onClick={toggleDatePicker}
                            />
                        </div>
                        {location.pathname !== '/settings' && (
                            <div className="search-bar">
                                <Search className="search-icon" size={20} />
                                <input type="text" placeholder="Global Search....." />
                            </div>
                        )}
                        <button className="notification-btn">
                            <Bell size={20} />
                        </button>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">{user?.name || "User"}</span>
                                <span className="user-role">{user?.email || "No Email"}</span>
                            </div>
                            <div className="avatar">
                                <div className="avatar-fallback">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TransactionsLayout;