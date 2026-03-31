import React from "react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {

  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <>
      <style>
        {`
        .pagination {
          display: flex;
          justify-content: flex-end;
          padding: 10px;
          flex-wrap: wrap;
        }

        .pagination button {
          margin: 0 5px;
          padding: 6px 10px;
          border: none;
          background: #f1f1f1;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination button:hover {
          background: #e0e0e0;
        }

        .pagination .active {
          background: #007bff;
          color: white;
        }

        .pagination .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .pagination {
            justify-content: center;
          }

          .pagination button {
            padding: 4px 8px;
            font-size: 14px;
          }
        }
        `}
      </style>

      <div className="pagination">

        {/* PREV */}
        <button
          className={currentPage === 1 ? "disabled" : ""}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((num) => (
          <button
            key={num}
            className={currentPage === num ? "active" : ""}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        {/* NEXT */}
        <button
          className={currentPage === totalPages ? "disabled" : ""}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>

      </div>
    </>
  );
};

export default Pagination;