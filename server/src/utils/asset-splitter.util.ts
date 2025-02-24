/**
 * Upbit Asset Splitter
 * @param symbol
 * @returns
 * @example
 * upbitAssetSplitter("KRW-BTC") // { quoteAsset: "KRW", baseAsset: "BTC" }
 */
export const upbitAssetSplitter = (symbol: string) => {
  const [quoteAsset, baseAsset] = symbol.split('-');
  return { quoteAsset, baseAsset };
};
