import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import '../sass/DashboardLayout.scss';

const DashboardLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    {location.pathname !== '/settings' && (
                        <div className="search-bar">
                            <Search className="search-icon" size={20} />
                            <input type="text" placeholder="Search transactions, reports....." />
                        </div>
                    )}
                    <div className="header-actions">
                        <button className="notification-btn">
                            <Bell size={20} />
                        </button>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Alex Morgan</span>
                                <span className="user-role">Freelancer</span>
                            </div>
                            <div className="avatar">
                                <div className="avatar-fallback">AM</div>
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

export default DashboardLayout;
