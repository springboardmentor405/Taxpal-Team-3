import { useNavigate } from 'react-router-dom';
import "./AuthLink.css";

export default function AuthLink({ text, linkText, href }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) navigate(href);
  };

  return (
    <p className="auth-link" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {text} <span className="auth-link-text">{linkText}</span>
    </p>
  );
}