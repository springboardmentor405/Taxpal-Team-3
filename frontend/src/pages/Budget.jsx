import { useState, useEffect, useCallback } from "react";
import BudgetLayout from "../layouts/BudgetLayout";
import BudgetCards from "../components/Budget/BudgetCards";
import BudgetTable from "../components/Budget/BudgetTable";
import ExpenseBreakdown from "../components/Budget/ExpenseBreakdown";
import CreateBudgetModal from "../components/Budget/CreateBudgetModal";
import "../sass/Budget.scss";
import { Search, Bell } from 'lucide-react';

const Budget = () => {
  const [showModal, setShowModal] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("2023-10");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryColors = {
    "Business Expenses": "#e74c3c",
    "Office Rent":       "#3498db",
    "Software":          "#9b59b6",
    "Marketing":         "#f39c12",
    "Travel":            "#2ecc71",
  };

  const getStatus = (budget, spent) => {
    const pct = (spent / budget) * 100;
    if (pct > 100) return "Over Budget";
    if (pct === 100) return "At Limit";
    return "On Track";
  };

  const loadBudgets = useCallback((month) => {
    fetch(`http://localhost:5000/api/budgets?month=${month}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const mapped = data.data.map(b => ({
            id:        b._id,
            category:  b.category,
            color:     categoryColors[b.category] || "#1a6b87",
            budget:    b.budget_amount,
            spent:     b.spent,
            remaining: b.budget_amount - b.spent,
            status:    getStatus(b.budget_amount, b.spent)
          }));
          setBudgets(mapped);
          setFilteredBudgets(mapped);
        } else {
          setBudgets([]);
          setFilteredBudgets([]);
        }
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    loadBudgets(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBudgets(budgets);
    } else {
      setFilteredBudgets(
        budgets.filter(b =>
          b.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, budgets]);

  const totalBudget = filteredBudgets.reduce((s, b) => s + b.budget, 0);
  const totalSpent  = filteredBudgets.reduce((s, b) => s + b.spent,  0);
  const remaining   = totalBudget - totalSpent;

  const getBudgetHealth = () => {
    const pct = (totalSpent / totalBudget) * 100;
    if (pct > 100) return { label: "Over Budget", cls: "danger"  };
    if (pct > 85)  return { label: "At Risk",     cls: "warning" };
    return             { label: "Good",        cls: "good"    };
  };

  const handleCreateBudget = async (newBudget) => {
    try {
      const month = newBudget.month || selectedMonth;
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:      newBudget.category,
          budget_amount: newBudget.budget,
          month:         month,
          description:   newBudget.description || ''
        })
      });
      const data = await response.json();
      if (data.success) {
        setSelectedMonth(month);
        loadBudgets(month);
      } else {
        alert(data.message);
      }
    } catch(err) {
      console.log("Error:", err);
    }
    setShowModal(false);
  };

  return (
    <BudgetLayout>
      <div className="budget-page-content">
        <div className="budget-topbar">
          <div className="topbar-row1">
            <div className="topbar-left">
              <h1>Budget Management</h1>
              <p className="topbar-date">
                {new Date(selectedMonth + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="topbar-right">
              <div className="topbar-date-filter">
                📅
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151"
                  }}
                />
              </div>

              <div className="topbar-search-wrap">
                <Search size={14} color="#999" />
                <input
                  placeholder="Global Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
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
                selectedMonth={selectedMonth}
              />
            )}
            <BudgetTable budgets={filteredBudgets} onRefresh={() => loadBudgets(selectedMonth)} />
          </div>
          <div className="budget-right-col">
            <ExpenseBreakdown budgets={filteredBudgets} totalSpent={totalSpent} />
          </div>
        </div>
      </div>
    </BudgetLayout>
  );
};

export default Budget;