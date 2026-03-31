import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../config/api';
import '../sass/Budgets.scss';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for budget data fetch
    setLoading(false);
  }, []);

  return (
    <div className="budgets-page">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Budgets</h1>
          <p>Manage and track your spending limits</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-blue">+ Create Budget</button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No budgets created yet. Start by creating your first budget!</p>
        </div>
      ) : (
        <div className="budgets-grid">
          {/* Budget cards will be rendered here */}
        </div>
      )}
    </div>
  );
};

export default Budgets;
