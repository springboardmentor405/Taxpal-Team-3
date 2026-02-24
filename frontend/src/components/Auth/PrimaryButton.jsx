import "./PrimaryButton.css";

// Add 'onClick' to the destructured props here 
export default function PrimaryButton({ text, onClick }) {
  return (
    <button 
      className="primary-btn" 
      onClick={onClick} // 👈 This line is the "bridge" that was missing
    >
      {text}
    </button>
  );
}