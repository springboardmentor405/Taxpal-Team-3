import "./AuthHeader.css";

export default function AuthHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="auth-title">{title}</h2>
      <p className="auth-subtitle">{subtitle}</p>
    </>
  );
}