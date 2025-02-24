import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AssetPair, BaseHttpService } from '../base/base-http.service';
import { BinanceDataResponseType } from 'src/types/exchange-http';
import { API_ENDPOINTS } from 'src/common/constants';
@Injectable()
export class BinanceHttpService extends BaseHttpService {
  protected readonly apiEndpoint = API_ENDPOINTS.BINANCE;

  constructor() {
    super('Binance');
  }

  async fetchAllMarketData(): Promise<void> {
    try {
      const response = await axios.get<{ symbols: BinanceDataResponseType[] }>(this.apiEndpoint);

      this.rawData = response.data.symbols;
      this.tickerList = this.parseExchangeData(response.data.symbols);
      this.assetPairs = this.tickerList.map(symbol => this.parseTradingPair(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: 데이터 확인용 console.log
      // console.log('response', response);
      // console.log('rawData', this.rawData);
      // console.log('tickerList', this.tickerList);
      // console.log('assetPairs', this.assetPairs);
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
      throw error;
    }
  }

  protected parseExchangeData(data: BinanceDataResponseType[]): string[] {
    return data
      .filter(
        symbol =>
          symbol?.quoteAsset === 'USDT' &&
          symbol?.status === 'TRADING' &&
          symbol?.isSpotTradingAllowed === true,
      )
      .map(symbol => symbol.symbol);
  }

  parseTradingPair(symbol: string): AssetPair {
    const baseAsset = symbol.slice(0, -4); // Remove 'USDT' from the end
    const quoteAsset = 'USDT';
    return { baseAsset, quoteAsset };
  }
}
