import { useState } from "react";
import "./ResetPasswordInput.css";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="rp-input-wrapper">
      <div className="rp-left-section">
        <span className="rp-icon"><Lock size={20} /></span>
        <span className="rp-divider"></span>
      </div>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rp-input-text"
      />
      <span className="rp-right-icon" onClick={() => setShow(!show)}>
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
  );
}