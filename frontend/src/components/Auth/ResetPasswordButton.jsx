import "./ResetPasswordButton.css";

export default function ResetPasswordButton({ text, onClick }) {
  return (
    <button className="rp-primary-btn" onClick={onClick}>
      {text}
    </button>
  );
}