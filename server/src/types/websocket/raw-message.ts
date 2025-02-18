// 업비트 웹소켓 응답 데이터 타입 (축약형)
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

// 빗썸 웹소켓 응답 데이터 타입
export interface BithumbRawDataType {
  type: 'ticker';
  code: string; // 마켓 코드 (ex: KRW-BTC)
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 현재가
  prev_closing_price: number; // 전일 종가
  change: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비
  change_price: number; // 부호 없는 전일 대비 값
  signed_change_price: number; // 전일 대비 값
  change_rate: number; // 부호 없는 전일 대비 등락율
  signed_change_rate: number; // 전일 대비 등락율
  trade_volume: number; // 가장 최근 거래량
  acc_trade_volume: number; // 누적 거래량
  acc_trade_volume_24h: number; // 24시간 누적 거래량
  acc_trade_price: number; // 누적 거래대금
  acc_trade_price_24h: number; // 24시간 누적 거래대금
  trade_date: string; // 최근 거래 일자 (ex: 20240910)
  trade_time: string; // 최근 거래 시각 (ex: 091617)
  trade_timestamp: number; // 체결 타임스탬프 (milliseconds)
  ask_bid: 'ASK' | 'BID'; // 매수/매도 구분
  acc_ask_volume: number; // 누적 매도량
  acc_bid_volume: number; // 누적 매수량
  highest_52_week_price: number; // 52주 최고가
  highest_52_week_date: string; // 52주 최고가 달성일
  lowest_52_week_price: number; // 52주 최저가
  lowest_52_week_date: string; // 52주 최저가 달성일
  market_state: 'ACTIVE' | 'PREVIEW' | 'DELISTED'; // 거래상태
  is_trading_suspended: boolean; // 거래 정지 여부
  delisting_date: string | null; // 상장폐지일
  market_warning: 'NONE' | 'CAUTION'; // 유의 종목 여부
  timestamp: number; // 타임스탬프 (milliseconds)
  stream_type: 'SNAPSHOT' | 'REALTIME'; // 스트림 타입
}
