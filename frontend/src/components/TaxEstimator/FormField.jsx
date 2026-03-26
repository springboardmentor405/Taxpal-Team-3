import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
    const [search, setSearch] = useState("");
    const ref = useRef();

    // 🔥 Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    // 🔥 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch(""); // reset search
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange({
            target: { name, value: option }
        });
        setOpen(false);
        setSearch("");
    };

    return (
        <div ref={ref} className={`form-field ${full ? "full" : ""}`}>

            <label>{label}</label>

            {/* ✅ DROPDOWN FIELD */}
            {options.length > 0 ? (
                <>
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

                            {/* 🔥 SEARCH INPUT */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-box"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* 🔥 FILTERED OPTIONS */}
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, i) => (
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
                                ))
                            ) : (
                                <div className="dropdown-item">No results</div>
                            )}

                        </div>
                    )}
                </>
            ) : (

                /* ✅ INPUT FIELD (FOR AMOUNTS) */
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input-box"
                />
            )}

        </div>
    );
};

export default FormField;