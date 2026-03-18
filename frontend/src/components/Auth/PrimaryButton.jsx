const PrimaryButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-[15px] bg-gradient-to-br from-[#0a2540] to-[#1a3a5c] border border-white/10 rounded-xl text-white text-[15px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-0 relative overflow-hidden"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;