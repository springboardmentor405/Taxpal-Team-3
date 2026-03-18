const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-9">
      <h2 className="text-[26px] font-bold text-white tracking-tight mb-1">{title}</h2>
      <p className="text-sm text-white/55 font-light">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;