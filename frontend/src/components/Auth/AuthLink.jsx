import { Link } from "react-router-dom";
import "./AuthLink.css";

export default function AuthLink({ text, linkText, to }) {
  return (
    <p className="auth-link">
      {text} <Link to={to}><span>{linkText}</span></Link>
    </p>
  );
}