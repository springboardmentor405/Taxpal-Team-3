import React from "react";

const TableHeader = () => {
  return (
    <>
    <style>{`
        .table-header {
          display: grid;
          grid-template-columns: 2.5% 10% 22% 13% 12% 12% 22% 10%;
          padding: 10px;
          font-weight: 500;
          border-bottom: 0.2px solid #c0c0c0;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .table-header {
            grid-template-columns: 25px 120px 2fr 1fr 1fr 1fr 2fr 100px;
            font-size: 12px;
          }
        }
      `}</style>

    <div className="table-header">
      <input type="checkbox"/>
      <span>Date</span>
      <span>Description</span>
      <span>Category</span>
      <span>Type</span>
      <span>Amount</span>
      <span>Notes</span>
      <span>Actions</span>
    </div>
    </>
  );
};

export default TableHeader;