/**
 * KR Exchange Asset Splitter
 * @param symbol
 * @returns
 * @example
 * upbitAssetSplitter("KRW-BTC") // { quoteAsset: "KRW", baseAsset: "BTC" }
 * bithumbAssetSplitter("BTC-KRW") // { quoteAsset: "KRW", baseAsset: "BTC" }
 */
export const krExchangeAssetSplitter = (symbol: string) => {
  const [quoteAsset, baseAsset] = symbol.split('-');
  return { quoteAsset, baseAsset };
};
