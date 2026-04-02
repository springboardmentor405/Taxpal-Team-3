export const estimateTax = async (req, res) => {
  try {
    const { income, expenses, retirement, insurance, homeOffice, filingStatus } = req.body;

    const grossIncome = parseFloat(income) || 0;
    const totalExpenses = parseFloat(expenses) || 0;
    const totalRetirement = parseFloat(retirement) || 0;
    const totalInsurance = parseFloat(insurance) || 0;
    const totalHomeOffice = parseFloat(homeOffice) || 0;

    // Standard Deduction (simplified)
    const standardDeduction = filingStatus === "Married" ? 27700 : 13850;

    const taxableIncome = Math.max(0, grossIncome - totalExpenses - totalRetirement - totalInsurance - totalHomeOffice - standardDeduction);

    // Simplified Tax Bracket (15% for demonstration)
    const estimatedTax = taxableIncome * 0.15;

    res.status(200).json({
      success: true,
      data: {
        grossIncome,
        taxableIncome,
        estimatedTax,
        standardDeduction,
        deductions: {
          expenses: totalExpenses,
          retirement: totalRetirement,
          insurance: totalInsurance,
          homeOffice: totalHomeOffice
        }
      }
    });
  } catch (error) {
    console.error("Tax estimation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTaxDeadlines = async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();

  const deadlines = [
    // Q1 Advance Tax — June
    {
      id: 1,
      type: 'reminder',
      title: 'Reminder : Q2 Estimated Tax Payment',
      date: `${year}-06-01`,
      description: `Reminder for upcoming Q2 estimated tax payment due on Jun 15, ${year}.`,
      month: 'June ' + year,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Q2 Estimated Tax Payment',
      date: `${year}-06-15`,
      description: 'Quarterly estimated tax payment due.',
      month: 'June ' + year,
    },
    // Q2 Advance Tax — September
    {
      id: 3,
      type: 'reminder',
      title: 'Reminder : Q3 Estimated Tax Payment',
      date: `${year}-09-01`,
      description: `Reminder for upcoming Q3 estimated tax payment due on Sep 15, ${year}.`,
      month: 'September ' + year,
    },
    {
      id: 4,
      type: 'payment',
      title: 'Q3 Estimated Tax Payment',
      date: `${year}-09-15`,
      description: 'Quarterly estimated tax payment due.',
      month: 'September ' + year,
    },
    // Q3 Advance Tax — December
    {
      id: 5,
      type: 'reminder',
      title: 'Reminder : Q4 Estimated Tax Payment',
      date: `${year}-12-01`,
      description: `Reminder for upcoming Q4 estimated tax payment due on Dec 15, ${year}.`,
      month: 'December ' + year,
    },
    {
      id: 6,
      type: 'payment',
      title: 'Q4 Estimated Tax Payment',
      date: `${year}-12-15`,
      description: 'Quarterly estimated tax payment due.',
      month: 'December ' + year,
    },
  ];

  res.status(200).json({ success: true, data: deadlines });
};
