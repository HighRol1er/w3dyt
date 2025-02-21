import { Injectable } from '@nestjs/common';
import { BaseApiService } from '../base/base-api.service';
import { API_ENDPOINTS } from 'src/common/constants';
import { AssetPair } from 'src/utils/parse-exchange-data';

@Injectable()
export class UpbitApiService extends BaseApiService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }

  async fetchAllMarketData(): Promise<void> {
    await super.fetchAllMarketData();
  }

  fetchMarketCodes(): string[] {
    return this.tickerList;
  }

  fetchMarketPairs(): AssetPair[] {
    return this.assetPairs;
  }
}
