import React from 'react';
import '../../sass/TransMetric.scss';
import { FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';

const TransMetric = ({ title, amount, percentage, period, type }) => {
  let statusClass    = '';
  let IconComponent  = null;

  switch (type) {
    case 'positive':
      statusClass   = 'positive';
      IconComponent = FaArrowUp;
      break;
    case 'negative':
      statusClass   = 'negative';
      IconComponent = FaArrowDown;
      break;
    case 'success':
      statusClass   = 'success';
      IconComponent = FaCheck;
      break;
    default:
      statusClass   = 'plain';
      IconComponent = null;
  }

  // Build the sub-label text
  const hasPercentage = percentage !== null && percentage !== undefined;
  let subLabel = '';
  if (type === 'success')           subLabel = 'Positive balance';
  else if (type === 'plain')        subLabel = 'This period';
  else if (hasPercentage && period) subLabel = `${percentage}% ${period}`;
  else                              subLabel = 'No previous data';

  return (
    <div className="metric-card">
      <h3 className="metric-title">{title}</h3>

      <span className={`metric-amount ${statusClass}`}>
        {amount}
      </span>

      <div className={`metric-percentage ${statusClass}`}>
        {IconComponent && (
          <span className="icon"><IconComponent /></span>
        )}
        <span>{subLabel}</span>
      </div>
    </div>
  );
};

export default TransMetric;
