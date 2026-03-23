import React from "react";
import "./InputField.css";

export default function InputField({
  placeholder,
  type = "text",
  leftIcon,
  rightIcon,
  value,
  onChange,
  name,
  ...rest
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="input-wrapper">
      <div className="left-section">
        <span className="icon">{leftIcon}</span>
        <span className="divider"></span>
      </div>

      <input
        type={type}
        placeholder={placeholder}
        className="input-text"
        value={value}
        onChange={handleChange}
        name={name}
        {...rest}
      />

      {rightIcon && <span className="right-icon">{rightIcon}</span>}
    </div>
  );
}