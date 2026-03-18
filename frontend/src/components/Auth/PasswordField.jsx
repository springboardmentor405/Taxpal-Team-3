import { useState } from "react";

const EyeOpen = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PasswordField = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center border border-white/30 rounded-2xl px-4 py-4 gap-3 transition-all duration-300 focus-within:border-white/60 focus-within:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <span className="text-white/60 flex-shrink-0">
        <LockIcon />
      </span>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent border-none outline-none text-white text-[14px] placeholder:text-white/45"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="text-white/50 hover:text-white transition-colors flex-shrink-0"
      >
        {show ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  );
};

export default PasswordField;