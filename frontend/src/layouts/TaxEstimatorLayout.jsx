import React from 'react';
import Sidebar from './Sidebar';
import '../sass/TaxEstimatorLayout.scss';

const TaxEstimatorLayout = ({ children }) => {
    return (
        <div className="taxestimator-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TaxEstimatorLayout;