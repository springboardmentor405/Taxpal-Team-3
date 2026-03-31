const BudgetCards = ({ totalBudget, totalSpent, remaining, health }) => {
  const cards = [
    {
      label: "Total Budget",
      icon: "💰",
      value: `$${totalBudget.toLocaleString()}`,
      progress: 100,
      progressColor: "#30829d",
      sub1: "Progress",
      sub1val: "100%",
      sub2: `$${totalBudget.toLocaleString()} Budgeted`,
    },
    {
      label: "Total Spend",
      icon: "💳",
      value: `$${totalSpent.toLocaleString()}`,
      progress: Math.min((totalSpent / totalBudget) * 100, 100),
      progressColor: "#6ebb9c",
      sub1: "Progress",
      sub1val: `${Math.round((totalSpent / totalBudget) * 100)}%`,
      sub2: `$${totalSpent.toLocaleString()} Spent`,
    },
    {
      label: "Remaining Budget",
      icon: "📊",
      value: `$${Math.max(remaining, 0).toLocaleString()}`,
      progress: Math.max((remaining / totalBudget) * 100, 0),
      progressColor: "#65ede0",
      sub1: "Progress",
      sub1val: `${Math.round(Math.max((remaining / totalBudget) * 100, 0))}%`,
      sub2: `$${Math.max(remaining, 0).toLocaleString()} Left`,
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
