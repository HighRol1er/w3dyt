import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface MarketData {
  name: string;
  symbol: string;
  order_currency: string; // 기본 자산 (BTC, ETH 등)
  payment_currency: string; // 견적 자산 (KRW 등)
}

const filePath = path.join(__dirname, 'market', 'bithumb-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchBithumbMarketData = async () => {
  try {
    console.log('Fetching Bithumb market data...', new Date().toISOString());
    const response = await axios.get('https://api.bithumb.com/public/ticker/ALL_KRW');

    // KRW 마켓만 필터링
    const markets = Object.keys(response.data.data)
      .filter(symbol => symbol !== 'date')
      .map(symbol => ({
        symbol: `${symbol}_KRW`,
        name: symbol,
        order_currency: symbol,
        payment_currency: 'KRW',
      }));

    console.log(`Found ${markets.length} KRW markets`);

    const fileContent = `// 빗썸 마켓 목록 (자동 생성됨)
export const bithumbMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type BithumbMarket = typeof bithumbMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Bithumb market list:', error);
    process.exit(1);
  }
};

fetchBithumbMarketData();
