import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * DatePickerTrigger Component
 * Props:
 * - date: string (displayed date)
 * - onSelectDate: function (called when a new date/month is selected)
 */
const DatePickerTrigger = ({ date = "Oct -1 2026" , onSelectDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const months = [
    "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026",
    "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (month) => {
    setSelectedDate(month);
    setIsOpen(false);
    if (onSelectDate) onSelectDate(month);
  };

  return (
    <>
      <style>{`
        .date-picker-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 14px;
          min-width: 120px;
          height: 28px;
          background-color: #ffffff;
          border: 1px solid #9e9e9e;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease-in-out;
        }

        .date-picker-container:hover {
          border-color: #616161;
          background-color: #f9f9f9;
        }

        .date-picker-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #000;
        }

        .icon-calendar, .icon-chevron {
          color: #616161;
        }

        .date-picker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #fff;
          border: 1px solid #cfcfcf;
          border-radius: 8px;
          margin-top: 4px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }

        .date-picker-option {
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .date-picker-option:hover {
          background-color: #f0f0f0;
        }

        @media (max-width: 768px) {
          .date-picker-container {
            padding: 6px 12px;
            min-width: 100px;
            height: 24px;
          }

          .date-text {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="date-picker-container" onClick={handleToggle}>
        <div className="date-picker-content">
          <Calendar size={18} className="icon-calendar" />
          <span className="date-text">{selectedDate}</span>
        </div>
        <ChevronDown size={18} className="icon-chevron" />

        {isOpen && (
          <div className="date-picker-dropdown">
            {months.map((month) => (
              <div
                key={month}
                className="date-picker-option"
                onClick={() => handleSelect(month)}
              >
                {month}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DatePickerTrigger;