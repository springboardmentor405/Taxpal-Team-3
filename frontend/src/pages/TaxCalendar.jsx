import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import '../sass/TaxCalendar.scss';

const initialEvents = [
  { _id: '1', month: 'June 2025', date: 'June 1, 2025', title: 'Remainder : Q2 Estimated Tax Payment', description: 'Remainder for upcoming Q2 estimated tax payment due on Jun 15, 2025.', type: 'reminder', paid: false },
  { _id: '2', month: 'June 2025', date: 'June 15, 2025', title: 'Q2 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
  { _id: '3', month: 'September 2025', date: 'Sep 1, 2025', title: 'Remainder : Q3 Estimated Tax Payment', description: 'Remainder for upcoming Q3 estimated tax payment due on Sep 15, 2025.', type: 'reminder', paid: false },
  { _id: '4', month: 'September 2025', date: 'Sep 15, 2025', title: 'Q3 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
  { _id: '5', month: 'December 2025', date: 'Dec 1, 2025', title: 'Remainder : Q4 Estimated Tax Payment', description: 'Remainder for upcoming Q4 estimated tax payment due on Dec 15, 2025.', type: 'reminder', paid: false },
  { _id: '6', month: 'December 2025', date: 'Dec 15, 2025', title: 'Q4 Estimated Tax Payment', description: 'Quarterly estimated tax payment due.', type: 'payment', paid: false },
];

const taxCalendarAPI = {
  getAll: () => new Promise(res => setTimeout(() => res([...initialEvents]), 400)),
  create: (data) => new Promise(res => setTimeout(() => res({ ...data, _id: Date.now().toString(), paid: false }), 300)),
  delete: (id) => new Promise(res => setTimeout(() => res({ success: true }), 300)),
  markPaid: (id) => new Promise(res => setTimeout(() => res({ success: true }), 300)),
};

const emptyForm = { month: '', date: '', title: '', description: '', type: 'payment' };

const TaxCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    taxCalendarAPI.getAll().then(data => { setEvents(data); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.month) return;
    setSubmitting(true);
    const newEvent = await taxCalendarAPI.create(form);
    setEvents(prev => [...prev, newEvent]);
    setForm(emptyForm);
    setShowModal(false);
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

  return (
    <div className="tc-page">

      {/* HEADER */}
      <div className="tc-header">
        <div className="tc-header-left">
          <h1 className="tc-title">Tax Calendar</h1>
          <p className="tc-subtitle">Keep track of your upcoming estimated tax payment deadlines</p>
        </div>
        <button className="tc-add-btn" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Event
        </button>
      </div>

      {/* EVENT LIST */}
      <div className="tc-list-wrap">
        {loading ? (
          <div className="tc-loading"><div className="tc-spinner" /><span>Loading...</span></div>
        ) : (
          Object.entries(grouped).map(([month, evs]) => (
            <div key={month} className="tc-month-section">
              <div className="tc-month-heading">{month}</div>
              {evs.map(ev => (
                <div key={ev._id} className={`tc-event-card${ev.paid ? ' paid' : ''}`}>
                  <div className="tc-event-icon">
                    <CalendarDays size={18} color="#2563eb" />
                  </div>
                  <div className="tc-event-body">
                    <div className="tc-event-title">{ev.title}</div>
                    <div className="tc-event-date">{ev.date}</div>
                    <div className="tc-event-desc">{ev.description}</div>
                  </div>
                  <div className="tc-event-right">
                    <span className={`tc-badge tc-badge-${ev.paid ? 'paid' : ev.type}`}>
                      {ev.paid ? 'paid ✓' : ev.type}
                    </span>
                    <div className="tc-event-actions">
                      {ev.type === 'payment' && !ev.paid && (
                        <button className="tc-act-btn" title="Mark as Paid" onClick={() => handleMarkPaid(ev._id)}>
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      <button className="tc-act-btn danger" title="Delete" onClick={() => handleDelete(ev._id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showModal && (
        <div className="tc-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="tc-modal">
            <div className="tc-modal-header">
              <div>
                <h3 className="tc-modal-title">Add Tax Event</h3>
                <p className="tc-modal-subtitle">Add a new tax deadline or reminder</p>
              </div>
              <button className="tc-modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-modal-grid">
                <div className="tc-field">
                  <label>Month</label>
                  <input placeholder="e.g. June 2026" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
                </div>
                <div className="tc-field">
                  <label>Date</label>
                  <input placeholder="e.g. Jun 15, 2026" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="tc-modal-grid">
                <div className="tc-field">
                  <label>Title</label>
                  <input placeholder="e.g. Q2 Tax Payment" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="tc-field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="payment">Payment</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
              </div>
              <div className="tc-field">
                <label>Description</label>
                <textarea placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="tc-modal-footer">
              <button className="tc-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tc-modal-save" onClick={handleCreate} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalendar;