// Get current month's earnings for a specific user
export const getCurrentMonthEarnings = (userId: string): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const key = `earnings_${userId}_${currentYear}_${currentMonth}`;
  
  const earnings = localStorage.getItem(key);
  return earnings ? parseInt(earnings) : 0;
};

// Update earnings for a user
export const updateUserEarnings = (userId: string, amount: number): void => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const key = `earnings_${userId}_${currentYear}_${currentMonth}`;
  
  const currentEarnings = getCurrentMonthEarnings(userId);
  const newEarnings = currentEarnings + amount;
  
  localStorage.setItem(key, newEarnings.toString());
};

// Get historical earnings for a user
export const getHistoricalEarnings = (userId: string): { month: string; earnings: number }[] => {
  const earnings: { month: string; earnings: number }[] = [];
  
  // Get all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`earnings_${userId}`)) {
      const [_, __, year, month] = key.split('_');
      const amount = parseInt(localStorage.getItem(key) || '0');
      
      earnings.push({
        month: `${year}-${month}`,
        earnings: amount
      });
    }
  }
  
  return earnings.sort((a, b) => b.month.localeCompare(a.month));
};