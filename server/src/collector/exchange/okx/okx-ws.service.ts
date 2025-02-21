import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, API_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { okxMarketData } from 'scripts/market/okx-market-data';
import { BaseWebsocketService } from '../base/z-legacy-base-ws.service';
import {
  OKXSubscribeMessageType,
  ParseMessageTickerDataType,
  OKXRawDataType,
  OKXSubscribeResponse,
} from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class OKXWebsocketService extends BaseWebsocketService {
  protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.OKX;
  protected readonly apiEndpoint = API_ENDPOINTS.OKX;

  constructor(redisService: RedisService) {
    super('OKX', redisService);
  }

  protected getSubscribeMessage(): OKXSubscribeMessageType {
    return {
      op: 'subscribe',
      args: okxMarketData.map(market => ({
        channel: 'tickers',
        instId: market.symbol,
      })),
    };
  }

  protected parseMessageData(data: Buffer): ParseMessageTickerDataType {
    const rawData: OKXRawDataType | OKXSubscribeResponse = JSON.parse(data.toString());
    // console.log('rawData: ', rawData);

    // 구독 응답 메시지 무시
    if ('event' in rawData && rawData.event === 'subscribe') {
      return null;
    }

    // 실제 데이터 처리
    if ('data' in rawData && rawData.data.length > 0) {
      const tickerData: ParseMessageTickerDataType = {
        exchange: EXCHANGE_NAME.OKX,
        symbol: rawData.data[0].instId,
        currentPrice: rawData.data[0].last,
        // XXX : changeRate 계산 필요
        changeRate: '',
        tradeVolume: rawData.data[0].vol24h,
      };

      // NOTE: 데이터 확인용 console.log
      // console.log('rawData: ', rawData);
      // console.log('tickerData: ', tickerData);
      return tickerData;
    }

    return null;
  }
}
