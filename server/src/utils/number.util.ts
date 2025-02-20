/**
 * 변화율 포멧팅
 * 예시: 0.11 -> 11%
 */
export const formatChangeRate = (rate: number): string => {
  if (isNaN(rate)) return '0.00%';
  const percentageRate = rate * 100;
  return `${percentageRate.toFixed(2)}%`;
};
