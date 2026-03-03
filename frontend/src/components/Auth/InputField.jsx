import React from "react";
import "./InputField.css";

export default function InputField({
  placeholder,
  type = "text",
  leftIcon,
  rightIcon,
  value,
  onChange
}) {
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
        onChange={onChange}
      />

      {rightIcon && <span className="right-icon">{rightIcon}</span>}
    </div>
  );
}