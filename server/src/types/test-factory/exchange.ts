export enum ExchangeType {
  UPBIT = 'UPBIT',
  BINANCE = 'BINANCE',
}

export interface ExchangeConfig {
  name: string;
  httpEndpoint: string;
  wsEndpoint: string;
}

export interface AssetPair {
  baseAsset: string;
  quoteAsset: string;
}

// 거래소별 응답 타입
export interface UpbitTickerResponse {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface BinanceTickerResponse {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}
