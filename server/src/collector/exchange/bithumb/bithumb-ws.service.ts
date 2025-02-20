import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, API_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { bithumbMarketData } from 'scripts/market/bithumb-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import { formatChangeRate } from 'src/utils/number.util';
import {
  BithumbSubscribeMessageType,
  ParseMessageTickerDataType,
  BithumbRawDataType,
} from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class BithumbWebsocketService extends BaseWebsocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.BITHUMB;
  protected readonly apiEndpoint = API_ENDPOINTS.BITHUMB;

  constructor(redisService: RedisService) {
    super('Bithumb', redisService);
  }

  protected getSubscribeMessage(): BithumbSubscribeMessageType {
    return [
      { ticket: 'test' },
      {
        type: 'ticker',
        codes: bithumbMarketData.map(market => market.symbol),
      },
      { format: 'SIMPLE' },
    ];
  }

  protected parseMessageData(data: Buffer): ParseMessageTickerDataType {
    const rawData: BithumbRawDataType = JSON.parse(data.toString());

    const tickerData: ParseMessageTickerDataType = {
      exchange: EXCHANGE_NAME.BITHUMB,
      symbol: rawData.cd,
      currentPrice: rawData.tp, // number
      changeRate: formatChangeRate(rawData.scr),
      tradeVolume: rawData.atv24h, // number
    };

    // NOTE: 데이터 확인용 console.log
    // console.log('rawData: ', rawData);
    // console.log('formattedData: ', formattedData);

    return tickerData;
  }
}
