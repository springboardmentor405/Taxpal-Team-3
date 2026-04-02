import React, { useState } from 'react';
import '../sass/TaxEstimator.scss';
import TaxCalculator from '../components/TaxEstimator/TaxCalculator';
import TaxSummary from '../components/TaxEstimator/TaxSummary';
import UserProfileHeader from '../components/Common/UserProfileHeader';

const TaxEstimator = () => {
    const [estimatedTax, setEstimatedTax] = useState(null);

    return (
        <div className="taxestimator-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0a0a38' }}>Tax Estimator</h1>
                <UserProfileHeader />
            </div>
            <TaxCalculator onResult={(tax) => setEstimatedTax(tax)} />
            <TaxSummary amount={estimatedTax !== null ? Math.round(estimatedTax) : 0} />
        </div>
    );
};

export default TaxEstimator;