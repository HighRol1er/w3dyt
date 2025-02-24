import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitMarketResponse } from 'src/types/exchange-http';
import { BaseHttpService } from '../base/base-http.service';
import { krExchangeMarketParser } from 'src/utils/market-parser.util';
import { krExchangeAssetSplitter } from 'src/utils/asset-splitter.util';
@Injectable()
export class UpbitHttpService extends BaseHttpService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  async fetchAllMarketData(): Promise<UpbitMarketResponse[]> {
    try {
      const { data } = await axios.get(this.apiEndpoint);

      this.marketList = krExchangeMarketParser(data);
      this.assetPairs = this.marketList.map(symbol => krExchangeAssetSplitter(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: 테스트용 console.log
      // console.log('data', data);
      // console.log('symbolList', this.marketList);
      // console.log('assetPairs', this.assetPairs);

      return data;
    } catch (error) {
      this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
      throw error;
    }
  }
}
