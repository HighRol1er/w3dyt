import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
// import * as cron from 'node-cron';

interface UpbitMarketData {
  market: string;
  korean_name: string;
  english_name: string;
}

const filePath = path.join(__dirname, 'market', 'upbit-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchUpbitMarketData = async () => {
  try {
    console.log('Fetching market data...', new Date().toISOString());
    const response = await axios.get('https://api.upbit.com/v1/market/all');
    const markets = response.data.filter((market: UpbitMarketData) =>
      market.market.startsWith('KRW'),
    );
    console.log(`Found ${markets.length} KRW markets`);

    const fileContent = `// 업비트 마켓 목록 (자동 생성됨)
export const upbitMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type UpbitMarket = typeof upbitMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update market list:', error);
    process.exit(1);
  }
};

// cron.schedule('0 10 * * *', () => {
//   console.log('Starting market data update...');
//   fetchMarketData();
// });

fetchUpbitMarketData();
