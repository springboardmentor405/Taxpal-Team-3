import React from "react";

const ExportButton = ({ data = [] }) => {

    const exportCSV = () => {
        if (!data || data.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Date", "Category", "Type", "Amount", "Description"];

        const rows = data.map(d => [
            new Date(d.date).toLocaleDateString(),
            d.category,
            d.type,
            d.amount,
            d.description || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.csv";
        a.click();
    };

    return (
        <div
            onClick={exportCSV}  
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
            {/* ICON */}
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
                    fontFamily: "'Inter', -apple-system, sans-serif",
                }}
            >
                Export
            </span>
        </div>
    );
};

export default ExportButton;