import React from "react";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const categoryColorMap = {
  Consulting: 'blue',
  Software: 'purple',
  Travel: 'sky',
  Utilities: 'grey',
  'Office Rent': 'sky',
  'Meal & Ent.': 'Expense',
  Salary: 'blue',
  Freelance: 'Income',
  Investment: 'purple',
  Business: 'sky',
  Rental: 'grey',
  Food: 'sky',
  Transport: 'grey',
  Health: 'blue',
  Entertainment: 'purple',
  Tax: 'Expense',
  Other: 'grey',
};

const TransactionTable = ({ data = [] }) => {
  const rows = data.map((item) => ({
    date: formatDate(item.date),
    title: item.title,
    subtitle: item.category,
    category: item.category,
    categoryColor:
      categoryColorMap[item.category] ||
      (item.type === 'Income' ? 'Income' : 'Expense'),
    type: item.type,
    amount:
      item.type === 'Income'
        ? `+$ ${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `-$ ${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    note: item.note || '',
  }));

  return (
    <>
      <style>{`
        .table-container {
          padding: 10px 0px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: auto;
          border-radius: 8px;
          border: 0.2px solid #c0c0c0;
        }
        .table-body {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .table-container { padding: 5px 0px; }
        }
      `}</style>
      <div className="table-container">
        <TableHeader />
        <div className="table-body">
          {rows.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              No transactions found. Record your first income or expense!
            </p>
          ) : (
            rows.map((item, index) => <TableRow key={index} {...item} />)
          )}
        </div>
        <Pagination />
      </div>
    </>
  );
};

export default TransactionTable;