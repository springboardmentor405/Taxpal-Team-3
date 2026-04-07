import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './MonthPicker.css';

/**
 * MonthPicker
 * Props:
 *   value       – { year: number, month: number } | null  (month is 0-indexed)
 *   onChange    – (value: { year, month } | null) => void
 *   placeholder – string  (default "All Months")
 */
const MonthPicker = ({ value, onChange, placeholder = 'All Months' }) => {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value ? value.year : now.getFullYear());
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleSelect = (monthIdx) => {
    onChange({ year: viewYear, month: monthIdx });
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const label = value
    ? `${MONTHS[value.month]} ${value.year}`
    : placeholder;

  return (
    <div className="month-picker" ref={ref}>
      <button
        type="button"
        className={`month-picker__trigger ${value ? 'month-picker__trigger--active' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <Calendar size={15} />
        <span>{label}</span>
        {value && (
          <span className="month-picker__clear" onClick={handleClear} title="Clear">×</span>
        )}
      </button>

      {open && (
        <div className="month-picker__dropdown">
          {/* Year navigation */}
          <div className="month-picker__year-row">
            <button type="button" onClick={() => setViewYear(y => y - 1)}><ChevronLeft size={16} /></button>
            <span className="month-picker__year-label">{viewYear}</span>
            <button type="button" onClick={() => setViewYear(y => y + 1)} disabled={viewYear >= now.getFullYear()}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Month grid */}
          <div className="month-picker__grid">
            {MONTHS.map((m, idx) => {
              const isFuture = viewYear === now.getFullYear() && idx > now.getMonth();
              const isSelected = value && value.year === viewYear && value.month === idx;
              return (
                <button
                  type="button"
                  key={m}
                  className={`month-picker__cell ${isSelected ? 'month-picker__cell--selected' : ''} ${isFuture ? 'month-picker__cell--disabled' : ''}`}
                  onClick={() => !isFuture && handleSelect(idx)}
                  disabled={isFuture}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
