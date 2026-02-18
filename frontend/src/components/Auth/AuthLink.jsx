import "./AuthLink.css";

export default function AuthLink({ text, linkText }) {
  return (
    <p className="auth-link">
      {text} <span>{linkText}</span>
    </p>
  );
}