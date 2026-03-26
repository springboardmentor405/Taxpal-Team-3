import React from 'react';
import Sidebar from '../layouts/Sidebar';
import '../sass/BudgetLayout.scss';

const BudgetLayout = ({ children }) => {
     return (
        <div className="budget-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default BudgetLayout;

