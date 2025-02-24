import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AssetPair } from 'src/collector/exchange/base/base-http.service';
import { API_ENDPOINTS } from 'src/common/constants';
import { UpbitDataResponseType } from 'src/types/exchange-api';
import { BaseHttpService } from '../base/base-http.service';

@Injectable()
export class UpbitHttpService extends BaseHttpService<UpbitDataResponseType> {
  protected readonly apiEndpoint = API_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  async fetchAllMarketData(): Promise<void> {
    const response = await axios.get<UpbitDataResponseType[]>(this.apiEndpoint);
    this.rawData = response.data;
    this.tickerList = this.parseExchangeData(response.data);
    this.assetPairs = this.tickerList.map(symbol => this.parseTradingPair(symbol));
  }

  protected parseExchangeData(data: UpbitDataResponseType[]) {
    return data.filter(ticker => ticker.market.startsWith('KRW-')).map(ticker => ticker.market);
  }

  parseTradingPair(symbol: string): AssetPair {
    const [quoteToken, baseToken] = symbol.split('-');
    return { baseAsset: baseToken, quoteAsset: quoteToken };
  }

  // fetchRawData(): UpbitDataResponseType[] {
  //   return this.rawData;
  // }

  // fetchTickerList(): string[] {
  //   return this.tickerList;
  // }

  // fetchAssetPairs(): AssetPair[] {
  //   return this.assetPairs;
  // }
}
