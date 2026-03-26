import React, { useState } from "react";
import { Country, State } from "country-state-city";
import "../../sass/TaxCalculator.scss";
import FormField from "../TaxEstimator/FormField";

const TaxCalculator = ({ setTaxResult }) => {
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    filingStatus: "",
    quarter: "",
    expenses: "",
    retirement: "",
    income: "",
    insurance: "",
    homeOffice: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cleanAmount = (val) => Number(val.replace(/[^0-9]/g, ""));
  const handleCalculate = async () => {

    const cleanedData = {
      ...formData,
      income: cleanAmount(formData.income),
      expenses: cleanAmount(formData.expenses),
      retirement: cleanAmount(formData.retirement),
      insurance: cleanAmount(formData.insurance),
      homeOffice: cleanAmount(formData.homeOffice),
    };

    try {
      const res = await fetch("http://localhost:5000/api/tax/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await res.json();

      // 🔥 SEND TO SUMMARY
      setTaxResult(data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="tax-container">
      <h2>Quarterly Tax Calculator</h2>

      <div className="grid">

        <FormField
          label="Country/Region"
          name="country"
          value={formData.country}
          onChange={handleChange}
          options={Country.getAllCountries().map(c => c.name)}
          placeholder="Select Country"
        />

        <FormField
          label="State/Province"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={
            State.getStatesOfCountry(
              Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || ""
            ).map(s => s.name)
          }
          placeholder="Select State"
        />

        <FormField
          label="Filing Status"
          name="filingStatus"
          value={formData.filingStatus}
          onChange={handleChange}
          options={["Single", "Married","Widow"]}
          placeholder="Select Status"
        />

        <FormField
          label="Quarter"
          name="quarter"
          value={formData.quarter}
          onChange={handleChange}
          options={["Q1", "Q2", "Q3", "Q4"]}
          placeholder="Select Quarter"
        />

        <FormField
          label="Business Expenses"
          name="expenses"
          value={formData.expenses}
          onChange={handleChange}
          options={["$1000", "$2000", "$4500"]}
          placeholder="Enter Amount"
        />

        <FormField
          label="Retirement Contributions"
          name="retirement"
          value={formData.retirement}
          onChange={handleChange}
          options={["$500", "$1200", "$2000"]}
          placeholder="$ Select Amount"
        />

        <FormField
          label="Gross Income for Quarter"
          name="income"
          value={formData.income}
          onChange={handleChange}
          options={["$10000", "$21000", "$50000"]}
          placeholder="$ Enter Income"
          full
        />

        <FormField
          label="Health Insurance Premiums"
          name="insurance"
          value={formData.insurance}
          onChange={handleChange}
          options={["$500", "$800", "$1200"]}
          placeholder="$ Select Amount"
        />

        <FormField
          label="Home Office Deduction"
          name="homeOffice"
          value={formData.homeOffice}
          onChange={handleChange}
          options={["$500", "$1500", "$2500"]}
          placeholder="$ Select Amount"
        />

      </div>

      <div className="btn-container">
        <button onClick={handleCalculate}>
          Calculate Estimated Tax
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;