import React from 'react';
import '../../sass/MetricCard.scss';

const MetricCard = ({ title, amount, percentage, period, isPositive, chartData }) => {
    return (
        <div className="metric-card">
            <div className="metric-header">
                <h3 className="metric-title">{title}</h3>
                <div className="metric-sparkline">
                    <svg viewBox="0 0 100 30" className={`sparkline ${isPositive ? 'positive' : 'negative'}`}>
                        <path
                            d={chartData || "M0 15 Q25 5, 50 15 T100 10"}
                            fill="none"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>
            <div className="metric-amount">
                {title.includes('Rate') ? '' : '$'}
                {amount}
                {title.includes('Rate') ? '%' : ''}
            </div>
            <div className="metric-footer">
                <span className={`metric-percentage ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{percentage}%
                </span>
                <span className="metric-period"> vs {period}</span>
            </div>
        </div>
    );
};

export default MetricCard;
