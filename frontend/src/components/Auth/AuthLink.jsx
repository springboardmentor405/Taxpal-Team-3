import { useNavigate } from "react-router-dom";
import "./AuthLink.css";

const AuthLink = ({ text, linkText, to }) => {
  const navigate = useNavigate();
  return (
    <p className="auth-link">
      {text} <span onClick={() => navigate(to)}>{linkText}</span>
    </p>
  );
};

export default AuthLink;