import React from 'react';
import '../../sass/TransMetric.scss';

import { FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';

const TransMetric = ({ title, amount, percentage, period, type }) => {

    let statusClass = '';
    let IconComponent = null;

    switch (type) {
        case 'positive':
            statusClass = 'positive';
            IconComponent = FaArrowUp;
            break;

        case 'negative':
            statusClass = 'negative';
            IconComponent = FaArrowDown;
            break;

        case 'success':
            statusClass = 'success';
            IconComponent = FaCheck;
            break;

        default:
            statusClass = 'plain';
            IconComponent = null;
    }

    return (
        <div className="metric-card">
            <h3 className="metric-title">{title}</h3>
            <span className={`metric-amount ${statusClass}`}>
                {amount}
            </span>

            <div className={`metric-percentage ${statusClass}`}>

                {IconComponent && (
                    <span className="icon">
                        <IconComponent />
                    </span>
                )}

                {/* TEXT */}
                {type === 'positive' && percentage !== undefined && `${percentage}% vs ${period}`}
                {type === 'negative' && percentage !== undefined && `${percentage}% vs ${period}`}
                {type === 'success' && `Positive`}
                {type === 'plain' && `This month`}

            </div>
        </div>
    );
};

export default TransMetric;