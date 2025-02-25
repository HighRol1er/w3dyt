import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DrizzleClient } from 'src/database/database.module';
import { upbitSymbolSchema } from 'src/database/schema/exchange/upbit';
// import { binanceTickersSchema } from 'src/database/schema/exchange/binance';
// import { UpbitDataResponseType } from 'src/types/exchange-http';
import { UpbitHttpService } from './exchange/upbit/upbit-http.service';
import { BinanceHttpService } from './exchange/binance/binance-http.service';
import { BithumbHttpService } from './exchange/bithumb/bithumb-http.service';
import { bithumbSymbolSchema } from 'src/database/schema/exchange/bithumb';
// import { BinanceDataResponseType } from 'src/types/exchange-http';
@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    @Inject('DATABASE') private readonly db: typeof DrizzleClient,
    private readonly upbitHttpService: UpbitHttpService,
    private readonly binanceHttpService: BinanceHttpService,
    private readonly bithumbHttpService: BithumbHttpService,
    // private readonly binanceService: BinanceService,
    // private readonly bithumbService: BithumbService,
    // ... 다른 거래소 서비스들
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS) // test
  @Cron(CronExpression.EVERY_HOUR)
  // private 이나 protected 붙여주고싶네.
  async collectMarketData() {
    try {
      await Promise.all([
        this.collectUpbitMarket(),
        this.collectBithumbMarket(),
        // this.collectBinanceTickers(),
        // this.collectBithumbMarkets(),
        // ... 다른 거래소
      ]);
      this.logger.log('Successfully collected market data from all exchanges');
    } catch (error) {
      this.logger.error('Failed to collect market data', error);
      throw error;
    }
  }

  private async collectUpbitMarket() {
    try {
      this.logger.log('Collecting Upbit tickers...');
      const data = await this.upbitHttpService.fetchAllMarketData();
      // const tickerData = this.upbitHttpService.fetchTickerList() as UpbitDataResponseType[];
      // console.log('tickerData', tickerData);

      await this.db.transaction(async tx => {
        for (const market of data) {
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

          console.log('payload', payload);

          await tx
            .insert(upbitSymbolSchema)
            .values(payload)
            .onConflictDoUpdate({
              target: upbitSymbolSchema.currency_pair,
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

  private async collectBithumbMarket() {
    try {
      this.logger.log('Collecting Bithumb tickers...');
      const data = await this.bithumbHttpService.fetchAllMarketData();

      await this.db.transaction(async tx => {
        for (const market of data) {
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

          console.log('payload', payload);

          await tx
            .insert(bithumbSymbolSchema)
            .values(payload)
            .onConflictDoUpdate({
              target: bithumbSymbolSchema.currency_pair,
              set: { updated_at: new Date() },
            });
        }
      });
      this.logger.log('Successfully collected Bithumb tickers');
    } catch (error) {
      this.logger.error('Failed to collect Bithumb tickers', error);
      throw error;
    }
  }
  // @Cron(CronExpression.EVERY_5_SECONDS)
  // private async collectBinanceTickers() {
  //   try {
  //     this.logger.log('Collecting Binance tickers...');
  //     await this.binanceHttpService.fetchAllMarketData();

  //     // 데이터가 실제로 가져와지는지 확인
  //     console.log('Fetched ticker data length:', tickerData.length);

  //     // USDT 페어 필터링 확인
  //     const usdtPairs = tickerData.filter(market => market.symbol.endsWith('USDT'));
  //     console.log('USDT pairs count:', usdtPairs.length);

  //     await this.db.transaction(async tx => {
  //       for (const market of tickerData) {
  //         if (!market.symbol.endsWith('USDT')) continue;

  //         const payload = {
  //           currency_pair: market.symbol,
  //           korean_name: market.symbol,
  //           english_name: market.symbol,
  //           base_asset: market.symbol.split('USDT')[0],
  //           quote_asset: 'USDT',
  //           created_at: new Date(),
  //           updated_at: new Date(),
  //         };

  //         await tx
  //           .insert(binanceTickersSchema)
  //           .values(payload)
  //           .onConflictDoUpdate({
  //             target: binanceTickersSchema.currency_pair,
  //             set: { updated_at: new Date() },
  //           });
  //       }
  //     });
  //     this.logger.log('Successfully collected Binance tickers');
  //   } catch (error) {
  //     this.logger.error('Failed to collect Binance tickers', error);
  //     throw error;
  //   }
  // }
}
