import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import UserProfileHeader from '../components/Common/UserProfileHeader';
import axios from 'axios';
import '../sass/DashboardLayout.scss';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    {/* Hide search-bar and bell-icon specifically for the Reports page as requested */}
                    {!isDashboard && location.pathname !== '/settings' && location.pathname !== '/reports' && (
                        <div className="search-bar">
                            <Search className="search-icon" size={20} />
                            <input type="text" placeholder="Search transactions, reports....." />
                        </div>
                    )}
                    <div className="header-actions">
                        {!isDashboard && location.pathname !== '/reports' && (
                            <button className="notification-btn">
                                <Bell size={20} />
                            </button>
                        )}
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

export default DashboardLayout;
