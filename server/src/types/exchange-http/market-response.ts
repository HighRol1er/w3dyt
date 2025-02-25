// *************************
// *     KOREA EXCHANGE    *
// *************************
export interface UpbitMarketResponse {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface BithumbMarketResponse {
  market: string;
  korean_name: string;
  english_name: string;
}

// *************************
// *    GLOBAL EXCHANGE    *
// *************************
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
