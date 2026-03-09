import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MetricCard from '../components/Dashboard/MetricCard';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import ExpenseBreakdownChart from '../components/Dashboard/ExpenseBreakdownChart';
import '../sass/Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Good Morning, Alex</h1>
          <p>Here's what's happening with your business today.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-secondary">Download Reports</button>
          <button className="btn-blue">Add New Income</button>
          <button className="btn-blue">Add New Expenses</button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Monthly Expenses"
          amount="1,120.40"
          percentage="12.5"
          period="last month"
          isPositive={true}
          chartData="M0 20 Q25 10, 50 25 T100 15"
        />
        <MetricCard
          title="Savings Rate"
          amount="74.2"
          percentage="12.5"
          period="last month"
          isPositive={true}
          chartData="M0 25 L40 20 L60 15 L80 10 L100 5"
        />
        <MetricCard
          title="Monthly Income"
          amount="4,250.00"
          percentage="12.5"
          period="last month"
          isPositive={true}
          chartData="M0 25 Q20 20, 40 15 T80 5 T100 10"
        />
      </div>

      <div className="charts-grid">
        <IncomeExpenseChart />
        <ExpenseBreakdownChart />
      </div>
    </div>
  );
};

export default Dashboard;