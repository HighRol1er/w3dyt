export interface AssetPair {
  baseAsset: string;
  quoteAsset: string;
}

export const parseUpbitData = (data: any) => {
  return data.map((market: any) => market.market);
};

export function parseUpbitMarket(market: string): AssetPair {
  const [quoteToken, baseToken] = market.split('-'); // KRW-BTC에서 KRW가 quoteToken, BTC가 baseToken
  return { baseAsset: baseToken, quoteAsset: quoteToken };
}
