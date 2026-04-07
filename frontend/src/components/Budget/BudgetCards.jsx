const BudgetCards = ({ totalBudget, totalSpent, remaining, health }) => {
  const pctSpentValue = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const pctRemValue   = totalBudget > 0 ? (Math.max(remaining, 0) / totalBudget) * 100 : 0;

  const cards = [
    {
      label: "Total Budget",
      icon: "💰",
      value: `₹${totalBudget.toLocaleString('en-IN')}`,
      progress: 100,
      progressColor: "#30829d",
      sub1: "Progress",
      sub1val: "100%",
      sub2: `₹${totalBudget.toLocaleString('en-IN')} Budgeted`,
    },
    {
      label: "Total Spend",
      icon: "💳",
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      progress: Math.min(pctSpentValue, 100),
      progressColor: "#6ebb9c",
      sub1: "Progress",
      sub1val: `${Math.round(pctSpentValue)}%`,
      sub2: `₹${totalSpent.toLocaleString('en-IN')} Spent`,
    },
    {
      label: "Remaining Budget",
      icon: "📊",
      value: `₹${Math.max(remaining, 0).toLocaleString('en-IN')}`,
      progress: pctRemValue,
      progressColor: "#65ede0",
      sub1: "Progress",
      sub1val: `${Math.round(pctRemValue)}%`,
      sub2: `₹${Math.max(remaining, 0).toLocaleString('en-IN')} Left`,
    },
  ];

  return (
    <div className="budget-cards-row">
      {cards.map((card, i) => (
        <div className="budget-card" key={i}>
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <span className="card-label">{card.label}</span>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-progress-row">
            <span className="card-progress-label">{card.sub1}</span>
            <span className="card-progress-pct">{card.sub1val}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${card.progress}%`, background: card.progressColor }}
            />
          </div>
          <div className="card-sub">{card.sub2}</div>
        </div>
      ))}

      {/* Budget Health card */}
      <div className="budget-card health-card">
        <div className="card-label">Budget health</div>
        <div className={`health-value ${health.cls}`}>{health.label}</div>
        <div className={`health-badge ${health.cls}`}>
          {health.cls === "good" ? "On Track" : health.cls === "warning" ? "At Risk" : "Over Budget"}
        </div>
      </div>
    </div>
  );
};

export default BudgetCards;
