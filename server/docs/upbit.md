# Upbit Ticker 데이터 필드 정의

## 개요

본 문서는 Upbit의 실시간 Ticker 데이터에서 제공하는 필드와 해당 필드의 설명을 정리한 문서입니다.

## 데이터 필드

| 필드명                | 축약형 (SIMPLE) | 설명                           | 타입    | 값                                                                       |
| --------------------- | --------------- | ------------------------------ | ------- | ------------------------------------------------------------------------ |
| type                  | ty              | 타입                           | String  | `ticker` (현재가)                                                        |
| code                  | cd              | 마켓 코드 (ex. KRW-BTC)        | String  |                                                                          |
| opening_price         | op              | 시가                           | Double  |                                                                          |
| high_price            | hp              | 고가                           | Double  |                                                                          |
| low_price             | lp              | 저가                           | Double  |                                                                          |
| trade_price           | tp              | 현재가                         | Double  |                                                                          |
| prev_closing_price    | pcp             | 전일 종가                      | Double  |                                                                          |
| change                | c               | 전일 대비                      | String  | `RISE` (상승), `EVEN` (보합), `FALL` (하락)                              |
| change_price          | cp              | 부호 없는 전일 대비 값         | Double  |                                                                          |
| signed_change_price   | scp             | 전일 대비 값                   | Double  |                                                                          |
| change_rate           | cr              | 부호 없는 전일 대비 등락율     | Double  |                                                                          |
| signed_change_rate    | scr             | 전일 대비 등락율               | Double  |                                                                          |
| trade_volume          | tv              | 가장 최근 거래량               | Double  |                                                                          |
| acc_trade_volume      | atv             | 누적 거래량 (UTC 0시 기준)     | Double  |                                                                          |
| acc_trade_volume_24h  | atv24h          | 24시간 누적 거래량             | Double  |                                                                          |
| acc_trade_price       | atp             | 누적 거래대금 (UTC 0시 기준)   | Double  |                                                                          |
| acc_trade_price_24h   | atp24h          | 24시간 누적 거래대금           | Double  |                                                                          |
| trade_date            | tdt             | 최근 거래 일자 (UTC)           | String  | `yyyyMMdd`                                                               |
| trade_time            | ttm             | 최근 거래 시각 (UTC)           | String  | `HHmmss`                                                                 |
| trade_timestamp       | ttms            | 체결 타임스탬프 (milliseconds) | Long    |                                                                          |
| ask_bid               | ab              | 매수/매도 구분                 | String  | `ASK` (매도), `BID` (매수)                                               |
| acc_ask_volume        | aav             | 누적 매도량                    | Double  |                                                                          |
| acc_bid_volume        | abv             | 누적 매수량                    | Double  |                                                                          |
| highest_52_week_price | h52wp           | 52주 최고가                    | Double  |                                                                          |
| highest_52_week_date  | h52wdt          | 52주 최고가 달성일             | String  | `yyyy-MM-dd`                                                             |
| lowest_52_week_price  | l52wp           | 52주 최저가                    | Double  |                                                                          |
| lowest_52_week_date   | l52wdt          | 52주 최저가 달성일             | String  | `yyyy-MM-dd`                                                             |
| trade_status          | ts              | 거래상태 (\*Deprecated)        | String  |                                                                          |
| market_state          | ms              | 거래상태                       | String  | `PREVIEW` (입금지원), `ACTIVE` (거래지원가능), `DELISTED` (거래지원종료) |
| market_state_for_ios  | msfi            | 거래 상태 (\*Deprecated)       | String  |                                                                          |
| is_trading_suspended  | its             | 거래 정지 여부 (\*Deprecated)  | Boolean |                                                                          |
| delisting_date        | dd              | 거래지원 종료일                | Date    |                                                                          |
| market_warning        | mw              | 유의 종목 여부                 | String  | `NONE` (해당없음), `CAUTION` (투자유의)                                  |
| timestamp             | tms             | 타임스탬프 (millisecond)       | Long    |                                                                          |
| stream_type           | st              | 스트림 타입                    | String  | `SNAPSHOT` (스냅샷), `REALTIME` (실시간)                                 |

## 참고사항

- `market_warning` 필드는 유의 종목 여부만 반환하며, `주의 종목` 여부는 포함되지 않습니다.
- `trade_status`, `market_state_for_ios`, `is_trading_suspended` 필드는 Deprecated 상태이므로 사용을 권장하지 않습니다.
- 모든 금액과 거래량은 소수점 값을 포함할 수 있습니다.
