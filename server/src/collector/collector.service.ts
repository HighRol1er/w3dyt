import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DrizzleClient } from 'src/database/database.module';
import { sql } from 'drizzle-orm';

import { UpbitHttpService } from './exchange/upbit/upbit-http.service';
import { UpbitWebSocketService } from './exchange/upbit/upbit-ws.service';
import { upbitSymbolSchema } from 'src/database/schema/exchange/upbit';

import { BithumbHttpService } from './exchange/bithumb/bithumb-http.service';
import { BithumbWebSocketService } from './exchange/bithumb/bithumb-ws.service';
import { bithumbSymbolSchema } from 'src/database/schema/exchange/bithumb';

// import { BinanceHttpService } from './exchange/binance/binance-http.service';
// import { binanceTickersSchema } from 'src/database/schema/exchange/binance';
// import { BinanceDataResponseType } from 'src/types/exchange-http';

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    @Inject('DATABASE') private readonly db: typeof DrizzleClient,
    private readonly upbitHttpService: UpbitHttpService,
    private readonly upbitWebSocketService: UpbitWebSocketService,
    private readonly bithumbHttpService: BithumbHttpService,
    private readonly bithumbWebSocketService: BithumbWebSocketService,
    // private readonly binanceHttpService: BinanceHttpService,
    // private readonly binanceService: BinanceService,
    // private readonly bithumbService: BithumbService,
    // ... 다른 거래소 서비스들
  ) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
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
      const allMarketData = await this.upbitHttpService.fetchAllMarketData();
      const newMarketData = allMarketData.filter(market => market.market.startsWith('KRW-'));

      // 현재 DB에 있는 마켓 데이터 조회
      const currentMarkets = await this.db
        .select({ currency_pair: upbitSymbolSchema.currency_pair })
        .from(upbitSymbolSchema);

      const currentMarketSet = new Set(currentMarkets.map(m => m.currency_pair));
      const newMarketSet = new Set(newMarketData.map(m => m.market));

      // 상장 폐지된 마켓 찾기
      const delistedMarkets = currentMarkets
        .filter(market => !newMarketSet.has(market.currency_pair))
        .map(market => market.currency_pair);

      // 신규 상장된 마켓 찾기
      const newlyListedMarkets = newMarketData
        .filter(market => !currentMarketSet.has(market.market))
        .map(market => market.market);

      if (delistedMarkets.length > 0) {
        this.logger.log(`Delisted markets in Upbit: ${delistedMarkets.join(', ')}`);
      }
      if (newlyListedMarkets.length > 0) {
        this.logger.log(`Newly listed markets in Upbit: ${newlyListedMarkets.join(', ')}`);
      }

      // DB 업데이트 (신규 상장 및 업데이트)
      await this.db.transaction(async tx => {
        // 상장 폐지된 마켓 삭제
        if (delistedMarkets.length > 0) {
          await tx
            .delete(upbitSymbolSchema)
            .where(sql`${upbitSymbolSchema.currency_pair} IN ${delistedMarkets}`);
        }

        // 신규 상장 및 업데이트
        for (const market of newMarketData) {
          const payload = {
            currency_pair: market.market,
            korean_name: market.korean_name,
            english_name: market.english_name,
            base_asset: market.market.split('-')[1],
            quote_asset: market.market.split('-')[0],
            created_at: new Date(),
            updated_at: new Date(),
          };

          // console.log('payload', payload);

          await tx
            .insert(upbitSymbolSchema)
            .values(payload)
            .onConflictDoUpdate({
              target: upbitSymbolSchema.currency_pair,
              set: { updated_at: new Date() },
            });
        }
      });

      // 변경사항이 있을 때만 WebSocket 갱신
      const hasChanges =
        delistedMarkets.length > 0 ||
        newMarketData.some(market => !currentMarketSet.has(market.market));

      if (hasChanges) {
        this.logger.log('Market list changed, refreshing WebSocket connection...');
        await this.upbitWebSocketService.refreshSubscription();
      }

      this.logger.log('Successfully collected Upbit tickers');
    } catch (error) {
      this.logger.error('Failed to collect Upbit tickers', error);
      throw error;
    }
  }

  private async collectBithumbMarket() {
    try {
      this.logger.log('Collecting Bithumb tickers...');
      const allMarketData = await this.bithumbHttpService.fetchAllMarketData();
      const newMarketData = allMarketData.filter(market => market.market.startsWith('KRW-'));

      // 현재 DB에 있는 마켓 데이터 조회
      const currentMarkets = await this.db
        .select({ currency_pair: bithumbSymbolSchema.currency_pair })
        .from(bithumbSymbolSchema);

      const currentMarketSet = new Set(currentMarkets.map(m => m.currency_pair));
      const newMarketSet = new Set(newMarketData.map(m => m.market));

      // 상장 폐지된 마켓 찾기
      const delistedMarkets = currentMarkets
        .filter(market => !newMarketSet.has(market.currency_pair))
        .map(market => market.currency_pair);

      console.log('delistedMarkets', delistedMarkets);

      // DB 업데이트 (신규 상장 및 업데이트)
      await this.db.transaction(async tx => {
        // 상장 폐지된 마켓 삭제
        if (delistedMarkets.length > 0) {
          await tx
            .delete(bithumbSymbolSchema)
            .where(sql`${bithumbSymbolSchema.currency_pair} IN ${delistedMarkets}`);
        }

        // 신규 상장 및 업데이트
        for (const market of newMarketData) {
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
            .insert(bithumbSymbolSchema)
            .values(payload)
            .onConflictDoUpdate({
              target: bithumbSymbolSchema.currency_pair,
              set: { updated_at: new Date() },
            });
        }
      });

      // 변경사항이 있을 때만 WebSocket 갱신
      const hasChanges =
        delistedMarkets.length > 0 ||
        newMarketData.some(market => !currentMarketSet.has(market.market));

      if (hasChanges) {
        this.logger.log('Market list changed, refreshing WebSocket connection...');
        await this.bithumbWebSocketService.refreshSubscription();
      }

      this.logger.log('Successfully collected Bithumb tickers');
    } catch (error) {
      this.logger.error('Failed to collect Bithumb tickers', error);
      throw error;
    }
  }

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
