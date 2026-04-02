import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, RefreshCw, Wallet, Calculator, BarChart3, Settings, LogOut } from 'lucide-react';
import UserProfileHeader from '../components/Common/UserProfileHeader';
import myLogo from '../assets/images/logo.svg'; 
import '../sass/Sidebar.scss';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutGrid size={20} />, path: '/dashboard' },
    { name: 'Transactions', icon: <RefreshCw size={20} />, path: '/transactions' },
    { name: 'Budgets', icon: <Wallet size={20} />, path: '/budgets' },
    { name: 'Tax Estimator', icon: <Calculator size={20} />, path: '/tax-estimator' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={myLogo} alt="Logo" className="logo-img" />
        <h2 className="brand-name">Tax Pal</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className={`nav-pill ${isActive(item.path) ? 'active' : ''}`}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <UserProfileHeader variant="sidebar" />
        <div className="footer-links">
          <Link to="/settings" className="footer-link">
            <Settings size={18} /> <span>Settings</span>
          </Link>
          <Link to="/login" className="footer-link">
            <LogOut size={18} /> <span>Log out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;