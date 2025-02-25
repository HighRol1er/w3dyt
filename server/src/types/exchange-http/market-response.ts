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
  timezone: string;
  serverTime: number;
  symbols: any[]; //TODO: 타입 수정해야됨
}

export type ExchangeMarketResponse =
  | UpbitMarketResponse
  | BithumbMarketResponse
  | BinanceMarketResponse;
