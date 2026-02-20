import React from "react";
import "./InputField.css";
import { User, Mail, Lock, Eye } from "lucide-react";

export default function InputField({
  placeholder,
  type = "text",
  leftIcon,
  rightIcon
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
      />

      {rightIcon && <span className="right-icon">{rightIcon}</span>}
    </div>
  );
}