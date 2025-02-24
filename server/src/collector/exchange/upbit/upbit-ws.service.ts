import { Injectable } from '@nestjs/common';
import { EXCHANGE_NAME, WEBSOCKET_ENDPOINTS } from 'src/common/constants';
import { RedisService } from 'src/redis/redis.service';
import {
  ParseMessageTickerDataType,
  UpbitRawDataType,
  UpbitSubscribeMessageType,
} from 'src/types/exchange-ws';
import { formatChangeRate } from 'src/utils/number.util';
import { krExchangeAssetSplitter } from 'src/utils/asset-splitter.util';
import { BaseWebSocketService } from '../base/base-ws.service';
import { UpbitHttpService } from './upbit-http.service';

@Injectable()
export class UpbitWebSocketService extends BaseWebSocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.UPBIT;

  constructor(
    private readonly upbitHttpService: UpbitHttpService,
    private readonly redisService: RedisService,
  ) {
    super('Upbit');
  }

  protected async subscribe(): Promise<void> {
    const symbols = this.upbitHttpService.getSymbolList();

    const subscribeMessage: UpbitSubscribeMessageType = [
      { ticket: 'test' },
      {
        type: 'ticker',
        codes: symbols,
      },
      { format: 'SIMPLE' },
    ];

    this.ws.send(JSON.stringify(subscribeMessage));
  }

  protected async parseMessageData(data: Buffer): Promise<ParseMessageTickerDataType | null> {
    try {
      const rawData: UpbitRawDataType = JSON.parse(data.toString());
      const { baseAsset, quoteAsset } = krExchangeAssetSplitter(rawData.cd);
      const redisKey = `${EXCHANGE_NAME.UPBIT}-${baseAsset}-${quoteAsset}`;

      const tickerData = {
        exchange: EXCHANGE_NAME.UPBIT,
        symbol: rawData.cd,
        currentPrice: rawData.tp,
        changeRate: formatChangeRate(rawData.scr),
        tradeVolume: rawData.atp24h,
      };

      // NOTE: 데이터 확인용 console.log
      // console.log('rawData: ', rawData);
      // console.log('tickerData: ', tickerData);
      await this.redisService.set(redisKey, JSON.stringify(tickerData));

      // 데이터가 성공적으로 파싱되면 재시도 횟수 초기화
      this.reconnectAttempts = 0;

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
