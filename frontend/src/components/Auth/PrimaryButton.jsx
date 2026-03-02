import "./PrimaryButton.css";

export default function PrimaryButton({ text, onClick ,type="button"}) {
  return (
    <button type={type} className="primary-btn" onClick={onClick}>
      {text}
    </button>
  );
}