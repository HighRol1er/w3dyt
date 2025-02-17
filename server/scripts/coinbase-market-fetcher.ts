import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface MarketData {
  id: string; // 'BTC-USD'
  base_currency: string; // 'BTC'
  quote_currency: string; // 'USD'
  status: string;
}

const filePath = path.join(__dirname, 'market', 'coinbase-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchCoinbaseMarketData = async () => {
  try {
    console.log('Fetching Coinbase market data...', new Date().toISOString());
    const response = await axios.get('https://api.exchange.coinbase.com/products');

    // USD 마켓만 필터링
    const markets = response.data
      .filter((market: MarketData) => market.quote_currency === 'USD' && market.status === 'online')
      .map((market: MarketData) => ({
        symbol: market.id,
        baseAsset: market.base_currency,
        quoteAsset: market.quote_currency,
      }));

    console.log(`Found ${markets.length} USD markets`);

    const fileContent = `// 코인베이스 마켓 목록 (자동 생성됨)
export const coinbaseMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type CoinbaseMarket = typeof coinbaseMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Coinbase market list:', error);
    process.exit(1);
  }
};

fetchCoinbaseMarketData();
