import React, { useState } from 'react';
import '../sass/TaxEstimator.scss';
import TaxCalculator from '../components/TaxEstimator/TaxCalculator';
import TaxSummary from '../components/TaxEstimator/TaxSummary';

const TaxEstimator = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [currentDate, setCurrentDate] = useState('May 5-2025');
    const [isOpen, setIsOpen] = useState(false);

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
        console.log("Open calendar picker UI here");
    };

    const handleSave = (data) => {
        console.log('Saved transaction:', data);
    };

    return (
        <div className="taxestimator-page">
            {activeModal && (
                <TransactionModal
                    type={activeModal}
                    onClose={() => setActiveModal(null)}
                    onSave={handleSave}
                />
            )}

            <TaxCalculator />
            <TaxSummary />

        </div>

    );
};
export default TaxEstimator;