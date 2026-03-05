import "./InputField.css";

const InputField = ({ placeholder, leftIcon, value, onChange, type = "text" }) => {
  return (
    <div className="input-wrapper" style={{ marginBottom: "30px" }}>
      <div className="left-section">
        <span className="icon">{leftIcon}</span>
        <span className="divider"></span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="input-text"
      />
    </div>
  );
};

export default InputField;