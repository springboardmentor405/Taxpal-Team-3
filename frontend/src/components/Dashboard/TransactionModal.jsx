import React, { useState } from 'react';
import '../../sass/TransactionCards.scss';

const TransactionModal = ({ type, onClose, onSave }) => {
    const isIncome = type === 'income';

    const title = isIncome ? 'Record New Income' : 'Record New Expense';
    const subtitle = isIncome
        ? 'Add details about your income to track your finance better'
        : 'Add details about your income to track your spending better';
    const sectionTitle = isIncome ? 'Add Income' : 'Add Expense';

    // Build YYYY-MM-DD for native date input compatibility
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const defaultDate = yyyy + '-' + mm + '-' + dd;   // e.g. "2026-03-12"

    const [form, setForm] = useState({
        description: '',
        amount: '',
        category: '',
        date: defaultDate,
        notes: '',
    });

    const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Rental', 'Other'];
    const expenseCategories = ['Food', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Tax', 'Other'];
    const categories = isIncome ? incomeCategories : expenseCategories;

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = () => {
        if (onSave) onSave(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{title}</h2>
                        <p className="modal-subtitle">{subtitle}</p>
                    </div>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                    <p className="modal-section-title">{sectionTitle}</p>

                    <div className="modal-form">

                        {/* Row 1 — Description | Amount */}
                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="tm-desc">Description</label>
                                <div className="tm-input-wrapper">
                                    <input
                                        id="tm-desc"
                                        type="text"
                                        name="description"
                                        placeholder="eg. Web Design Project"
                                        value={form.description}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    <button
                                        className="input-clear"
                                        type="button"
                                        tabIndex={-1}
                                        aria-label="Clear"
                                        onClick={() => setForm((p) => ({ ...p, description: '' }))}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tm-amount">Amount</label>
                                <div className="tm-amount-wrapper">
                                    <span className="amount-prefix">$</span>
                                    <input
                                        id="tm-amount"
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        value={form.amount}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Row 2 — Category | Date */}
                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="tm-cat">Category</label>
                                <div className="tm-select-wrapper">
                                    <select
                                        id="tm-cat"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <span className="select-arrow">&#8964;</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tm-date">Date</label>
                                <div className="tm-date-wrapper">
                                    <input
                                        id="tm-date"
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    <span className="date-icon">&#128197;</span>
                                </div>
                            </div>

                        </div>

                        {/* Notes */}
                        <div className="form-group">
                            <label htmlFor="tm-notes">Notes (Optional)</label>
                            <textarea
                                id="tm-notes"
                                name="notes"
                                placeholder="Add any additional details..."
                                value={form.notes}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                    <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
                    <button className="btn-save" type="button" onClick={handleSave}>Save</button>
                </div>

            </div>
        </div>
    );
};

export default TransactionModal;
