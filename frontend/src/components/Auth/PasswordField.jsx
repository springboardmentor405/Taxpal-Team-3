import "./PasswordField.css";

export default function PasswordField({
  label,
  placeholder,
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
          type="password"
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