import { Logger } from '@nestjs/common';

export function createTickerKey(exchange: string, baseAsset: string, quoteAsset: string): string {
  return `${exchange}-${baseAsset}-${quoteAsset}`;
}

export abstract class BaseTickerAggregatorService {
  protected readonly logger: Logger;
  protected exchangeTickers: string[] = [];
  protected pairwithBaseAndQuoteAssets: TradingPair[] = [];

  constructor(private readonly exchange: any) {
    this.logger = new Logger(BaseTickerAggregatorService.name);
  }

  abstract fetchAllExchangeData(): Promise<any>;
  abstract parseExchangeData(market: string): TradingPair;

  getTickers(): string[] {
    return this.exchangeTickers;
  }

  getBaseAndQuoteAssets(): TradingPair[] {
    return this.pairwithBaseAndQuoteAssets;
  }

  getRedisKeys(): string[] {
    return this.pairwithBaseAndQuoteAssets.map(pair =>
      createTickerKey(this.exchange, pair.baseAsset, pair.quoteAsset),
    );
  }
}
