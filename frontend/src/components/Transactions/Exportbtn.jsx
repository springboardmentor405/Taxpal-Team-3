import React from "react";

const ExportButton = () => {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                minWidth: "100px",
                height: "23px",
                borderRadius: "8px",
                border: "0.5px solid #9e9e9ead",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                userSelect: "none",
                gap: "12px",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(0.95)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "brightness(1)")
            }
        >
            {/* LEFT ICON */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1f1f1f"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 3v14"></path>
                    <path d="M5 10l7 7 7-7"></path>
                </svg>
            </div>

            {/* TEXT */}
            <span
                style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#000000",
                    fontFamily:"'Inter', -apple-system, sans-serif",
                    flex: 2,
                }}
            >
                Export
            </span>
        </div>

    );
};

export default ExportButton