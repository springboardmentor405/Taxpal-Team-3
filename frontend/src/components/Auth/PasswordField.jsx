import React, { useState } from "react";
import "./PasswordField.css";

export default function PasswordField({
  placeholder,
  onChange,
  leftIcon,
  rightIcon,
  value,
  name,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

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
        onChange={handleChange}
        name={name}
        {...rest}
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