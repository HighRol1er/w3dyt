/**
 * KR Exchange Market Parser
 * @param data KR Exchange API로부터 받은 전체 마켓 데이터 배열
 * @returns KRW 마켓의 심볼 목록 (예: ["KRW-BTC", "KRW-ETH", ...])
 * @example
 * const allMarkets = [
 *   { market: "KRW-BTC" },
 *   { market: "BTC-ETH" },
 *   { market: "KRW-XRP" }
 * ];
 * const krwMarkets = krExchangeMarketParser(allMarkets);
 * // 결과: ["KRW-BTC", "KRW-XRP"]
 */
export const krExchangeMarketParser = (data: any[]) => {
  return data.filter(ticker => ticker.market.startsWith('KRW-')).map(ticker => ticker.market);
};
