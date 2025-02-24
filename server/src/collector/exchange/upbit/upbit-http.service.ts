import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitDataResponseType } from 'src/types/exchange-http';
import { BaseHttpService } from '../base/base-http.service';
import { upbitKrwMarketParser } from 'src/utils/market-parser.util';
@Injectable()
export class UpbitHttpService extends BaseHttpService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  async fetchAllMarketData(): Promise<any> {
    try {
      const { data } = await axios.get<UpbitDataResponseType[]>(this.apiEndpoint);

      this.marketList = upbitKrwMarketParser(data);
      // this.assetPairs = this.symbolList.map(symbol => this.parseTradingPair(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: 데이터 확인용 console.log
      // console.log('data', data);
      // console.log('rawData', this.rawData);
      // console.log('symbolList', this.symbolList);
      // console.log('assetPairs', this.assetPairs);

      return data;
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
      throw error;
    }
  }
}
