export const calculateLuckyDrawAmount = (monthlyEarnings: number) => {
  // Calculate 30% of total earnings
  const luckyDrawPool = monthlyEarnings * 0.3;
  
  // Divide by 50 to get float value
  const floatValue = luckyDrawPool / 50;
  
  // Convert to integer by removing decimal points
  const intValue = parseInt(floatValue.toString());
  
  // Calculate total accumulation
  const totalAccumulation = intValue * 50;
  
  return {
    luckyDrawPool,
    totalAccumulation
  };
};