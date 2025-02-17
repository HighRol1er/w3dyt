import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface MarketData {
  altname: string; // 'BTCUSD'
  wsname: string; // 'BTC/USD'
  base: string; // 'BTC'
  quote: string; // 'USD'
  status: string; // 'online'
}

const filePath = path.join(__dirname, 'market', 'kraken-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchKrakenMarketData = async () => {
  try {
    console.log('Fetching Kraken market data...', new Date().toISOString());
    const response = await axios.get('https://api.kraken.com/0/public/AssetPairs');

    // USD 마켓만 필터링
    const markets = Object.values(response.data.result)
      .filter((market: MarketData) => market.quote === 'ZUSD' && market.status === 'online')
      .map((market: MarketData) => ({
        symbol: market.altname,
        baseAsset: market.base,
        quoteAsset: 'USD',
        wsname: market.wsname,
      }));

    console.log(`Found ${markets.length} USD markets`);

    const fileContent = `// 크라켄 마켓 목록 (자동 생성됨)
export const krakenMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type KrakenMarket = typeof krakenMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Kraken market list:', error);
    process.exit(1);
  }
};

fetchKrakenMarketData();
