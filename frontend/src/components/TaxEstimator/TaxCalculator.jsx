import React, { useState } from "react";
import "../../sass/TaxCalculator.scss";
import FormField from "../TaxEstimator/FormField";

const COUNTRY_STATES = {
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Puducherry"
  ],
  USA: [
    "Alabama", "Alaska", "Arizona", "California", "Colorado", "Florida",
    "Georgia", "Hawaii", "Illinois", "New York", "Texas", "Washington"
  ],
  UK: [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
};

const QUARTERS = [
  "Q1 (Apr–Jun 2025)", "Q2 (Jul–Sep 2025)", "Q3 (Oct–Dec 2025)", "Q4 (Jan–Mar 2026)"
];

const API_BASE = (() => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const base = String(raw).replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

const TaxCalculator = ({ onResult }) => {
  const [formData, setFormData] = useState({
    country: "India",
    state: "Maharashtra",
    filingStatus: "Single",
    quarter: "Q1 (Apr–Jun 2025)",
    expenses: "",
    retirement: "",
    income: "",
    insurance: "",
    homeOffice: "",
  });
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  const states = COUNTRY_STATES[formData.country] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset state when country changes
      ...(name === "country" ? { state: "" } : {}),
    }));
  };

  const handleCalculate = async () => {
    if (!formData.income) {
      setError("Please enter Gross Income for the quarter.");
      return;
    }
    setError("");
    setCalculating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tax/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          income: parseFloat(formData.income) || 0,
          expenses: parseFloat(formData.expenses) || 0,
          retirement: parseFloat(formData.retirement) || 0,
          insurance: parseFloat(formData.insurance) || 0,
          homeOffice: parseFloat(formData.homeOffice) || 0,
          filingStatus: formData.filingStatus,
          country: formData.country,
        }),
      });
      const data = await res.json();
      if (data.success && onResult) {
        onResult(data.data.estimatedTax);
      } else {
        setError("Calculation failed. Please try again.");
      }
    } catch (e) {
      setError("Could not connect to server.");
    } finally {
      setCalculating(false);
    }
  };

  const inputField = (label, name, placeholder) => (
    <div className="form-field">
      <label>{label}</label>
      <div className="select-box">
        <input
          type="number"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px" }}
          min="0"
        />
      </div>
    </div>
  );

  return (
    <div className="tax-container">
      <h2>Quarterly Tax Calculator</h2>

      <div className="grid">
        {/* Country */}
        <div className="form-field">
          <label>Country/Region</label>
          <div className="select-box">
            <select name="country" value={formData.country} onChange={handleChange}
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px", cursor: "pointer" }}>
              {Object.keys(COUNTRY_STATES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* State */}
        <div className="form-field">
          <label>State/Province</label>
          <div className="select-box">
            <select name="state" value={formData.state} onChange={handleChange}
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px", cursor: "pointer" }}>
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Filing Status */}
        <div className="form-field">
          <label>Filing Status</label>
          <div className="select-box">
            <select name="filingStatus" value={formData.filingStatus} onChange={handleChange}
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px", cursor: "pointer" }}>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
        </div>

        {/* Quarter */}
        <div className="form-field">
          <label>Quarter</label>
          <div className="select-box">
            <select name="quarter" value={formData.quarter} onChange={handleChange}
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px", cursor: "pointer" }}>
              {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>

        {/* Business Expenses */}
        {inputField("Business Expenses", "expenses", "₹ Enter Amount")}

        {/* Retirement */}
        {inputField("Retirement Contributions", "retirement", "₹ Select Amount")}

        {/* Gross Income — full width */}
        <div className="form-field full">
          <label>Gross Income for Quarter</label>
          <div className="select-box">
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="₹ Enter Income"
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "14px" }}
              min="0"
            />
          </div>
        </div>

        {/* Health Insurance */}
        {inputField("Health Insurance Premiums", "insurance", "₹ Select Amount")}

        {/* Home Office */}
        {inputField("Home Office Deduction", "homeOffice", "₹ Select Amount")}
      </div>

      {error && <p style={{ color: "#ef4444", marginTop: "0.75rem", fontSize: "0.85rem" }}>{error}</p>}

      <div className="btn-container">
        <button onClick={handleCalculate} disabled={calculating}>
          {calculating ? "Calculating…" : "Calculate Estimated Tax"}
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;