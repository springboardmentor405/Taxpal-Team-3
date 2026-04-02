import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserProfileHeader from '../components/Common/UserProfileHeader';
import '../sass/TransactionsLayout.scss';

const TransactionsLayout = ({ children }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="transactions-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    <div style={{ flex: 1 }}></div>
                    <div className="header-actions">
                        <UserProfileHeader />
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