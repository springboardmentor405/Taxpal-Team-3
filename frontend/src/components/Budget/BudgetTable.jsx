const BudgetTable = ({ budgets }) => {
  const getStatusClass = (status) => {
    if (status === "On Track") return "status-good";
    if (status === "At Limit") return "status-limit";
    if (status === "Over Budget") return "status-over";
    return "";
  };

  return (
    <div className="budget-table-wrap">
      <table className="budget-table">
        <thead>
          <tr>
            <th>CATEGORY</th>
            <th>BUDGET</th>
            <th>SPENT</th>
            <th>REMAINING</th>
            <th>PROGRESS</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => {
            const pct = Math.min((b.spent / b.budget) * 100, 100);
            return (
              <tr key={b.id}>
                <td>
                  <span className="cat-dot" style={{ background: b.color }} />
                  {b.category}
                </td>
                <td>${b.budget.toLocaleString()}</td>
                <td>${b.spent.toLocaleString()}</td>
                <td className={b.remaining < 0 ? "text-red" : "text-teal"}>
                  ${b.remaining.toLocaleString()}
                </td>
                <td>
                  <div className="table-progress-bg">
                    <div
                      className="table-progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: b.remaining < 0 ? "#e74c3c" : "#22c55e",
                      }}
                    />
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <button className="edit-btn">✏ Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable;