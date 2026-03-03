import React, { useState } from "react";
import "./PasswordField.css";

export default function PasswordField({
  placeholder,
  onChange,
  leftIcon,
  rightIcon,
  value
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <div className="left-section">
        <span className="icon">{leftIcon}</span>
        <span className="divider"></span>
      </div>

      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="password-input"
        value={value}
        onChange={onChange}
      />

      <span
        className="right-icon"
        onClick={() => setShowPassword(!showPassword)}
      >
        {rightIcon}
      </span>
    </div>
  );
}