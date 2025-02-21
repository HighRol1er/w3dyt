import { Logger } from '@nestjs/common';
import axios from 'axios';
import { parseUpbitData, AssetPair, parseUpbitMarket } from 'src/utils/parse-exchange-data';

export abstract class BaseApiService {
  protected tickerList: string[] = []; // "BTC-KRW", "ETH-KRW", "XRP-KRW"
  protected assetPairs: AssetPair[] = []; // { baseAsset: "BTC", quoteAsset: "KRW" }, { baseAsset: "ETH", quoteAsset: "KRW" }, { baseAsset: "XRP", quoteAsset: "KRW" }
  protected readonly logger: Logger;
  protected abstract readonly apiEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}ApiService`);
  }

  async fetchAllMarketData(): Promise<void> {
    try {
      const response = await axios.get(this.apiEndpoint);
      // EX) // KRW 마켓만 필터링
      this.tickerList = parseUpbitData(response.data);
      // 티커 페어로 나눔
      this.assetPairs = this.tickerList.map(symbol => parseUpbitMarket(symbol));

      console.log('tickerList', this.tickerList);
      console.log('assetPairs', this.assetPairs);
      this.logger.log(`Fetched market data for ${this.exchangeName}`);
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
    }
  }

  // protected abstract parseMarketData(data: any);

  fetchMarketCodes(): string[] {
    return this.tickerList;
  }

  fetchMarketPairs(): AssetPair[] {
    return this.assetPairs;
  }
}
