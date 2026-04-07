import React, { useState, useEffect } from 'react';
import { Edit2, Lock, Eye, EyeOff, Shield, Smartphone, Mail, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../sass/Settings.scss';

import { API_BASE } from '../config/api';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [categorySubTab, setCategorySubTab] = useState('Expense');
  const [pageLoading, setPageLoading] = useState(true);

  // --- Profile State ---
  const emptyProfile = { firstName: '', lastName: '', email: '', phone: '', role: '', location: '' };
  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const [profileSaving, setProfileSaving] = useState(false);

  // --- Categories ---
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- Notifications ---
  const [notifications, setNotifications] = useState({
    taxReminder: true, budgetAlert: true, newTransaction: false, lowBalance: true,
    taxFreq: '3 days before', budgetFreq: 'At 80%', pushEnabled: true, emailEnabled: true,
  });
  const [notifSaving, setNotifSaving] = useState(false);

  // --- Security ---
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  // ─── Initial data fetch ───────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) { toast.error('Not logged in'); return; }

        const [profileRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/users/profile`, getAuthHeaders()),
          axios.get(`${API_BASE}/categories`, getAuthHeaders()),
        ]);

        const d = profileRes.data;
        const loaded = {
          firstName: d.firstName || '',
          lastName:  d.lastName  || '',
          email:     d.email     || '',
          phone:     d.phone     || '',
          role:      d.role      || '',
          location:  d.location  || '',
        };
        setProfile(loaded);
        setOriginalProfile(loaded);

        if (d.notificationSettings) {
          setNotifications(prev => ({ ...prev, ...d.notificationSettings }));
        }

        const cats = catRes.data;
        setExpenseCategories(cats.filter(c => c.type === 'Expense'));
        setIncomeCategories(cats.filter(c => c.type === 'Income'));
      } catch (err) {
        console.error('Failed to load settings:', err);
        toast.error('Could not load settings data');
      } finally {
        setPageLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ─── Profile ─────────────────────────────────────────────────────────
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await axios.put(`${API_BASE}/users/profile`, profile, getAuthHeaders());
      const d = res.data;
      const saved = {
        firstName: d.firstName || '', lastName: d.lastName || '',
        email: d.email || '', phone: d.phone || '',
        role: d.role || '', location: d.location || '',
      };
      setOriginalProfile(saved);
      setProfile(saved);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileDiscard = () => {
    setProfile(originalProfile);
    toast.info('Changes discarded');
  };

  // ─── Categories ──────────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/categories`, {
        name: newCategoryName.trim(),
        type: categorySubTab,
        color: ['red', 'purple', 'orange', 'blue', 'green'][Math.floor(Math.random() * 5)],
      }, getAuthHeaders());
      if (categorySubTab === 'Expense') setExpenseCategories(prev => [...prev, res.data]);
      else setIncomeCategories(prev => [...prev, res.data]);
      setNewCategoryName('');
      toast.success('Category added!');
    } catch {
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id, type) => {
    try {
      await axios.delete(`${API_BASE}/categories/${id}`, getAuthHeaders());
      if (type === 'Expense') setExpenseCategories(prev => prev.filter(c => (c._id || c.id) !== id));
      else setIncomeCategories(prev => prev.filter(c => (c._id || c.id) !== id));
      toast.success('Category deleted!');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  // ─── Notifications ───────────────────────────────────────────────────
  const handleNotifToggle = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const handleNotifChange = (e) => {
    const { name, value } = e.target;
    setNotifications(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifSave = async () => {
    setNotifSaving(true);
    try {
      await axios.put(`${API_BASE}/users/profile`, { notificationSettings: notifications }, getAuthHeaders());
      toast.success('Notification preferences saved!');
    } catch {
      toast.error('Failed to update preferences');
    } finally {
      setNotifSaving(false);
    }
  };

  // ─── Security ────────────────────────────────────────────────────────
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (security.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setPwdSaving(true);
    try {
      await axios.put(`${API_BASE}/users/change-password`, {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      }, getAuthHeaders());
      toast.success('Password updated successfully!');
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdSaving(false);
    }
  };

  // ─── Renderers ───────────────────────────────────────────────────────
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
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="form-input" placeholder="Enter your email" />
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
          <input type="text" name="location" value={profile.location} onChange={handleProfileChange} className="form-input" placeholder="Enter your location" />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={handleProfileDiscard}>Discard</button>
        <button type="submit" className="btn-save" disabled={profileSaving}>
          {profileSaving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </form>
  );

  const renderCategoriesTab = () => {
    const list = categorySubTab === 'Expense' ? expenseCategories : incomeCategories;
    return (
      <div className="categories-section">
        <div className="categories-subtabs">
          <button className={`subtab ${categorySubTab === 'Expense' ? 'active' : ''}`} onClick={() => setCategorySubTab('Expense')}>Expense Categories</button>
          <button className={`subtab ${categorySubTab === 'Income'  ? 'active' : ''}`} onClick={() => setCategorySubTab('Income')}>Income Categories</button>
        </div>
        <div className="categories-list">
          {list.map(cat => (
            <div className="category-item" key={cat._id || cat.id}>
              <div className="category-info">
                <div className={`color-dot ${cat.color}`}></div>
                <span className="category-name">{cat.name}</span>
              </div>
              <div className="category-actions">
                <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => handleDeleteCategory(cat._id || cat.id, categorySubTab)} />
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="empty-text">No categories yet. Add one below.</p>}
        </div>
        <div className="add-category-inline">
          <input
            type="text"
            placeholder="Type new category name..."
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="form-input add-cat-input"
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
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
        {[
          { key: 'taxReminder',    icon: '💰', label: 'Tax Due Date Reminder',  wrap: 'teal'   },
          { key: 'budgetAlert',    icon: '💳', label: 'Budget Exceeded Alert',   wrap: 'yellow' },
          { key: 'newTransaction', icon: '🔄', label: 'New Transaction Logged',  wrap: 'orange' },
          { key: 'lowBalance',     icon: '📉', label: 'Low Balance Warning',     wrap: 'purple' },
        ].map(({ key, icon, label, wrap }) => (
          <div className="alert-item" key={key}>
            <div className="alert-info">
              <div className={`icon-wrapper ${wrap}`}><span>{icon}</span></div>
              <span className="alert-name">{label}</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications[key]} onChange={() => handleNotifToggle(key)} />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
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
          <button className="btn-save-small" onClick={handleNotifSave} disabled={notifSaving}>
            {notifSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="security-section">
      <form onSubmit={handleSecuritySave} className="security-form-wrapper">
        <div className="change-password-box">
          <h3 className="section-title">Change Password</h3>
          {[
            { name: 'currentPassword', placeholder: 'Current Password',    showToggle: false },
            { name: 'newPassword',     placeholder: 'New Password',         showToggle: true  },
            { name: 'confirmPassword', placeholder: 'Confirm New Password', showToggle: false },
          ].map(({ name, placeholder, showToggle }) => (
            <div className="password-input-group" key={name}>
              <Lock className="input-icon-left" size={18} />
              <input
                type={showPwd ? 'text' : 'password'}
                name={name}
                placeholder={placeholder}
                value={security[name]}
                onChange={handleSecurityChange}
              />
              {showToggle && (
                <span className="input-icon-right" onClick={() => setShowPwd(v => !v)} style={{ cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              )}
            </div>
          ))}
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
            <span className="sec-badge">Coming Soon</span>
          </div>
        </div>
        <div className="security-actions">
          <button type="submit" className="btn-save-small" disabled={pwdSaving}>
            {pwdSaving ? 'Saving…' : 'Save Security Options'}
          </button>
        </div>
      </form>
    </div>
  );

  if (pageLoading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <p style={{ color: '#666', padding: '2rem' }}>Loading settings…</p>
        </div>
      </div>
    );
  }

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
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="tab-content">
          {activeTab === 'Profile'       && renderProfileTab()}
          {activeTab === 'Categories'    && renderCategoriesTab()}
          {activeTab === 'Notifications' && renderNotificationsTab()}
          {activeTab === 'Security'      && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
