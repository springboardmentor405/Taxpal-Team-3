import "./OtpInput.css";

export default function OtpInput() {
  return (
    <div className="otp-container">
      {[...Array(6)].map((_, i) => (
        <input key={i} maxLength="1" className="otp-box" />
      ))}
    </div>
  );
}