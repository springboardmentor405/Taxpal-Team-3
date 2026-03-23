import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react'; // Using lucide-react for the icons

const DatePickerTrigger = ({ date = "Oct 1-2023", onClick }) => {
  return (
    <>
      <style>{
        `
    .date-picker-container {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  
  padding: 8px 14px;
  min-width: 100px; 
  height: 23px;
  
  background-color: #ffffff;
  border: 1px solid #9e9e9e; 
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:hover {
    border-color: #616161;
    background-color: #f9f9f9;
  }

  .date-picker-content {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon-calendar {
      color: #616161;
    }

    .date-text {
      font-family: 'Inter', -apple-system, sans-serif; 
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      letter-spacing: -0.5px;
    }
  }

  .icon-chevron {
    color: #000000;
    stroke-width: 3px; 
  }
}

@media (max-width: 768px) {
  .date-picker-container {
    padding: 6px 12px;
    min-width: 80px; 
    height: 20px;

    .date-picker-content {
      gap: 8px;

      .date-text {
        font-size: 12px;
      }
    }

    .icon-chevron {
      stroke-width: 2px; 
    }
  }
  
}
  `}
      </style>
      <div className="date-picker-container" onClick={onClick}>
        <div className="date-picker-content">
          <Calendar size={20} className="icon-calendar" />
          <span className="date-text">{date}</span>
        </div>
        <ChevronDown size={20} className="icon-chevron" />
      </div>
    </>
  );
};

export default DatePickerTrigger;