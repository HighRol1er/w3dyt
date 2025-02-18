import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface BybitMarketData {
  symbol: string; // 'BTCUSDT'
  baseAsset: string; // 'BTC'
  quoteAsset: string; // 'USDT'
}

const filePath = path.join(__dirname, 'market', 'bybit-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchBybitMarketData = async () => {
  try {
    console.log('Fetching Bybit market data...', new Date().toISOString());
    const response = await axios.get('https://api.bybit.com/v5/market/tickers?category=spot');

    console.log('response', response.data);
    // USDT 마켓만 필터링
    const markets = response.data.result.list
      .filter((market: BybitMarketData) => market.symbol.endsWith('USDT'))
      .map((market: BybitMarketData) => ({
        symbol: market.symbol,
        baseAsset: market.symbol.replace('USDT', ''),
        quoteAsset: 'USDT',
      }));

    console.log(`Found ${markets.length} USDT markets`);

    const fileContent = `// 바이비트 마켓 목록 (자동 생성됨)
export const bybitMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type BybitMarket = typeof bybitMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Bybit market list:', error);
    process.exit(1);
  }
};

fetchBybitMarketData();
