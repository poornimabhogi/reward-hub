interface MonthlyEarnings {
  month: string; // Format: "YYYY-MM"
  amount: number;
  userId: string;
}

// Store monthly earnings in localStorage per user
export const storeEarnings = (amount: number, userId: string) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // Gets YYYY-MM
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  let earnings: MonthlyEarnings[] = storedEarnings ? JSON.parse(storedEarnings) : [];
  
  const existingEntry = earnings.find(e => e.month === currentMonth && e.userId === userId);
  if (existingEntry) {
    existingEntry.amount += amount;
  } else {
    earnings.push({ month: currentMonth, amount, userId });
  }
  
  localStorage.setItem('monthlyEarnings', JSON.stringify(earnings));
  console.log(`Stored earnings for user ${userId}: ${amount}`);
};

export const getCurrentMonthEarnings = (userId: string): number => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  if (!storedEarnings) return 0;
  
  const earnings: MonthlyEarnings[] = JSON.parse(storedEarnings);
  const currentMonthEarnings = earnings.find(e => e.month === currentMonth && e.userId === userId);
  return currentMonthEarnings?.amount || 0;
};

// Get historical earnings for a specific user
export const getUserHistoricalEarnings = (userId: string): MonthlyEarnings[] => {
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  if (!storedEarnings) return [];
  
  const earnings: MonthlyEarnings[] = JSON.parse(storedEarnings);
  return earnings.filter(e => e.userId === userId);
};

// Get total earnings for all users
export const getAllUsersEarnings = (): { [userId: string]: number } => {
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  if (!storedEarnings) return {};
  
  const earnings: MonthlyEarnings[] = JSON.parse(storedEarnings);
  return earnings.reduce((acc, curr) => {
    acc[curr.userId] = (acc[curr.userId] || 0) + curr.amount;
    return acc;
  }, {} as { [userId: string]: number });
};

// Get earnings for the current month for all users
export const getCurrentMonthAllUsersEarnings = (): { [userId: string]: number } => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const storedEarnings = localStorage.getItem('monthlyEarnings');
  if (!storedEarnings) return {};
  
  const earnings: MonthlyEarnings[] = JSON.parse(storedEarnings);
  return earnings
    .filter(e => e.month === currentMonth)
    .reduce((acc, curr) => {
      acc[curr.userId] = (acc[curr.userId] || 0) + curr.amount;
      return acc;
    }, {} as { [userId: string]: number });
};