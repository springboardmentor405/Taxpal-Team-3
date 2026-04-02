const ExpenseBreakdown = ({ budgets, totalSpent }) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const mergedMap = {};
  budgets.forEach(b => {
    if (mergedMap[b.category]) {
      mergedMap[b.category] += b.spent;
    } else {
      mergedMap[b.category] = b.spent;
    }
  });

  const items = Object.keys(mergedMap).map((category, i) => ({
    label: category,
    value: mergedMap[category],
    color: colors[i % colors.length],
    pct: totalSpent > 0 ? Math.round((mergedMap[category] / totalSpent) * 100) : 0,
  }));

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 65;
  const inner = 40;

  // Single item 
  const renderSlices = () => {
    if (items.length === 1) {
      return (
        <>
          <circle cx={cx} cy={cy} r={r} fill={items[0].color} />
        </>
      );
    }

    let cumulative = 0;
    return items.map((item, i) => {
      const startAngle = (cumulative / totalSpent) * 2 * Math.PI - Math.PI / 2;
      cumulative += item.value;
      const endAngle = (cumulative / totalSpent) * 2 * Math.PI - Math.PI / 2;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const ix1 = cx + inner * Math.cos(endAngle);
      const iy1 = cy + inner * Math.sin(endAngle);
      const ix2 = cx + inner * Math.cos(startAngle);
      const iy2 = cy + inner * Math.sin(startAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

      const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

      return <path key={i} d={d} fill={item.color} stroke="#fff" strokeWidth="2" />;
    });
  };

  const health = totalSpent > 0 ? "Good" : "—";

  return (
    <div className="expense-breakdown">
      <h3>Expense Breakdown</h3>
      <div className="chart-tabs">
        <button>Year</button>
        <button>Quarter</button>
        <button className="active">Month</button>
      </div>

      <div className="donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {totalSpent > 0 ? renderSlices() : (
            <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" />
          )}
          <circle cx={cx} cy={cy} r={inner - 2} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#6b7280">Total Spent</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111827">
            ₹{totalSpent.toLocaleString('en-IN')}
          </text>
        </svg>
      </div>

      <div className="breakdown-legend">
        {items.map((item, i) => (
          <div className="legend-row" key={i}>
            <span className="legend-dot" style={{ background: item.color }} />
            <span className="legend-label">{item.label}</span>
            <span className="legend-pct">{item.pct}%</span>
          </div>
        ))}
      </div>

      <div className="budget-health-row">
        <span>Budget Heath</span>
        <span className="health-tag good">{health}</span>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;