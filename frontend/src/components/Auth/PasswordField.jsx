import "./PasswordField.css";

export default function PasswordField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  iconice,
}) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        // src={icon}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // src={iconice}
        className="input-field"
      />
    </div>
  );
}