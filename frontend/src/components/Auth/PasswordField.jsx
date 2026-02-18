import "./PasswordField.css";

export default function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
}