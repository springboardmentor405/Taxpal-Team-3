const AuthCard = ({ children }) => {
  return (
    <div className="flex w-full max-w-[860px] min-h-[500px] rounded-2xl overflow-hidden border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" }}
    >
      {children}
    </div>
  );
};

export default AuthCard;