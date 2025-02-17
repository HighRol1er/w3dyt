import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface MarketData {
  instId: string; // 'BTC-USDT'
  baseCcy: string; // 'BTC'
  quoteCcy: string; // 'USDT'
  state: string; // 'live'
}

const filePath = path.join(__dirname, 'market', 'okx-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchOKXMarketData = async () => {
  try {
    console.log('Fetching OKX market data...', new Date().toISOString());
    const response = await axios.get('https://www.okx.com/api/v5/public/instruments?instType=SPOT');

    // USDT 마켓만 필터링
    const markets = response.data.data
      .filter((market: MarketData) => market.quoteCcy === 'USDT' && market.state === 'live')
      .map((market: MarketData) => ({
        symbol: market.instId,
        baseAsset: market.baseCcy,
        quoteAsset: market.quoteCcy,
      }));

    console.log(`Found ${markets.length} USDT markets`);

    const fileContent = `// OKX 마켓 목록 (자동 생성됨)
export const okxMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type OKXMarket = typeof okxMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update OKX market list:', error);
    process.exit(1);
  }
};

fetchOKXMarketData();
