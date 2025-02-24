import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DrizzleClient } from 'src/database/database.module';
import { upbitTickersSchema } from 'src/database/schema/exchange/upbit';
import { UpbitDataResponseType } from 'src/types/exchange-http';
import { UpbitHttpService } from './exchange/upbit/upbit-http.service';

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    @Inject('DATABASE') private readonly db: typeof DrizzleClient,
    private readonly upbitHttpService: UpbitHttpService,
    // private readonly binanceService: BinanceService,
    // private readonly bithumbService: BithumbService,
    // ... 다른 거래소 서비스들
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS) // test
  @Cron(CronExpression.EVERY_HOUR)
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
      await this.upbitHttpService.fetchAllMarketData();
      const tickerData = this.upbitHttpService.fetchRawData() as UpbitDataResponseType[];
      // console.log('tickerData', tickerData);

      await this.db.transaction(async tx => {
        for (const market of tickerData) {
          if (!market.market.startsWith('KRW-')) continue;

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
}
