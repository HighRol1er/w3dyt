import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface MarketData {
  symbol: string;
  baseAsset: string; // 기본 자산 (BTC, ETH 등)
  quoteAsset: string; // 견적 자산 (USDT 등)
  status: string;
}

const filePath = path.join(__dirname, 'market', 'binance-market-data.ts');

const ensureDirectoryExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchBinanceMarketData = async () => {
  try {
    console.log('Fetching Binance market data...', new Date().toISOString());
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');

    // USDT 마켓만 필터링
    const markets = response.data.symbols
      .filter((market: MarketData) => market.quoteAsset === 'USDT' && market.status === 'TRADING')
      .map((market: MarketData) => ({
        symbol: market.symbol,
        baseAsset: market.baseAsset,
        quoteAsset: market.quoteAsset,
      }));

    console.log(`Found ${markets.length} USDT markets`);

    const fileContent = `// 바이낸스 마켓 목록 (자동 생성됨)
export const binanceMarketData = ${JSON.stringify(markets, null, 2)} as const;

export type BinanceMarket = typeof binanceMarketData[number];
`;

    ensureDirectoryExists();
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    console.log(`Market list updated: ${markets.length} markets found`);
    console.log(`File saved to: ${filePath}`);
  } catch (error) {
    console.error('Failed to update Binance market list:', error);
    process.exit(1);
  }
};

fetchBinanceMarketData();
