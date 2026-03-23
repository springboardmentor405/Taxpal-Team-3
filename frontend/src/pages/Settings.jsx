import React, { useState } from 'react';
import { Edit2, Lock, Eye, Check, X, Shield, Smartphone, Mail, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import '../sass/Settings.scss';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [categorySubTab, setCategorySubTab] = useState('Expense');

  // --- Profile State ---
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    role: 'freelancer',
    location: 'San Francisco, CA',
    taxId: '',
    address: '',
    timezone: 'PST',
    currency: 'USD'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Profile saved successfully!");
  };

  // --- Categories State ---
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: 'Business Expenses', color: 'red' },
    { id: 2, name: 'Software Subscriptions', color: 'purple' },
    { id: 3, name: 'Professional Development', color: 'orange' },
    { id: 4, name: 'Travel', color: 'red' }
  ]);
  const [incomeCategories, setIncomeCategories] = useState([
    { id: 1, name: 'Client Payments', color: 'green' },
    { id: 2, name: 'Consulting Fees', color: 'blue' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = {
      id: Date.now(),
      name: newCategoryName,
      color: ['red', 'purple', 'orange', 'blue', 'green'][Math.floor(Math.random() * 5)]
    };
    if (categorySubTab === 'Expense') {
      setExpenseCategories(prev => [...prev, newCat]);
    } else {
      setIncomeCategories(prev => [...prev, newCat]);
    }
    setNewCategoryName('');
    toast.success("Category added!");
  };

  const handleDeleteCategory = (id, type) => {
    if (type === 'Expense') {
      setExpenseCategories(prev => prev.filter(c => c.id !== id));
    } else {
      setIncomeCategories(prev => prev.filter(c => c.id !== id));
    }
    toast.success("Category deleted!");
  };

  // --- Notifications State ---
  const [notifications, setNotifications] = useState({
    taxReminder: true,
    budgetAlert: true,
    newTransaction: false,
    lowBalance: true,
    taxFreq: '3 days before',
    budgetFreq: 'At 80%',
    pushEnabled: true,
    emailEnabled: true
  });

  const handleNotifToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotifChange = (e) => {
    const { name, value } = e.target;
    setNotifications(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifSave = () => {
    toast.success("Notification preferences updated!");
  };

  // --- Security State ---
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true
  });
  const [showPwd, setShowPwd] = useState(false);

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Security settings configured successfully!");
    setSecurity({currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: security.twoFactor});
  };

  // ==== RENDERERS ====

  const renderProfileTab = () => (
    <form className="settings-form" onSubmit={handleProfileSave}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Professional Role</label>
          <select name="role" value={profile.role} onChange={handleProfileChange} className="form-input form-select">
            <option value="freelancer">Freelancer</option>
            <option value="employee">Employee</option>
            <option value="business_owner">Business Owner</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location / City</label>
          <input type="text" name="location" value={profile.location} onChange={handleProfileChange} className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Taxpayer ID (SSN/EIN)</label>
          <input type="text" name="taxId" value={profile.taxId} onChange={handleProfileChange} placeholder="XXX-XX-XXXX" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Full Address</label>
          <input type="text" name="address" value={profile.address} onChange={handleProfileChange} placeholder="123 Main St, Apt 4B" className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Preferred Currency</label>
          <select name="currency" value={profile.currency} onChange={handleProfileChange} className="form-input form-select">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select name="timezone" value={profile.timezone} onChange={handleProfileChange} className="form-input form-select">
            <option value="PST">Pacific Time (PT)</option>
            <option value="EST">Eastern Time (ET)</option>
            <option value="UTC">Coordinated Universal Time (UTC)</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel">Discard</button>
        <button type="submit" className="btn-save">Save Profile</button>
      </div>
    </form>
  );

  const renderCategoriesTab = () => {
    const list = categorySubTab === 'Expense' ? expenseCategories : incomeCategories;

    return (
      <div className="categories-section">
        <div className="categories-subtabs">
          <button 
            className={`subtab ${categorySubTab === 'Expense' ? 'active' : ''}`}
            onClick={() => setCategorySubTab('Expense')}
          >
            Expense Categories
          </button>
          <button 
            className={`subtab ${categorySubTab === 'Income' ? 'active' : ''}`}
            onClick={() => setCategorySubTab('Income')}
          >
            Income Categories
          </button>
        </div>

        <div className="categories-list">
          {list.map(cat => (
            <div className="category-item" key={cat.id}>
              <div className="category-info">
                <div className={`color-dot ${cat.color}`}></div>
                <span className="category-name">{cat.name}</span>
              </div>
              <div className="category-actions">
                <Edit2 size={16} />
                <Trash2 size={16} color="#ef4444" onClick={() => handleDeleteCategory(cat.id, categorySubTab)} />
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="empty-text">No categories found.</p>}
        </div>

        <div className="add-category-inline">
          <input 
            type="text" 
            placeholder="Type new category name..." 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="form-input add-cat-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button className="add-category-btn-small" onClick={handleAddCategory}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    );
  };

  const renderNotificationsTab = () => (
    <div className="notifications-section">
      <div className="delivery-methods">
        <h3 className="section-title">Delivery Methods</h3>
        <div className="delivery-item">
          <div className="icon-wrapper blue"><Mail size={16} /></div>
          <span className="method-name">Email Notifications</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={notifications.emailEnabled} onChange={() => handleNotifToggle('emailEnabled')} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="delivery-item">
          <div className="icon-wrapper green"><Smartphone size={16} /></div>
          <span className="method-name">Push Notifications</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={notifications.pushEnabled} onChange={() => handleNotifToggle('pushEnabled')} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="alert-preferences">
        <h3 className="section-title">Alert Preferences</h3>
        
        <div className="alert-item">
          <div className="alert-info">
            <div className="icon-wrapper teal"><span className="money-icon">💰</span></div>
            <span className="alert-name">Tax Due Date Reminder</span>
          </div>
          <div className="alert-controls">
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications.taxReminder} onChange={() => handleNotifToggle('taxReminder')} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="alert-item">
          <div className="alert-info">
            <div className="icon-wrapper yellow"><span className="wallet-icon">💳</span></div>
            <span className="alert-name">Budget Exceeded Alert</span>
          </div>
          <div className="alert-controls">
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications.budgetAlert} onChange={() => handleNotifToggle('budgetAlert')} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="alert-item">
          <div className="alert-info">
            <div className="icon-wrapper orange"><span className="sync-icon">🔄</span></div>
            <span className="alert-name">New Transaction logged</span>
          </div>
          <div className="alert-controls">
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications.newTransaction} onChange={() => handleNotifToggle('newTransaction')} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="reminder-frequency">
        <h3 className="section-title">Reminder Frequency</h3>
        <div className="frequency-row">
          <span className="frequency-label">Tax deadline reminder</span>
          <select name="taxFreq" className="frequency-select" value={notifications.taxFreq} onChange={handleNotifChange}>
            <option>3 days before</option>
            <option>1 week before</option>
            <option>2 weeks before</option>
          </select>
        </div>
        <div className="frequency-row">
          <span className="frequency-label">Budget Warning</span>
          <select name="budgetFreq" className="frequency-select" value={notifications.budgetFreq} onChange={handleNotifChange}>
            <option>At 50%</option>
            <option>At 80%</option>
            <option>At 90%</option>
          </select>
        </div>
        <div className="notifications-actions">
           <button className="btn-save-small" onClick={handleNotifSave}>Update Notifications</button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="security-section">
      <form onSubmit={handleSecuritySave} className="security-form-wrapper">
        <div className="change-password-box">
          <h3 className="section-title">Change Password</h3>
          
          <div className="password-input-group">
            <Lock className="input-icon-left" size={18} />
            <input 
              type={showPwd ? "text" : "password"} 
              name="currentPassword"
              placeholder="Current Password" 
              value={security.currentPassword}
              onChange={handleSecurityChange}
            />
          </div>

          <div className="password-input-group">
            <Lock className="input-icon-left" size={18} />
            <input 
              type={showPwd ? "text" : "password"} 
              name="newPassword"
              placeholder="Enter a new password" 
              value={security.newPassword}
              onChange={handleSecurityChange}
            />
            <Eye className="input-icon-right" size={18} onClick={() => setShowPwd(!showPwd)} />
          </div>
          
          <div className="password-input-group">
            <Lock className="input-icon-left" size={18} />
            <input 
              type={showPwd ? "text" : "password"} 
              name="confirmPassword"
              placeholder="Confirm new Password" 
              value={security.confirmPassword}
              onChange={handleSecurityChange}
            />
          </div>
        </div>

        <div className="extra-security-box">
          <h3 className="section-title">Additional Security</h3>
          <div className="security-item">
            <div className="sec-info">
              <Shield size={20} color="#1C88C7" />
              <div className="sec-text">
                <span className="sec-name">Two-Factor Authentication (2FA)</span>
                <span className="sec-desc">Add an extra layer of security requiring a code to log in.</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="twoFactor" checked={security.twoFactor} onChange={(e) => setSecurity(p => ({...p, twoFactor: e.target.checked}))} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="security-actions">
          <button type="submit" className="btn-save-small">Save Security Options</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account settings and preferences</p>
        </div>

        <div className="settings-navigation">
          <div className="profile-section-inline">
            <div className="avatar-wrapper">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="profile-avatar" />
              <button className="edit-avatar-btn">
                <Edit2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="tabs-container">
            {['Profile', 'Categories', 'Notifications', 'Security'].map(tab => (
              <button 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'Profile' && renderProfileTab()}
          {activeTab === 'Categories' && renderCategoriesTab()}
          {activeTab === 'Notifications' && renderNotificationsTab()}
          {activeTab === 'Security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
