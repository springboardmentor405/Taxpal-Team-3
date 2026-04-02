import { useState } from "react";

const API_BASE = (() => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const base = String(raw).replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();


const BudgetTable = ({ budgets, onRefresh }) => {
  const [editingBudget, setEditingBudget] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getStatusClass = (status) => {
    if (status === "On Track") return "status-good";
    if (status === "At Limit") return "status-limit";
    if (status === "Over Budget") return "status-over";
    return "";
  };

  const handleEditClick = (b) => {
    setEditingBudget(b);
    setEditForm({ budget_amount: b.budget, spent: b.spent });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${editingBudget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget_amount: parseFloat(editForm.budget_amount),
          spent: parseFloat(editForm.spent),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBudget(null);
        onRefresh();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
                  <td>₹{b.budget.toLocaleString('en-IN')}</td>
                  <td>₹{b.spent.toLocaleString('en-IN')}</td>
                  <td className={b.remaining < 0 ? "text-red" : "text-teal"}>
                    ₹{b.remaining.toLocaleString('en-IN')}
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
                    <button className="edit-btn" onClick={() => handleEditClick(b)}>
                      ✏ Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingBudget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h3>Edit Budget</h3>
                <p>{editingBudget.category}</p>
              </div>
              <button className="modal-close" onClick={() => setEditingBudget(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-field">
                  <label>Budget Amount</label>
                  <input
                    type="number"
                    value={editForm.budget_amount}
                    onChange={(e) => setEditForm({ ...editForm, budget_amount: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Spent</label>
                  <input
                    type="number"
                    value={editForm.spent}
                    onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditingBudget(null)}>Cancel</button>
              <button className="btn-create" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetTable;