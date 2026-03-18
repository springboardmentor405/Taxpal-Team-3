import { useState } from "react";
import BudgetLayout from "../layouts/BudgetLayout";
import BudgetCards from "../components/Budget/BudgetCards";
import BudgetTable from "../components/Budget/BudgetTable";
import ExpenseBreakdown from "../components/Budget/ExpenseBreakdown";
import CreateBudgetModal from "../components/Budget/CreateBudgetModal";
import "../sass/Budget.scss";
import { Search, Bell } from 'lucide-react';

const Budget = () => {
  const [showModal, setShowModal] = useState(false);
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Business Expenses", color: "#e74c3c", budget: 1200, spent: 840, remaining: 360, status: "On Track" },
    { id: 2, category: "Office Rent",        color: "#3498db", budget: 800,  spent: 800, remaining: 0,   status: "At Limit" },
    { id: 3, category: "Software",           color: "#9b59b6", budget: 300,  spent: 245, remaining: 55,  status: "On Track" },
    { id: 4, category: "Marketing",          color: "#f39c12", budget: 500,  spent: 530, remaining: -30, status: "Over Budget" },
    { id: 5, category: "Travel",             color: "#2ecc71", budget: 400,  spent: 180, remaining: 220, status: "On Track" },
  ]);

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  const getBudgetHealth = () => {
    const pct = (totalSpent / totalBudget) * 100;
    if (pct > 100) return { label: "Over Budget", cls: "danger" };
    if (pct > 85)  return { label: "At Risk",     cls: "warning" };
    return { label: "Good", cls: "good" };
  };

  const handleCreateBudget = (newBudget) => {
    setBudgets([...budgets, { ...newBudget, id: Date.now(), spent: 0, remaining: newBudget.budget, status: "On Track" }]);
    setShowModal(false);
  };

  return (
   <BudgetLayout>
      <div className="budget-page-content">
        {/* Top bar */}
        <div className="budget-topbar">
  <div className="topbar-row1">
    <div className="topbar-left">
      <h1>Budget Management</h1>
      <p className="topbar-date">October 2023</p>
    </div>
    <div className="topbar-right">
      <div className="topbar-date-filter">
        📅 Oct 1-2023 ▾
      </div>
      <div className="topbar-search-wrap">
        <Search size={14} color="#999" />
        <input placeholder="Global Search" />
      </div>
      <Bell size={20} color="#666" />
      <div className="topbar-user">
        <div>
          <p className="user-name">Alex Morgan</p>
          <p className="user-role">Freelancer</p>
        </div>
        <div className="user-avatar">AM</div>
      </div>
    </div>
  </div>
  <div className="topbar-row2">
    <button className="btn-add-budget" onClick={() => setShowModal(true)}>
      + Add New Budget
    </button>
  </div>
</div>

        <div className="budget-content">
          <div className="budget-left-col">
            <BudgetCards
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              remaining={remaining}
              health={getBudgetHealth()}
            />
            {showModal && (
              <CreateBudgetModal
                onClose={() => setShowModal(false)}
                onCreate={handleCreateBudget}
              />
            )}
            <BudgetTable budgets={budgets} />
          </div>
          <div className="budget-right-col">
            <ExpenseBreakdown budgets={budgets} totalSpent={totalSpent} />
          </div>
        </div>
      </div>
    </BudgetLayout>
  );
};

export default Budget;