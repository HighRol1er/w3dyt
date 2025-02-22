import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { BaseWebSocketService } from '../base/base-ws.service';
import { formatChangeRate } from 'src/utils/number.util';
import {
  UpbitSubscribeMessageType,
  ParseMessageTickerDataType,
  UpbitRawDataType,
} from 'src/types/exchange-ws';
import { UpbitApiService } from './upbit-api.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UpbitWebSocketService extends BaseWebSocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.UPBIT;

  constructor(
    private readonly upbitApiService: UpbitApiService,
    private readonly redisService: RedisService,
  ) {
    super('Upbit');
  }

  protected async subscribe(): Promise<void> {
    // 먼저 마켓 데이터를 가져옴
    // await this.upbitApiService.fetchAllMarketData();

    const tickers = this.upbitApiService.fetchTickerList();
    console.log('Upbit Tickers:', tickers);

    const subscribeMessage: UpbitSubscribeMessageType = [
      { ticket: 'test' },
      {
        type: 'ticker',
        codes: tickers,
      },
      { format: 'SIMPLE' },
    ];

    this.ws.send(JSON.stringify(subscribeMessage));
  }

  protected async parseMessageData(data: Buffer): Promise<ParseMessageTickerDataType | null> {
    try {
      const rawData: UpbitRawDataType = JSON.parse(data.toString());
      const { baseAsset, quoteAsset } = this.upbitApiService.parseTradingPair(rawData.cd);
      const redisKey = `${EXCHANGE_NAME.UPBIT}-${baseAsset}-${quoteAsset}`;

      const tickerData: ParseMessageTickerDataType = {
        exchange: EXCHANGE_NAME.UPBIT,
        symbol: rawData.cd,
        currentPrice: rawData.tp,
        changeRate: formatChangeRate(rawData.scr),
        tradeVolume: rawData.atp24h,
      };

      // NOTE: 데이터 확인용 console.log
      // console.log('rawData: ', rawData);
      console.log('tickerData: ', tickerData);
      await this.redisService.set(redisKey, JSON.stringify(tickerData));

      return tickerData;
    } catch (error) {
      this.logger.error(`Error parsing message data: ${error.message}`, {
        data,
        error,
      });

      return null;
    }
  }
}
