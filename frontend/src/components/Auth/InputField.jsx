import "./InputField.css";
import React from "react";
import { User, Mail, Lock, Eye } from "lucide-react";

export default function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
  leftIcon,
  rightIcon


}) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {leftIcon && <span className="left-icon">{leftIcon}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-field"
        />
        {rightIcon && <span className="right-icon">{rightIcon}</span>}
      </div>
    </div>
  );
}
