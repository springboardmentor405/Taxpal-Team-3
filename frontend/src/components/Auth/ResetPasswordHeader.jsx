import "./ResetPasswordHeader.css";

export default function ResetPasswordHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="rp-title">{title}</h2>
      <p className="rp-subtitle">{subtitle}</p>
    </>
  );
}