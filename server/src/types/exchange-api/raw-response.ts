/**
 * Upbit raw-data type
 */
export interface UpbitDataResponseType {
  market: string; // 예: "KRW-BTC"
  korean_name: string; // 예: "비트코인"
  english_name: string; // 예: "Bitcoin"
  market_event: MarketEvent;
}

export interface MarketEvent {
  warning: boolean;
  caution: MarketCaution;
}

export interface MarketCaution {
  PRICE_FLUCTUATIONS: boolean;
  TRADING_VOLUME_SOARING: boolean;
  DEPOSIT_AMOUNT_SOARING: boolean;
  GLOBAL_PRICE_DIFFERENCES: boolean;
  CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
}

/**
 * Bithumb raw-data type
 */
export interface BithumbDataResponseType {
  symbol: string;
  price: string;
}

/**
 * Binance raw-data type
 */
export interface BinanceDataResponseType {
  symbol: string;
  price: string;
}

export type ExchangeDataResponseType =
  | UpbitDataResponseType
  | BithumbDataResponseType
  | BinanceDataResponseType;
