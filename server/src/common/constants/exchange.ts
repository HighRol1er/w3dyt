export const EXCHANGE_NAME = {
  UPBIT: 'upbit',
  BINANCE: 'binance',
  BITHUMB: 'bithumb',
  KRAKEN: 'kraken',
  BYBIT: 'bybit',
  OKX: 'okx',
  BITGET: 'bitget',
  COINBASE: 'coinbase',
  GEMINI: 'gemini',
  HUOBI: 'huobi',
  BITFINEX: 'bitfinex',
  BITSTAMP: 'bitstamp',
  BITTREX: 'bittrex',
  KUCOIN: 'kucoin',
  BITMEX: 'bitmex',
} as const;

export const API_ENDPOINTS = {
  // Global exchange
  BINANCE: 'https://api.binance.com/api/v3/exchangeInfo',
  BYBIT: 'https://api.bybit.com/v5/market/tickers?category=spot',
  COINBASE: 'https://api.exchange.coinbase.com/products',
  KRAKEN: 'https://api.kraken.com/0/public/AssetPairs',
  OKX: 'https://www.okx.com/api/v5/public/instruments?instType=SPOT',
  // Korea exchange
  BITHUMB: 'https://api.bithumb.com/v1/market/all',
  UPBIT: 'https://api.upbit.com/v1/market/all',
} as const;

export const WEBSOCKET_ENDPOINTS = {
  // Global exchange
  BINANCE: 'wss://stream.binance.com:9443/ws',
  COINBASE: 'wss://ws-feed.exchange.coinbase.com',
  OKX: 'wss://ws.okx.com:8443/ws/v5/public',
  BYBIT: 'wss://stream.bybit.com/v5/public/spot',
  KRAKEN: 'wss://ws.kraken.com/v2',
  // Korea exchange
  UPBIT: 'wss://api.upbit.com/websocket/v1',
  BITHUMB: 'wss://ws-api.bithumb.com/websocket/v1',
} as const;

export const WEBSOCKET_CONFIG = {
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    DELAY: 1000, // 1초
  },
} as const;
