import React from "react";

const TableRow = ({
  date,
  title,
  subtitle,
  category,
  categoryColor,
  type,
  amount,
  note
}) => {

  return (
    <>
      <style>{`
    .table-row {
  display: grid;
  grid-template-columns: 2.5% 10% 22% 13% 12% 12% 22% 10%;

  align-items: center;
  padding: 10px;
  border-bottom: 0.2px solid #b8b8b84a;


  &:hover {
    background: #fafafa;
  }

  .date {
    font-size: 14px;
    color: #2a2a2a;
    font-weight: 400;
  }

  .desc {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 14px;
    }

    small {
      color: #888;
      font-size: 12px;
    }
  }

  /* BADGES */
  .badge {
    padding: 3px;
    padding-top: 5px;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    align-items: center;
    height: 20px;
    width: 80px;
    font-weight: 500;
  }

  /* CATEGORY COLORS */
  .blue {
    background: #e0f2ff;
    color: #0077b6;
  }

  .purple {
    background: #ede9fe;
    color: #6b21a8;
  }

  .sky {
    background: #e0f7fa;
    color: #0284c7;
  }
  .grey{
    background: #f5f5f5;
    color: #616161;
  }



  /* TYPE COLORS */
  .Income {
    background: #e6f9f0;
    color: #0f9d58;
  }

  .Expense {
    background: #fde8e8;
    color: #d32f2f;
  }

  /* AMOUNT */
  .amount.Income {
    color: #066f3c;
    font-weight: bold;
    background-color: transparent;
  }

  .amount.Expense {
    color: #d32f2f;
    font-weight: bold;
    background-color: transparent;

  }
  .amount {
    font-size: 14px;
  }

  .note {
    color: #777;
    font-size: 13px;
  }

  .actions button {
    margin-right: 5px;
    border: none;
    background: #f1f1f1;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .table-row {
    grid-template-columns: 25px 120px 2fr 1fr 1fr 1fr 2fr 100px;

    padding: 8px;

    .date {
      font-size: 12px;
    }

    .desc {
      strong {
        font-size: 13px;
      }
    }

    .badge {
      width: 70px;
      font-size: 11px;
    }

    .amount {
      font-size: 14px;
    }
  }
}
    `
      }
      </style>
      <div className="table-row">

        <input type="checkbox" />

        <span className="date">{date}</span>

        <div className="desc">
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
        <span className={`badge ${categoryColor}`}>
          {category}
        </span>

        <span className={`badge ${type}`}>
          {type}
        </span>

        <span className={`amount ${type}`}>
          {amount}
        </span>

        <span className="note">{note}</span>

        <div className="actions">
          <button>-</button>
          <button>🗑</button>
        </div>

      </div>
    </>
  );
};

export default TableRow;