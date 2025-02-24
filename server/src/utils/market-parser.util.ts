/**
 * Upbit KRW Market Parser - KRW 마켓의 심볼만 필터링하여 반환
 * @param data Upbit API로부터 받은 전체 마켓 데이터 배열
 * @returns KRW 마켓의 심볼 목록 (예: ["KRW-BTC", "KRW-ETH", ...])
 * @example
 * const allMarkets = [
 *   { market: "KRW-BTC" },
 *   { market: "BTC-ETH" },
 *   { market: "KRW-XRP" }
 * ];
 * const krwMarkets = upbitKrwMarketParser(allMarkets);
 * // 결과: ["KRW-BTC", "KRW-XRP"]
 */
export const upbitKrwMarketParser = (data: any[]) => {
  return data.filter(ticker => ticker.market.startsWith('KRW-')).map(ticker => ticker.market);
};
