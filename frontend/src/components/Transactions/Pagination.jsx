import React from "react";

const Pagination = () => {
  return (
    <>
      <style>
        {
          `
        .pagination {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  
  button {
    margin: 0 5px;
    padding: 6px 10px;
    border: none;
    background: #f1f1f1;
    border-radius: 6px;
    cursor: pointer;
    }
    
    .active {
      background: #007bff;
      color: white;
      }
      }
      @media (max-width: 600px) {
  .pagination {
    justify-content: center;
    button {
      padding: 4px 8px;
      font-size: 14px;
    }
    }
}`
        }
      </style>
      <div className="pagination">
        <button>Prev</button>

        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>...</button>
        <button>5</button>

        <button>Next</button>
      </div>
    </>
  );
};

export default Pagination;