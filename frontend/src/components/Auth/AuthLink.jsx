import { Link } from "react-router-dom";

const AuthLink = ({ label, linkText, to }) => {
  return (
    <p className="text-sm text-white/55 text-center">
      {label}{" "}
      <Link to={to} className="text-[#00c9ff] font-semibold hover:text-white transition-colors">
        {linkText}
      </Link>
    </p>
  );
};

export default AuthLink;