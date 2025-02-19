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
