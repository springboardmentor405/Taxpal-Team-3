import React, { useState, useEffect } from 'react';
import { Edit2, Lock, Eye, Check, X, Shield, Smartphone, Mail, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../sass/Settings.scss';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [categorySubTab, setCategorySubTab] = useState('Expense');

  // --- Profile State ---
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    location: ''
  });
  const [originalProfile, setOriginalProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch Profile & Notifications
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = profileRes.data;
        const initialProfile = {
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          role: profileData.role || '',
          location: profileData.location || ''
        };
        setProfile(initialProfile);
        setOriginalProfile(initialProfile);
        if (profileData.notificationSettings) {
          setNotifications(prev => ({ ...prev, ...profileData.notificationSettings }));
        }

        // Fetch Categories
        const catRes = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenseCategories(catRes.data.filter(c => c.type === 'Expense'));
        setIncomeCategories(catRes.data.filter(c => c.type === 'Income'));

      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in!");
        return;
      }
      await axios.put("http://localhost:5000/api/users/profile", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOriginalProfile(profile);
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    }
  };

  const handleProfileDiscard = () => {
    setProfile({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      location: ''
    });
    toast.info("Changes discarded and fields cleared");
  };

  // --- Categories State ---
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/categories", {
        name: newCategoryName,
        type: categorySubTab,
        color: ['red', 'purple', 'orange', 'blue', 'green'][Math.floor(Math.random() * 5)]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (categorySubTab === 'Expense') {
        setExpenseCategories(prev => [...prev, res.data]);
      } else {
        setIncomeCategories(prev => [...prev, res.data]);
      }
      setNewCategoryName('');
      toast.success("Category added!");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (type === 'Expense') {
        setExpenseCategories(prev => prev.filter(c => c._id !== id));
      } else {
        setIncomeCategories(prev => prev.filter(c => c._id !== id));
      }
      toast.success("Category deleted!");
    } catch (err) {
      toast.error("Failed to delete category");
    }
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

  const handleNotifSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/profile", {
        notificationSettings: notifications
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Notification preferences updated!");
    } catch (err) {
      toast.error("Failed to update preferences");
    }
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

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/change-password", {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Password updated successfully!");
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: security.twoFactor });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };


  const renderProfileTab = () => (
    <form className="settings-form" onSubmit={handleProfileSave}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} className="form-input" placeholder="Enter your first name" />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} className="form-input" placeholder="Enter your last name" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="form-input" placeholder="Enter your email address" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="form-input" placeholder="Enter your phone number" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Professional Role</label>
          <select name="role" value={profile.role} onChange={handleProfileChange} className="form-input form-select">
            <option value="" disabled>Select your role</option>
            <option value="freelancer">Freelancer</option>
            <option value="employee">Employee</option>
            <option value="business_owner">Business Owner</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location / City</label>
          <input type="text" name="location" value={profile.location} onChange={handleProfileChange} className="form-input" placeholder="Enter your location / city" />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={handleProfileDiscard}>Discard</button>
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
            <div className="category-item" key={cat._id || cat.id}>
              <div className="category-info">
                <div className={`color-dot ${cat.color}`}></div>
                <span className="category-name">{cat.name}</span>
              </div>
              <div className="category-actions">
                <Trash2 size={16} color="#ef4444" onClick={() => handleDeleteCategory(cat._id || cat.id, categorySubTab)} />
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

        <div className="alert-item">
          <div className="alert-info">
            <div className="icon-wrapper purple"><span className="balance-icon">📉</span></div>
            <span className="alert-name">Low Balance Warning</span>
          </div>
          <div className="alert-controls">
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications.lowBalance} onChange={() => handleNotifToggle('lowBalance')} />
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
           <button className="btn-save-small" onClick={handleNotifSave}>Save Changes</button>
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
