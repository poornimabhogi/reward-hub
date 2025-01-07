interface MonthlyEarnings {
  month: string; // Format: "YYYY-MM"
  amount: number;
}

// Store monthly earnings in localStorage
export const storeEarnings = (amount: number) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // Gets YYYY-MM
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  let earnings: MonthlyEarnings[] = storedEarnings ? JSON.parse(storedEarnings) : [];
  
  const existingMonth = earnings.find(e => e.month === currentMonth);
  if (existingMonth) {
    existingMonth.amount += amount;
  } else {
    earnings.push({ month: currentMonth, amount });
  }
  
  localStorage.setItem('monthlyEarnings', JSON.stringify(earnings));
};

export const getCurrentMonthEarnings = (): number => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  if (!storedEarnings) return 0;
  
  const earnings: MonthlyEarnings[] = JSON.parse(storedEarnings);
  const currentMonthEarnings = earnings.find(e => e.month === currentMonth);
  return currentMonthEarnings?.amount || 0;
};

// Add a method to get historical earnings
export const getHistoricalEarnings = (): MonthlyEarnings[] => {
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  return storedEarnings ? JSON.parse(storedEarnings) : [];
};