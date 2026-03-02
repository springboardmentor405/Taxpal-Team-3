import "./AuthCard.css";

const AuthCard = ({ children }) => {
  return (
    <div className="auth-card">
      {children}
    </div>
  );
};

export default AuthCard;