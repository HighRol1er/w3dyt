import { Logger } from '@nestjs/common';
import { AssetPair } from 'src/types/asset';
import { ExchangeMarketResponse } from 'src/types/exchange-http';
export abstract class BaseHttpService {
  protected marketList: string[] = []; // "BTC-KRW", "ETH-KRW", "XRP-KRW"
  protected assetPairs: AssetPair[] = []; // { baseAsset: "BTC", quoteAsset: "KRW" }, { baseAsset: "ETH", quoteAsset: "KRW" }, { baseAsset: "XRP", quoteAsset: "KRW" }
  protected readonly logger: Logger;
  protected abstract readonly apiEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}HttpService`);
  }

  protected abstract fetchAllMarketData(): Promise<ExchangeMarketResponse[]>;

  getSymbolList(): string[] {
    return this.marketList;
  }
  // 애 굳이 안쓸꺼같은데?
  getAssetPairs(): AssetPair[] {
    return this.assetPairs;
  }
}
