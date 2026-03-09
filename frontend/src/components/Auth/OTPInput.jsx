import React, { useRef } from "react";
import "./OtpInput.css";

export default function OtpInput({ length = 6, value, onChange }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return; 

    const otpArray = value.split("");
    otpArray[index] = val.slice(-1); 
    const newOtp = otpArray.join("");
    
    onChange(newOtp);

    if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength="1"
          className="otp-box"
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}