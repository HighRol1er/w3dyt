import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BinanceService } from '../exchange/binance/binance.service';
import { BybitService } from '../exchange/bybit/bybit.service';
import { CoinbaseService } from '../exchange/coinbase/coinbase.service';
import { OKXService } from '../exchange/okx/okx.service';
import { UpbitService } from '../exchange/upbit/upbit.service';
import { BithumbService } from '../exchange/bithumb/bithumb.service';

export interface CollectedPrice {
  symbol: string;
  price: string;
  exchange: string;
  timestamp: number;
}

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);
  private latestPrices: CollectedPrice[] = [];

  constructor(
    private readonly binanceService: BinanceService,
    private readonly bybitService: BybitService,
    private readonly coinbaseService: CoinbaseService,
    private readonly okxService: OKXService,
    private readonly upbitService: UpbitService,
    private readonly bithumbService: BithumbService,
  ) {}

  @Cron('*/10 * * * * *') // 10초마다 실행
  async handleCron() {
    this.logger.debug('가격 수집 시작...');
    try {
      this.latestPrices = await this.collectAllPrices();
      this.logger.debug(`가격 수집 완료: ${this.latestPrices.length}개 항목`);
    } catch (error) {
      this.logger.error('가격 수집 실패:', error);
    }
  }

  // 최신 수집 데이터 반환
  getLatestPrices(): CollectedPrice[] {
    return this.latestPrices;
  }

  async collectAllPrices(): Promise<CollectedPrice[]> {
    try {
      const [
        binancePrices,
        bybitPrices,
        coinbasePrices,
        okxPrices,
        upbitPrices,
        bithumbPrices,
      ] = await Promise.all([
        this.getBinancePrices(),
        this.getBybitPrices(),
        this.getCoinbasePrices(),
        this.getOKXPrices(),
        this.getUpbitPrices(),
        this.getBithumbPrices(),
      ]);

      return [
        ...binancePrices,
        ...bybitPrices,
        ...coinbasePrices,
        ...okxPrices,
        ...upbitPrices,
        ...bithumbPrices,
      ];
    } catch (error) {
      throw new Error(`가격 수집 실패: ${error.message}`);
    }
  }

  private async getBinancePrices(): Promise<CollectedPrice[]> {
    try {
      const prices = await this.binanceService.getAllMarketPrices();
      return prices.map(price => ({
        symbol: price.symbol,
        price: price.lastPrice,
        exchange: 'binance',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Binance 가격 수집 실패:', error);
      return [];
    }
  }

  private async getBybitPrices(): Promise<CollectedPrice[]> {
    try {
      const response = await this.bybitService.getAllMarketPrices();
      return response.result.list.map(price => ({
        symbol: price.symbol,
        price: price.lastPrice,
        exchange: 'bybit',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Bybit 가격 수집 실패:', error);
      return [];
    }
  }

  private async getCoinbasePrices(): Promise<CollectedPrice[]> {
    try {
      const products = await this.coinbaseService.getAllProducts();
      return products.map(product => ({
        symbol: product.product_id,
        price: product.price,
        exchange: 'coinbase',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Coinbase 가격 수집 실패:', error);
      return [];
    }
  }

  private async getOKXPrices(): Promise<CollectedPrice[]> {
    try {
      const response = await this.okxService.getAllMarketPrices();
      return response.data.map(ticker => ({
        symbol: ticker.instId,
        price: ticker.last,
        exchange: 'okx',
        timestamp: parseInt(ticker.ts),
      }));
    } catch (error) {
      console.error('OKX 가격 수집 실패:', error);
      return [];
    }
  }

  private async getUpbitPrices(): Promise<CollectedPrice[]> {
    try {
      const prices = await this.upbitService.getAllMarketPrices();
      return prices.map(price => ({
        symbol: price.market,
        price: price.trade_price.toString(),
        exchange: 'upbit',
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Upbit 가격 수집 실패:', error);
      return [];
    }
  }

  private async getBithumbPrices(): Promise<CollectedPrice[]> {
    try {
      const response = await this.bithumbService.getAllMarketPrices();
      return Object.entries(response.data).map(([symbol, data]) => ({
        symbol,
        price: data.closing_price,
        exchange: 'bithumb',
        timestamp: parseInt(data.date),
      }));
    } catch (error) {
      console.error('Bithumb 가격 수집 실패:', error);
      return [];
    }
  }
} 