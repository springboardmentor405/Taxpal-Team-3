import { useState } from "react";
import "./PasswordField.css";

const PasswordField = ({ placeholder, onChange, value, leftIcon, rightIcon }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="input-wrapper" style={{ marginBottom: "30px" }}>
      <div className="left-section">
        <span className="icon">{leftIcon}</span>
        <span className="divider"></span>
      </div>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="input-text"
      />
      <span className="right-icon" onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
        {rightIcon}
      </span>
    </div>
  );
};

export default PasswordField;