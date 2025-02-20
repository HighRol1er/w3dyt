/**************************
 *     KOREA EXCHANGE     *
 **************************/

// 업비트 웹소켓 응답 데이터 타입 (SIMPLE)
export interface UpbitRawDataType {
  ty: 'ticker';
  cd: string; // code
  op: number; // opening_price
  hp: number; // high_price
  lp: number; // low_price
  tp: number; // trade_price
  pcp: number; // prev_closing_price
  atp: number; // acc_trade_price
  c: 'RISE' | 'EVEN' | 'FALL'; // change
  cp: number; // change_price
  scp: number; // signed_change_price
  cr: number; // change_rate
  scr: number; // signed_change_rate
  ab: 'ASK' | 'BID'; // ask_bid
  tv: number; // trade_volume
  atv: number; // acc_trade_volume
  tdt: string; // trade_date
  ttm: string; // trade_time
  ttms: number; // trade_timestamp
  aav: number; // acc_ask_volume
  abv: number; // acc_bid_volume
  h52wp: number; // highest_52_week_price
  h52wdt: string; // highest_52_week_date
  l52wp: number; // lowest_52_week_price
  l52wdt: string; // lowest_52_week_date
  ms: 'ACTIVE' | 'PREVIEW' | 'DELISTED'; // market_state
  its: boolean; // is_trading_suspended
  dd: string | null; // delisting_date
  mw: 'NONE' | 'CAUTION'; // market_warning
  tms: number; // timestamp
  atp24h: number; // acc_trade_price_24h
  atv24h: number; // acc_trade_volume_24h
  st: 'SNAPSHOT' | 'REALTIME'; // stream_type
}

// 빗썸 웹소켓 응답 데이터 타입 (SIMPLE)
export interface BithumbRawDataType {
  ty: 'ticker';
  cd: string; // 마켓 코드 (ex: KRW-BTC)
  op: number; // 시가
  hp: number; // 고가
  lp: number; // 저가
  tp: number; // 현재가
  pcp: number; // 전일 종가
  c: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비
  cp: number; // 부호 없는 전일 대비 값
  scp: number; // 전일 대비 값
  cr: number; // 부호 없는 전일 대비 등락율
  scr: number; // 전일 대비 등락율
  tv: number; // 가장 최근 거래량
  atv: number; // 누적 거래량
  atv24h: number; // 24시간 누적 거래량
  atp: number; // 누적 거래대금
  atp24h: number; // 24시간 누적 거래대금
  tdt: string; // 최근 거래 일자 (ex: 20240910)
  ttm: string; // 최근 거래 시각 (ex: 091617)
  ttms: number; // 체결 타임스탬프 (milliseconds)
  ab: 'ASK' | 'BID'; // 매수/매도 구분
  aav: number; // 누적 매도량
  abv: number; // 누적 매수량
  h52wp: number; // 52주 최고가
  h52wdt: string; // 52주 최고가 달성일
  l52wp: number; // 52주 최저가
  l52wdt: string; // 52주 최저가 달성일
  ms: string;
  its: boolean; // 거래 정지 여부
  dd: string | null; // 상장폐지일
  mw: 'NONE' | 'CAUTION'; // 유의 종목 여부
  tms: number; // 타임스탬프 (milliseconds)
  st: 'SNAPSHOT' | 'REALTIME'; // 스트림 타입
}

/**************************
 *     GLOBAL EXCHANGE    *
 **************************/

export interface BinanceRawDataType {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price 현재 가격
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Open time
  C: number; // Close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Number of trades
}

export interface BybitRawDataType {
  topic: string; // 'tickers.BTCUSDT'
  type: string; // 'snapshot' | 'delta'
  data: {
    symbol: string; // 'BTCUSDT'
    lastPrice: string;
    price24hPcnt: string;
    volume24h: string;
    // ... 기타 필드들
  };
  ts: number; // timestamp
}

export interface CoinbaseRawDataType {
  type: 'ticker';
  sequence: number;
  product_id: string;
  price: string;
  open_24h: string;
  volume_24h: string;
  low_24h: string;
  high_24h: string;
  volume_30d: string;
  best_bid: string;
  best_bid_size: string;
  best_ask: string;
  best_ask_size: string;
  side: string;
  time: string;
  trade_id: number;
  last_size: string;
}

export interface KrakenRawDataType {
  channel: 'ticker';
  type: 'update';
  data: [
    {
      symbol: string;
      bid: number;
      bid_qty: number;
      ask: number;
      ask_qty: number;
      last: number;
      volume: number;
      vwap: number;
      low: number;
      high: number;
      change: number;
      change_pct: number;
    },
  ];
}

// OKX 구독 응답 메시지
export interface OKXSubscribeResponse {
  event: 'subscribe';
  arg: {
    channel: 'tickers';
    instId: string;
  };
  connId: string;
}

// OKX 티커 데이터
export interface OKXTickerData {
  instType: string;
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  sodUtc0: string; // Start of day UTC 0
  sodUtc8: string; // Start of day UTC+8
  volCcy24h: string; // Volume in currency (USDT)
  vol24h: string; // Volume in base currency (ETH)
  ts: string; // spot
}

// OKX 실제 데이터 메시지
export interface OKXDataMessage {
  arg: {
    channel: 'tickers';
    instId: string;
  };
  data: OKXTickerData[];
}

// OKX 전체 메시지 타입
export type OKXRawDataType = OKXSubscribeResponse | OKXDataMessage;
