import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { binanceMarketData } from 'scripts/market/binance-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import {
  BinanceRawDataType,
  BinanceSubscribeMessageType,
  ParseMessageTickerDataType,
} from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class BinanceWebsocketService extends BaseWebsocketService {
  protected readonly endpoint = WEBSOCKET_ENDPOINTS.BINANCE;

  constructor(redisService: RedisService) {
    super('Binance', redisService);
  }

  protected getSubscribeMessage(): BinanceSubscribeMessageType {
    return {
      method: 'SUBSCRIBE',
      params: binanceMarketData.map(market => `${market.symbol.toLowerCase()}@ticker`),
      id: 1,
    };
  }

  protected parseMessageData(data: Buffer): ParseMessageTickerDataType {
    const rawData: BinanceRawDataType = JSON.parse(data.toString());

    const tickerData: ParseMessageTickerDataType = {
      exchange: EXCHANGE_NAME.BINANCE,
      symbol: rawData.s,
      currentPrice: rawData.c,
      changeRate: rawData.P,
      tradeVolume: rawData.q,
    };

    // NOTE: 데이터 확인용 console.log
    // console.log('rawData: ', rawData);
    // console.log('tickerData: ', tickerData);

    return tickerData;
  }
}
