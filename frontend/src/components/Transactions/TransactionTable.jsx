import React from "react";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

const TransactionTable = () => {

  const data = [
    {
      date: "May 8, 2025",
      title: "Design Project - Client A",
      subtitle: "Web Design",
      category: "Consulting",
      categoryColor: "blue",
      type: "Income",
      amount: "+$ 1,200.00",
      note: "Q2 Project Payment"
    },
    {
      date: "May 7, 2025",
      title: "Adobe Creative Suite",
      subtitle: "Subscription",
      category: "Software",
      categoryColor: "purple",
      type: "Expense",
      amount: "-$ 54.99",
      note: "Monthly Subscription"
    },
    {
      date: "May 6, 2025",
      title: "Office Rent - May",
      subtitle: "Rent Payment",
      category: "Office Rent",
      categoryColor: "sky",
      type: "Expense",
      amount: "-$ 800.00",
      note: "Monthly Office Rent"
    },
    {
      date: "May 5, 2025",
      title: "Freelance Logo Design",
      subtitle: "Logo Project",
      category: "Consulting",
      categoryColor: "Income",
      type: "Income",
      amount: "+$ 450.00",
      note: "Logo for Startup"
    },
    {
      date: "May 4, 2025",
      title: "Client Dinner Marketing",
      subtitle: "Business Meal",
      category: "Meal & Ent.",
      categoryColor: "Expense",
      type: "Expense",
      amount: "-$ 124.50",
      note: "Client Q2 review"
    },
    {
      date: "May 3, 2025",
      title: "Flight to Conference",
      subtitle: "Air Travel",
      category: "Travel",
      categoryColor: "sky",
      type: "Expense",
      amount: "-$ 340.00",
      note: "Tech Cost Mumbai"
    },
    {
      date: "May 2, 2025",
      title: "SEO Audit - Client B",
      subtitle: "Digital Marketing",
      category: "Consulting",
      categoryColor: "Income",
      type: "Income",
      amount: "+$ 800.00",
      note: "Monthly retainer"
    },
    {
      date: "May 1, 2025",
      title: "Internet & Phone bill",
      subtitle: "Monthly Utility",
      category: "Utilities",
      categoryColor: "grey",
      type: "Expense",
      amount: "-$ 89.00",
      note: "Airtel Broadcast"
    },
    {
      date: "Apr 30, 2025",
      title: "UI/UX Consulation",
      subtitle: "Design Review",
      category: "Consulting",
      categoryColor: "Income",
      type: "Income",
      amount: "+$ 600.00",
      note: "Hourly Consultating"
    },
    {
      date: "Apr 29, 2025",
      title: "Google Workspace",
      subtitle: "Cloud Tools",
      category: "Software",
      categoryColor: "purple",
      type: "Expense",
      amount: "-$ 12.00",
      note: "Annual plan - Monthly"
    },
  ];

  return (
    <>
      <style>
        {
          `
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

@media (max-width: 768px) {
    .table-container {
        padding: 5px 0px;
        }
}`
        }
      </style>
      <div className="table-container">
        <TableHeader />

        <div className="table-body">
          {data.map((item, index) => (
            <TableRow key={index} {...item} />
          ))}
        </div>

        <Pagination />
      </div>
    </>
  );
};

export default TransactionTable;