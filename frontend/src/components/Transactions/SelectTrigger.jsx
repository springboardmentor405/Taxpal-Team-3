import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectTrigger = ({ label, icon: Icon, onClick, variant = 'default' }) => {
  return (
    <>
      <style>
        {
          `
        .select-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    min-width: 100px;
    height: 25px;
    border-radius: 8px;
    border: 0.2px solid #9e9e9e;

    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

    &.default {
        background-color: #ebf0f3;
        border: 0.2px solid #cfcfcf;
        min-width: 120px;
    }

    &.grey {
        background-color: #ebf0f3; 
        border: 0.2px solid #cfcfcf;
    }

    .select-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .chevron-icon {
        stroke-width: 3px;
        color: #000000d5;
    }

    &:hover {
        filter: brightness(0.95);
    }
}

@media (max-width: 600px) {
    .select-trigger {
        padding: 6px 10px;
        height: 22px;

        &.default {
            min-width: 100px;
        }
    }
}`
        }
      </style>
      <div className={`select-trigger ${variant}`} onClick={onClick}>
        <div className="select-content">
          {Icon && <Icon size={20} className="left-icon" />}
          <span className="select-label">{label}</span>
        </div>
        <ChevronDown size={22} className="chevron-icon" />
      </div>
    </>
  );
};

export default SelectTrigger;