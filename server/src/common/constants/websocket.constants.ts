export const WEBSOCKET_ENDPOINTS = {
  // Global exchange
  BINANCE: 'wss://stream.binance.com:9443/ws',
  // COINBASE: 'wss://ws-feed.exchange.coinbase.com',
  // OKX: 'wss://ws.okx.com/ws/v5',
  // BYBIT: 'wss://stream.bybit.com/v5/public/spot',
  // Korea exchange
  UPBIT: 'wss://api.upbit.com/websocket/v1',
  BITHUMB: 'wss://pubwss.bithumb.com/pub/ws',
};

export const WEBSOCKET_CONFIG = {
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    DELAY: 1000, // 1초
  },
} as const;
