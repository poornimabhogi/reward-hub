import { getCurrentMonthEarnings } from './earningsTracker';

export const calculateLuckyDrawAmount = (baseAmount: number) => {
  // Get actual monthly earnings from tracker
  const monthlyEarnings = getCurrentMonthEarnings();
  
  // Calculate 30% of total earnings (base amount + monthly earnings)
  const luckyDrawPool = (baseAmount + monthlyEarnings) * 0.3;
  
  // Divide by 50 to get float value
  const floatValue = luckyDrawPool / 50;
  
  // Convert to integer by removing decimal points
  const intValue = parseInt(floatValue.toString());
  
  // Calculate total accumulation
  const totalAccumulation = intValue * 50;
  
  return {
    luckyDrawPool,
    totalAccumulation,
    monthlyEarnings
  };
};