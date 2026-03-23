import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from 'lucide-react'; // Using lucide-react for the icons

const FormField = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select",
    full
}) => {

    const [open, setOpen] = useState(false);
    const ref = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange({
            target: { name, value: option }
        });
        setOpen(false);
    };

    return (
        <div ref={ref} className={`form-field ${full ? "full" : ""}`}>

            <label>{label}</label>

            <div
                className={`select-box ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >
                <span className={value ? "selected" : "placeholder"}>
                    {value || placeholder}
                </span>
                <span className="arrow">    
                    <ChevronDown size={20} className="icon-chevron" />

                </span>
            </div>

            {open && (
                <div className="dropdown">
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            className="dropdown-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(opt);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default FormField;