import { Logger } from '@nestjs/common';
import axios from 'axios';
// import { TickerPair } from 'src/types/exchange-ws';

export interface TickerPair {
  baseAsset: string;
  quoteAsset: string;
}

export abstract class BaseApiService {
  protected marketTickers: string[] = [];
  protected marketPairs: TickerPair[] = [];
  protected readonly logger: Logger;
  protected abstract readonly apiEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}MarketDataService`);
  }

  async fetchAllMarketData(): Promise<void> {
    try {
      const response = await axios.get(this.apiEndpoint);
      this.marketPairs = this.parseMarketData(response.data);
      this.marketTickers = this.marketPairs.map(
        ({ baseAsset, quoteAsset }) => `${baseAsset}-${quoteAsset}`,
      );
      this.logger.log(`Fetched market data for ${this.exchangeName}`);
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
    }
  }

  protected abstract parseMarketData(data: any): TickerPair[];

  getMarketCodes(): string[] {
    return this.marketTickers;
  }

  getMarketPairs(): TickerPair[] {
    return this.marketPairs;
  }
}
