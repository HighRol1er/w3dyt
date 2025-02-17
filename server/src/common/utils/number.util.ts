/**
 * 변화율 포멧팅
 * 예시: 1.23456789 -> 1.23%
 */
export const formatChangeRate = (rate: number): string => {
  if (isNaN(rate)) return '0.00%';
  return `${rate.toFixed(2)}%`;
};
