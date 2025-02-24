import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ExchangeDataResponseType } from 'src/types/exchange-api';

export interface AssetPair {
  baseAsset: string;
  quoteAsset: string;
}

export abstract class BaseHttpService<T = ExchangeDataResponseType> {
  protected rawData: T[] = [];
  protected tickerList: string[] = []; // "BTC-KRW", "ETH-KRW", "XRP-KRW"
  protected assetPairs: AssetPair[] = []; // { baseAsset: "BTC", quoteAsset: "KRW" }, { baseAsset: "ETH", quoteAsset: "KRW" }, { baseAsset: "XRP", quoteAsset: "KRW" }
  protected readonly logger: Logger;
  protected abstract readonly apiEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}HttpService`);
  }
  async fetchAllMarketData() {
    try {
      const response = await axios.get<T[]>(this.apiEndpoint);

      // 거래소별 데이터 파싱 로직은 자식 클래스에서 구현
      this.rawData = response.data;
      this.tickerList = this.parseExchangeData(response.data);
      this.assetPairs = this.tickerList.map(symbol => this.parseTradingPair(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: 데이터 확인용 console.log
      // console.log('tickerList', this.tickerList);
      // console.log('assetPairs', this.assetPairs);

      // return response;
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
    }
  }

  protected abstract parseExchangeData(data: T[]): string[];

  abstract parseTradingPair(symbol: string): AssetPair;

  fetchRawData(): T[] {
    return this.rawData;
  }

  fetchTickerList(): string[] {
    // console.log('tickerList', this.tickerList);
    return this.tickerList;
  }

  fetchAssetPairs(): AssetPair[] {
    // console.log('assetPairs', this.assetPairs);
    return this.assetPairs;
  }
}
