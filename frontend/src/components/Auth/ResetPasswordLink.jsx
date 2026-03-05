import "./ResetPasswordLink.css";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordLink({ text, linkText, to }) {
  const navigate = useNavigate();
  return (
    <p className="rp-auth-link">
      {text} <span onClick={() => navigate(to)}>{linkText}</span>
    </p>
  );
}