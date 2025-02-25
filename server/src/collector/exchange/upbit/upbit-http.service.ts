import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitMarketResponse } from 'src/types/exchange-http';
import { BaseHttpService } from '../base/base-http.service';
import { upbitKrwMarketParser } from 'src/utils/market-parser.util';
import { upbitAssetSplitter } from 'src/utils/asset-splitter.util';
@Injectable()
export class UpbitHttpService extends BaseHttpService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  async fetchAllMarketData(): Promise<UpbitMarketResponse[]> {
    try {
      const { data } = await axios.get<UpbitMarketResponse[]>(this.apiEndpoint);

      this.marketList = upbitKrwMarketParser(data);
      this.assetPairs = this.marketList.map(symbol => upbitAssetSplitter(symbol));

      this.logger.log(`Fetched market data for ${this.exchangeName}`);

      // NOTE: ���이��� ������� console.log
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
