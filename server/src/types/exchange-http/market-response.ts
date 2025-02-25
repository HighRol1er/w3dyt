/**
 * Upbit raw-data type
 */
export interface UpbitMarketResponse {
  market: string;
  korean_name: string;
  english_name: string;
}

/**
 * Bithumb raw-data type
 */
export interface BithumbMarketResponse {
  symbol: string;
  price: string;
}

/**
 * Binance raw-data type
 */
export interface BinanceMarketResponse {
  symbol: string;
  quoteAsset: string;
  status: string;
  isSpotTradingAllowed: boolean;
}

export type ExchangeMarketResponse =
  | UpbitMarketResponse
  | BithumbMarketResponse
  | BinanceMarketResponse;
