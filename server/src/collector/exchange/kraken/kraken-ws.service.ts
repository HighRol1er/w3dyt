import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, API_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { krakenMarketData } from 'scripts/market/kraken-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import {
  KrakenSubscribeMessageType,
  ParseMessageTickerDataType,
  KrakenRawDataType,
} from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class KrakenWebsocketService extends BaseWebsocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.KRAKEN;
  protected readonly apiEndpoint = API_ENDPOINTS.KRAKEN;

  constructor(redisService: RedisService) {
    super('Kraken', redisService);
  }

  protected getSubscribeMessage(): KrakenSubscribeMessageType {
    return {
      method: 'subscribe',
      params: {
        channel: 'ticker',
        symbol: krakenMarketData.map(market => market.wsname),
      },
    };
  }

  protected parseMessageData(data: Buffer): ParseMessageTickerDataType {
    const rawData: KrakenRawDataType = JSON.parse(data.toString());

    // 시스템 메시지나 다른 채널 메시지 무시
    if (!rawData.channel || rawData.channel !== 'ticker' || !rawData.data?.[0]) {
      return null;
    }

    const tickerData: ParseMessageTickerDataType = {
      exchange: EXCHANGE_NAME.KRAKEN,
      symbol: rawData.data[0].symbol,
      currentPrice: rawData.data[0].last,
      changeRate: rawData.data[0].change_pct, // 이미 퍼센트로 계산되어 있음
      tradeVolume: rawData.data[0].volume,
    };

    // NOTE: 데이터 확인용 콘솔 출력
    // console.log('rawData: ', rawData);
    // console.log('formattedData: ', formattedData);

    return tickerData;
  }
}
