export type ParseMessageTickerDataType = {
  exchange: string;
  symbol: string;
  currentPrice: string | number;
  changeRate: string | number;
  tradeVolume: string | number;
} | null;
