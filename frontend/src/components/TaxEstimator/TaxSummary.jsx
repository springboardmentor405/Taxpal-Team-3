import React from "react";
import "../../sass/TaxSummary.scss";
import { FileText } from "lucide-react";

  const TaxSummary = ({ amount = 0 }) => {
  return (
    <div className="tax-summary-container">

      <h3 className="title">Tax Summary</h3>

      <div className="summary-card">

        <div className="icon">
          <FileText size={40} />
        </div>

        <h2 className="heading">Estimated Quarterly Tax</h2>

        <div className="amount">
          $ {amount.toLocaleString()}
        </div>

        <p className="description">
          Based on your inputs, this is the estimated quarterly tax you should set aside
        </p>

      </div>

    </div>
  );
};

export default TaxSummary;