import { Injectable } from '@nestjs/common';
import { BaseWebSocketService } from '../base/base-ws.service';
import { EXCHANGE_NAME, WEBSOCKET_ENDPOINTS } from 'src/common/constants';
import { BithumbHttpService } from './bithumb-http.service';
import { RedisService } from 'src/redis/redis.service';
import {
  BithumbRawDataType,
  BithumbSubscribeMessageType,
  ParseMessageTickerDataType,
} from 'src/types/exchange-ws';
import { krExchangeAssetSplitter } from 'src/utils/asset-splitter.util';
import { formatChangeRate } from 'src/utils/number.util';
@Injectable()
export class BithumbWebSocketService extends BaseWebSocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.BITHUMB;

  constructor(
    private readonly bithumbHttpService: BithumbHttpService,
    private readonly redisService: RedisService,
  ) {
    super('Bithumb');
  }

  protected async subscribe(): Promise<void> {
    const symbols = this.bithumbHttpService.getSymbolList();
    const subscribeMessage: BithumbSubscribeMessageType = [
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
      const rawData: BithumbRawDataType = JSON.parse(data.toString());
      const { baseAsset, quoteAsset } = krExchangeAssetSplitter(rawData.cd);
      const redisKey = `${EXCHANGE_NAME.BITHUMB}-${baseAsset}-${quoteAsset}`;

      const tickerData = {
        exchange: EXCHANGE_NAME.BITHUMB,
        symbol: rawData.cd,
        currentPrice: rawData.tp,
        changeRate: formatChangeRate(rawData.scr),
        tradeVolume: rawData.atp24h,
      };

      // NOTE: 데이터 확인용 console.log
      // console.log('rawData: ', rawData);
      // console.log('tickerData: ', tickerData);
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
