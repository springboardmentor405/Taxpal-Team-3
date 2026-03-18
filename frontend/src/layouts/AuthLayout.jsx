const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Main blue gradient background */}
      <div className="fixed inset-0"
        style={{
          background: "linear-gradient(135deg, #0a1f3d 0%, #0d3a6e 40%, #0a6090 70%, #0dd3ff 100%)"
        }}
      />

      {/* City buildings on sides - Left */}
      <svg className="fixed left-0 top-0 h-full opacity-40 pointer-events-none" style={{width:"180px"}} viewBox="0 0 180 800" preserveAspectRatio="xMinYMax meet">
        <rect x="0" y="300" width="40" height="500" fill="#0a3a6a"/>
        <rect x="5" y="200" width="30" height="600" fill="#0a4a7a"/>
        <rect x="10" y="250" width="8" height="4" fill="#7dd3fc" opacity="0.6"/>
        <rect x="10" y="270" width="8" height="4" fill="#7dd3fc" opacity="0.4"/>
        <rect x="10" y="290" width="8" height="4" fill="#7dd3fc" opacity="0.6"/>
        <rect x="45" y="350" width="50" height="450" fill="#083060"/>
        <rect x="100" y="280" width="35" height="520" fill="#0a3a6a"/>
        <rect x="140" y="400" width="40" height="400" fill="#062850"/>
        <rect x="50" y="260" width="8" height="4" fill="#7dd3fc" opacity="0.5"/>
        <rect x="50" y="280" width="8" height="4" fill="#7dd3fc" opacity="0.3"/>
        <rect x="105" y="300" width="8" height="4" fill="#7dd3fc" opacity="0.5"/>
        <rect x="105" y="320" width="8" height="4" fill="#7dd3fc" opacity="0.6"/>
        {/* Glow at bottom */}
        <rect x="0" y="700" width="180" height="100" fill="url(#glowL)" opacity="0.5"/>
        <defs>
          <linearGradient id="glowL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00aaff" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      {/* City buildings on sides - Right */}
      <svg className="fixed right-0 top-0 h-full opacity-40 pointer-events-none" style={{width:"180px"}} viewBox="0 0 180 800" preserveAspectRatio="xMaxYMax meet">
        <rect x="140" y="300" width="40" height="500" fill="#0a3a6a"/>
        <rect x="145" y="200" width="30" height="600" fill="#0a4a7a"/>
        <rect x="100" y="350" width="50" height="450" fill="#083060"/>
        <rect x="55" y="280" width="35" height="520" fill="#0a3a6a"/>
        <rect x="0" y="400" width="40" height="400" fill="#062850"/>
        <rect x="162" y="220" width="8" height="4" fill="#7dd3fc" opacity="0.6"/>
        <rect x="162" y="240" width="8" height="4" fill="#7dd3fc" opacity="0.4"/>
        <rect x="108" y="300" width="8" height="4" fill="#7dd3fc" opacity="0.5"/>
        <rect x="108" y="320" width="8" height="4" fill="#7dd3fc" opacity="0.6"/>
        <rect x="60" y="300" width="8" height="4" fill="#7dd3fc" opacity="0.4"/>
      </svg>

      {/* Top blue glow */}
      <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,180,255,0.3), transparent)" }}
      />

      {/* Bottom glow */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,100,180,0.4), transparent)" }}
      />

      {/* Bottom bar chart decoration */}
      <svg className="fixed bottom-4 right-8 opacity-30 pointer-events-none" width="80" height="50" viewBox="0 0 80 50">
        <rect x="0" y="30" width="12" height="20" rx="2" fill="#00cfff"/>
        <rect x="16" y="20" width="12" height="30" rx="2" fill="#00cfff"/>
        <rect x="32" y="25" width="12" height="25" rx="2" fill="#00cfff"/>
        <rect x="48" y="10" width="12" height="40" rx="2" fill="#00cfff"/>
        <rect x="64" y="15" width="12" height="35" rx="2" fill="#00cfff"/>
      </svg>

      {/* Hex pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'%3E%3Cpolygon points='40,0 80,20 80,60 40,80 0,60 0,20' fill='none' stroke='%2300cfff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 92px"
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;