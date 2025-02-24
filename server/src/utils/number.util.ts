/**
 * 변화율 포멧팅
 * 예시: 0.11 -> 11%
 */

// 포멧팅 시바이누처럼 0 미만인 애들 전용으로 필터링 해줘야 할듯
export const formatChangeRate = (rate: number): string => {
  if (isNaN(rate)) return '0.00%';
  const percentageRate = rate * 100;
  return `${percentageRate.toFixed(2)}%`;
};
