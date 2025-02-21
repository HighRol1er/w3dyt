import { Injectable } from '@nestjs/common';
import { BaseApiService } from '../base/base-api.service';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitDataResponseType } from 'src/types/exchange-api';
import { AssetPair } from 'src/collector/exchange/base/base-api.service';

@Injectable()
export class UpbitApiService extends BaseApiService {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }

  protected parseExchangeData(data: UpbitDataResponseType[]) {
    return data.filter(ticker => ticker.market.startsWith('KRW-')).map(ticker => ticker.market);
  }

  protected parseTradingPair(symbol: string): AssetPair {
    const [quoteToken, baseToken] = symbol.split('-');
    return { baseAsset: baseToken, quoteAsset: quoteToken };
  }

  // fetchMarketCodes(): string[] {
  //   return this.tickerList;
  // }

  // fetchMarketPairs(): AssetPair[] {
  //   return this.assetPairs;
  // }
}
