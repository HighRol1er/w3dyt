export type UpbitSubscribeMessageType = [
  {
    ticket: string; // 식별값: UUID 권장
  },
  {
    type: 'ticker';
    codes: string[]; // ['KRW-BTC', 'KRW-ETH']
    is_only_snapshot?: boolean;
    is_only_realtime?: boolean;
  },
  {
    format: 'DEFAULT' | 'SIMPLE';
  },
];

export interface BinanceSubscribeMessageType {
  method: 'SUBSCRIBE';
  params: string[]; // ['btc@ticker', 'eth@ticker']
  id: number; // id는 응답과 요청을 식별하는 고유 값, id는 64비트 정수, 알파벳 + 숫자로 이루어진 문자열(최대36), null 값 허용
}

export type BithumbSubscribeMessageType = [
  { ticket: string },
  {
    type: 'ticker';
    codes: string[]; // ['KRW-BTC', 'KRW-ETH']
  },
  { format: 'DEFAULT' | 'SIMPLE' },
];

export type SubscribeMessageType =
  | UpbitSubscribeMessageType
  | BinanceSubscribeMessageType
  | BithumbSubscribeMessageType;
