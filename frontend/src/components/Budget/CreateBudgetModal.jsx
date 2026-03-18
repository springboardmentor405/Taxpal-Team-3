import { useState } from "react";

const CATEGORIES = [
  "Business Expenses", "Office Rent", "Software", "Marketing",
  "Travel", "Utilities", "Food", "Rent/Mortgage", "Other"
];

const CreateBudgetModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    category: "",
    budget: "",
    month: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!form.category || !form.budget) return;
    onCreate({
      category: form.category,
      budget: parseFloat(form.budget),
      color: "#2563eb",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h3>Create New Budget</h3>
            <p>Set a spending limit for Category</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-row">
            <div className="modal-field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select a Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label>Budget Amount</label>
              <input
                type="number"
                placeholder="$0.00"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-field">
            <label>Month</label>
            <input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            />
          </div>

          <div className="modal-field">
            <label>Description (Optional)</label>
            <textarea
              placeholder="Add any additional details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleSubmit}>Create Budget</button>
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetModal;
