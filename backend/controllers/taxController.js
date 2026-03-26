export const calculateTax = (req, res) => {

  console.log("Incoming Data:", req.body);

  let {
    income,
    expenses,
    retirement,
    insurance,
    homeOffice
  } = req.body;

  income = Number(income) || 0;
  expenses = Number(expenses) || 0;
  retirement = Number(retirement) || 0;
  insurance = Number(insurance) || 0;
  homeOffice = Number(homeOffice) || 0;

  const totalDeductions =
    expenses + retirement + insurance + homeOffice;

  const taxableIncome = income - totalDeductions;

  let tax = 0;

  if (taxableIncome <= 10000) tax = taxableIncome * 0.1;
  else if (taxableIncome <= 30000)
    tax = 1000 + (taxableIncome - 10000) * 0.2;
  else
    tax = 5000 + (taxableIncome - 30000) * 0.3;

  res.json({
    totalDeductions,
    taxableIncome,
    estimatedTax: tax
  });
};