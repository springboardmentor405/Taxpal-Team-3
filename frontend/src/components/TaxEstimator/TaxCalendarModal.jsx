import React, { useEffect, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import '../../sass/TaxCalendarModal.scss';

const API_BASE = (() => {
    const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const base = String(raw).replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
})();

const TaxCalendarModal = ({ onClose }) => {
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeadlines = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE}/tax/deadlines`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setDeadlines(data.data);
                } else {
                    setError('Failed to load deadlines.');
                }
            } catch (e) {
                setError('Could not connect to server.');
            } finally {
                setLoading(false);
            }
        };
        fetchDeadlines();
    }, []);

    // Group deadlines by month
    const grouped = deadlines.reduce((acc, d) => {
        const key = d.month;
        if (!acc[key]) acc[key] = [];
        acc[key].push(d);
        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="tax-calendar-overlay" onClick={onClose}>
            <div className="tax-calendar-modal" onClick={e => e.stopPropagation()}>
                <div className="tcm-header">
                    <div>
                        <h2>Tax Calendar</h2>
                        <p>Keep track of your upcoming estimated tax payment deadlines</p>
                    </div>
                    <button className="tcm-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="tcm-body">
                    {loading && <p className="tcm-loading">Loading deadlines…</p>}
                    {error && <p className="tcm-error">{error}</p>}
                    {!loading && !error && Object.entries(grouped).map(([month, items]) => (
                        <div key={month} className="tcm-month-group">
                            <h3 className="tcm-month-title">{month}</h3>
                            {items.map(item => (
                                <div key={item.id} className="tcm-deadline-row">
                                    <div className="tcm-icon">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="tcm-info">
                                        <p className="tcm-title">{item.title}</p>
                                        <p className="tcm-date">{formatDate(item.date)}</p>
                                        <p className="tcm-desc">{item.description}</p>
                                    </div>
                                    <span className={`tcm-badge tcm-badge--${item.type}`}>
                                        {item.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaxCalendarModal;
