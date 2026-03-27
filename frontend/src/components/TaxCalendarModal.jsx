import React, { useState, useEffect } from 'react';
import { CalendarDays, X, Trash2, CheckCircle2, Plus } from 'lucide-react';
import './TaxCalendarModal.scss';

const initialEvents = [
  { _id: '1', month: 'June 2025', date: 'June 1, 2025', title: 'Remainder : Q2 Estimated Tax Payment', description: 'Remainder for upcoming Q2 estimated tax payment due on Jun 15, 2025.', type: 'reminder', paid: false },
  { _id: '2', month: 'June 2025', date: 'June 15, 2025', title: 'Q2 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
  { _id: '3', month: 'September 2025', date: 'Sep 1, 2025', title: 'Remainder : Q3 Estimated Tax Payment', description: 'Remainder for upcoming Q3 estimated tax payment due on Sep 15, 2025.', type: 'reminder', paid: false },
  { _id: '4', month: 'September 2025', date: 'Sep 15, 2025', title: 'Q3 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
  { _id: '5', month: 'December 2025', date: 'Dec 1, 2025', title: 'Remainder : Q4 Estimated Tax Payment', description: 'Remainder for upcoming Q4 estimated tax payment due on Dec 15, 2025.', type: 'reminder', paid: false },
  { _id: '6', month: 'December 2025', date: 'Dec 15, 2025', title: 'Q4 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
  { _id: '7', month: 'April 2026', date: 'Apr 1, 2026', title: 'Remainder : Q1 Estimated Tax Payment', description: 'Remainder for upcoming Q1 estimated tax payment due on Apr 15, 2026.', type: 'reminder', paid: false },
  { _id: '8', month: 'April 2026', date: 'Apr 15, 2026', title: 'Q1 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
];

const taxCalendarAPI = {
  getAll: () => new Promise(res => setTimeout(() => res([...initialEvents]), 400)),
  create: (data) => new Promise(res => setTimeout(() => res({ ...data, _id: Date.now().toString(), paid: false }), 300)),
  delete: (id) => new Promise(res => setTimeout(() => res({ success: true }), 300)),
  markPaid: (id) => new Promise(res => setTimeout(() => res({ success: true }), 300)),
};

const emptyForm = { month: '', date: '', title: '', description: '', type: 'payment' };

const TaxCalendarModal = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      taxCalendarAPI.getAll().then(data => { setEvents(data); setLoading(false); });
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.month) return;
    setSubmitting(true);
    const newEvent = await taxCalendarAPI.create(form);
    setEvents(prev => [...prev, newEvent]);
    setForm(emptyForm);
    setShowAddForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    await taxCalendarAPI.delete(id);
    setEvents(prev => prev.filter(e => e._id !== id));
  };

  const handleMarkPaid = async (id) => {
    await taxCalendarAPI.markPaid(id);
    setEvents(prev => prev.map(e => e._id === id ? { ...e, paid: true } : e));
  };

  const grouped = events.reduce((acc, e) => {
    if (!acc[e.month]) acc[e.month] = [];
    acc[e.month].push(e);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="tcm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tcm-modal">

        {/* HEADER */}
        <div className="tcm-header">
          <div>
            <h2 className="tcm-title">Tax Calendar</h2>
            <p className="tcm-subtitle">Keep track of your upcoming estimated tax payment deadlines</p>
          </div>
          <button className="tcm-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* EVENT LIST */}
        <div className="tcm-body">
          {loading ? (
            <div className="tcm-loading"><div className="tcm-spinner" /><span>Loading...</span></div>
          ) : (
            Object.entries(grouped).map(([month, evs]) => (
              <div key={month} className="tcm-month-section">
                <div className="tcm-month-heading">{month}</div>
                {evs.map(ev => (
                  <div key={ev._id} className={`tcm-event-card${ev.paid ? ' paid' : ''}`}>
                    <div className="tcm-event-icon">
                      <CalendarDays size={18} color="#2563eb" />
                    </div>
                    <div className="tcm-event-body">
                      <div className="tcm-event-title">{ev.title}</div>
                      <div className="tcm-event-date">{ev.date}</div>
                      <div className="tcm-event-desc">{ev.description}</div>
                    </div>
                    <div className="tcm-event-right">
                      <span className={`tcm-badge tcm-badge-${ev.paid ? 'paid' : ev.type}`}>
                        {ev.paid ? 'paid ✓' : ev.type}
                      </span>
                      <div className="tcm-event-actions">
                        {ev.type === 'payment' && !ev.paid && (
                          <button className="tcm-act-btn" title="Mark as Paid" onClick={() => handleMarkPaid(ev._id)}>
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button className="tcm-act-btn danger" title="Delete" onClick={() => handleDelete(ev._id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}

          {/* ADD EVENT FORM */}
          {showAddForm && (
            <div className="tcm-add-form">
              <h4>Add Tax Event</h4>
              <div className="tcm-form-row">
                <div className="tcm-form-field">
                  <label>Month</label>
                  <input placeholder="e.g. June 2026" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
                </div>
                <div className="tcm-form-field">
                  <label>Date</label>
                  <input placeholder="e.g. Jun 15, 2026" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="tcm-form-row">
                <div className="tcm-form-field">
                  <label>Title</label>
                  <input placeholder="e.g. Q2 Tax Payment" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="tcm-form-field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="payment">Payment</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
              </div>
              <div className="tcm-form-field">
                <label>Description</label>
                <textarea placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="tcm-form-actions">
                <button className="tcm-btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button className="tcm-btn-save" onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="tcm-footer">
          <button className="tcm-btn-add" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={15} /> Add Event
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaxCalendarModal;