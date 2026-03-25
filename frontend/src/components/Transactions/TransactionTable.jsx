import React from "react";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

const TransactionTable = ({
  data = [],
  currentPage,
  totalPages,
  onPageChange
}) => {

  return (
    <>
      <style>
        {`
        .table-container {
          padding: 10px 0px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          height: auto;
          border-radius: 8px;
          border: 0.2px solid #c0c0c0;
        }

        .table-body {
          display: flex;
          flex-direction: column;
        }
        `}
      </style>

      <div className="table-container">

        <TableHeader />

        <div className="table-body">
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow
                key={item._id}
                date={new Date(item.date).toLocaleDateString()}
                title={item.description || "Untitled"}
                subtitle={item.category}
                category={item.category}
                categoryColor={item.type === "Income" ? "blue" : "red"}
                type={item.type}
                amount={`${item.type === "Income" ? "+" : "-"} ₹ ${item.amount}`}
                note={item.description || ""}
              />
            ))
            
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>
              No transactions found
            </div>
          )}
        </div>

        {/* ✅ FIXED PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />

      </div>
    </>
  );
};

export default TransactionTable;