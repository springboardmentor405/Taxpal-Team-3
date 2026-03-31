import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectTrigger = ({ label, options = [], onSelect, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    if (onSelect) onSelect(option);
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .select-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          min-width: 130px;
          background-color: #ffffff;
          border: 0.5px solid #cfcfcf;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .select-trigger.grey {
          background-color: #ebf0f3;
        }

        .select-trigger:hover {
          filter: brightness(0.95);
        }

        .select-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .select-options {
          position: absolute;
          top: 105%;
          left: 0;
          width: 100%;
          background: #fff;
          border: 1px solid #cfcfcf;
          border-radius: 8px;
          margin-top: 4px;
          z-index: 100;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        }

        .select-option {
          padding: 8px 12px;
          cursor: pointer;
        }

        .select-option:hover {
          background: #f0f0f0;
        }
      `}</style>

      <div ref={ref} style={{ position: "relative" }}>
        <div
          className={`select-trigger ${variant}`}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <div className="select-content">
            <span>{label}</span>
          </div>
          <ChevronDown size={18} />
        </div>

        {isOpen && options.length > 0 && (
          <div className="select-options">
            {options.map((opt) => (
              <div
                key={opt}
                className="select-option"
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectTrigger;