import { Logger } from '@nestjs/common';
import { AssetPair } from 'src/types/test-factory/exchange';

export abstract class BaseHttpService {
  protected marketList: string[] = []; // "BTC-KRW", "ETH-KRW", "XRP-KRW"
  protected assetPairs: AssetPair[] = []; // { baseAsset: "BTC", quoteAsset: "KRW" }, { baseAsset: "ETH", quoteAsset: "KRW" }, { baseAsset: "XRP", quoteAsset: "KRW" }
  protected readonly logger: Logger;
  protected abstract readonly apiEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}HttpService`);
  }
  //TODO: any타입 수정 필요
  protected abstract fetchAllMarketData(): Promise<any>;

  getSymbolList(): string[] {
    // console.log('tickerList', this.tickerList);
    return this.marketList;
  }
  // 애 굳이 안쓸꺼같은데?
  getAssetPairs(): AssetPair[] {
    // console.log('assetPairs', this.assetPairs);
    return this.assetPairs;
  }
}
