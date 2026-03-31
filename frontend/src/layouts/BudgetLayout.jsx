import React from 'react';
import Sidebar from '../components/Budget/Sidebar';

const BudgetLayout = ({ children }) => {
    return (
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            overflow: 'hidden', 
            backgroundColor: '#F8F9FB' 
        }}>
            <Sidebar />
            <main style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflowY: 'auto', 
                marginLeft: '240px',
                height: '100vh',
                minHeight: 0
            }}>
                <div style={{ 
                    padding: '1.5rem 2rem', 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default BudgetLayout;