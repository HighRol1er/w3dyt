import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface BithumbMarketData {
  market: string;
  korean_name: string;
  english_name: string;
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
    const response = await axios.get('https://api.bithumb.com/v1/market/all');

    // KRW 마켓만 필터링
    const markets = response.data
      .filter((coinInfo: BithumbMarketData) => coinInfo.market.startsWith('KRW'))
      .map((coinInfo: BithumbMarketData) => ({
        symbol: coinInfo.market,
        kor_name: coinInfo.korean_name,
        eng_name: coinInfo.english_name,
        baseAsset: coinInfo.market.split('-')[1],
        quoteAsset: 'KRW',
      }));

    console.log(`Found ${markets.length} KRW markets`);

    const fileContent = `// 빗썸 마켓 목록 (자동 생성됨)
export const bithumbMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type BithumbMarket = typeof bithumbMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Bithumb market list:', error);
    process.exit(1);
  }
};

fetchBithumbMarketData();
