import "./PrimaryButton.css";


export default function PrimaryButton({ text, onClick, disabled }) {
  return (
    <button 
      className="primary-btn" 
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}