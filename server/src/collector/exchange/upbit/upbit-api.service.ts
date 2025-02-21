import { Injectable } from '@nestjs/common';
import { BaseApiService, TickerPair } from '../base/base-api.service';
import { API_ENDPOINTS } from 'src/common/constants';

@Injectable()
export class UpbitApiService extends BaseApiService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }

  protected parseMarketData(data: any): TickerPair[] {
    return data.map(market => ({
      baseAsset: market.baseAsset,
      quoteAsset: market.quoteAsset,
    }));
  }
}
