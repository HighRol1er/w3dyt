import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AssetPair } from 'src/collector/exchange/base/base-http.service';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitDataResponseType } from 'src/types/exchange-http';
import { BaseHttpService } from '../base/base-http.service';

@Injectable()
export class UpbitHttpService extends BaseHttpService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  async fetchAllMarketData(): Promise<void> {
    try {
      const { data } = await axios.get<UpbitDataResponseType[]>(this.apiEndpoint);
      this.rawData = data;
      this.tickerList = this.parseExchangeData(data);
      this.assetPairs = this.tickerList.map(symbol => this.parseTradingPair(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: 데이터 확인용 console.log
      // console.log('data', data);
      // console.log('rawData', this.rawData);
      // console.log('tickerList', this.tickerList);
      // console.log('assetPairs', this.assetPairs);
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
      throw error;
    }
  }

  protected parseExchangeData(data: UpbitDataResponseType[]) {
    return data.filter(ticker => ticker.market.startsWith('KRW-')).map(ticker => ticker.market);
  }

  parseTradingPair(symbol: string): AssetPair {
    const [quoteToken, baseToken] = symbol.split('-');
    return { baseAsset: baseToken, quoteAsset: quoteToken };
  }
}
