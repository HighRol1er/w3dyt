import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpbitApiService } from './exchange/upbit/upbit-http.service';
import { upbitTickersSchema } from 'src/database/schema/exchange/upbit';
import { UpbitDataResponseType } from 'src/types/exchange-api/raw-response';
import { DrizzleClient } from 'src/database/database.module';
import { AxiosResponse } from 'axios';
// import { BinanceService } from './exchange/binance/binance.service';
// import { BithumbService } from './exchange/bithumb/bithumb.service';
// ... 다른 거래소 서비스들

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    @Inject('DATABASE') private readonly db: typeof DrizzleClient,
    private readonly upbitApiService: UpbitApiService,
    // private readonly binanceService: BinanceService,
    // private readonly bithumbService: BithumbService,
    // ... 다른 거래소 서비스들
  ) {}

  // @Cron('*/5 * * * * *')
  async collectMarketData() {
    try {
      await Promise.all([
        this.collectUpbitTickers(),
        // this.collectBinanceMarkets(),
        // this.collectBithumbMarkets(),
        // ... 다른 거래소들
      ]);
      this.logger.log('Successfully collected market data from all exchanges');
    } catch (error) {
      this.logger.error('Failed to collect market data', error);
      throw error;
    }
  }

  private async collectUpbitTickers() {
    try {
      this.logger.log('Collecting Upbit tickers...');
      await this.upbitApiService.fetchAllMarketData();
      const tickerData = this.upbitApiService.fetchRawData();

      await this.db.transaction(async tx => {
        for (const market of tickerData) {
          const payload = {
            currency_pair: market.market,
            korean_name: market.korean_name,
            english_name: market.english_name,
            base_asset: market.market.split('-')[1],
            quote_asset: market.market.split('-')[0],
            created_at: new Date(),
            updated_at: new Date(),
          };

          await tx
            .insert(upbitTickersSchema)
            .values(payload)
            .onConflictDoUpdate({
              target: upbitTickersSchema.currency_pair,
              set: { updated_at: new Date() },
            });
        }
      });
      this.logger.log('Successfully collected Upbit tickers');
    } catch (error) {
      this.logger.error('Failed to collect Upbit tickers', error);
      throw error;
    }
  }

  // private async collectBinanceMarkets() { ... }
  // private async collectBithumbMarkets() { ... }
}
