import React, { useState } from 'react';
import '../sass/TaxEstimator.scss';
import TaxCalculator from '../components/TaxEstimator/TaxCalculator';
import TaxSummary from '../components/TaxEstimator/TaxSummary';

const TaxEstimator = () => {

    // 🔥 MAIN STATE
    const [taxResult, setTaxResult] = useState(null);

    return (
        <div className="taxestimator-page">

            {/* SEND FUNCTION */}
            <TaxCalculator setTaxResult={setTaxResult} />

            {/* RECEIVE DATA */}
            <TaxSummary amount={taxResult?.estimatedTax || 0} />

        </div>
    );
};

export default TaxEstimator;