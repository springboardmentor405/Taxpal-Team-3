import React from 'react';
import '../../sass/MetricCard.scss';

const MetricCard = ({ title, amount, percentage, period, isPositive, chartData }) => {
  const pct = Number(percentage);
  const hasChange = !isNaN(pct);
  // "Savings Rate" card shows amount as a percentage itself
  const isSavings = title.toLowerCase().includes('rate');

  return (
    <div className="metric-card">
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-sparkline">
          <svg viewBox="0 0 100 30" className={`sparkline ${isPositive ? 'positive' : 'negative'}`}>
            <path
              d={chartData || 'M0 15 Q25 5, 50 15 T100 10'}
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="metric-amount">
        {isSavings ? `${amount}%` : `₹${amount}`}
      </div>

      <div className="metric-footer">
        {hasChange ? (
          <>
            <span className={`metric-percentage ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '▲' : '▼'} {pct.toFixed(1)}%
            </span>
            <span className="metric-period">{period}</span>
          </>
        ) : (
          <span className="metric-period" style={{ color: '#aaa', fontSize: '0.8rem' }}>No previous data</span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
