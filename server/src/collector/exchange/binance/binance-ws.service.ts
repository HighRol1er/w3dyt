// import { Injectable } from '@nestjs/common';
// import { WEBSOCKET_ENDPOINTS, API_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
// import { BaseWebSocketService } from '../base/base-ws.service';

// import {
//   BinanceRawDataType,
//   BinanceSubscribeMessageType,
//   ParseMessageTickerDataType,
// } from 'src/types/exchange-ws';
// import { RedisService } from 'src/redis/redis.service';
// import { BinanceHttpService } from './binance-http.service';

// @Injectable()
// export class BinanceWebsocketService extends BaseWebSocketService {
//   protected readonly wsEndpoint = WEBSOCKET_ENDPOINTS.BINANCE;

//   constructor(
//     private readonly binanceHttpService: BinanceHttpService,
//     private readonly redisService: RedisService,
//   ) {
//     super('Binance');
//   }

//   protected async subscribe(): Promise<void> {
//     const message = this.getSubscribeMessage();
//     this.ws.send(JSON.stringify(message));
//   }

//   protected getSubscribeMessage(): BinanceSubscribeMessageType {
//     const tickers = this.binanceHttpService.getSymbolList();

//     return {
//       method: 'SUBSCRIBE',
//       params: tickers.map(ticker => `${ticker.toLowerCase()}@ticker`),
//       id: 1,
//     };
//   }

//   protected async parseMessageData(data: Buffer): Promise<ParseMessageTickerDataType | null> {
//     try {
//       const rawData = JSON.parse(data.toString());

//       // 구독 확인 메시지는 건너뛰기
//       if (rawData.result === null && rawData.id === 1) {
//         return null;
//       }

//       // 실제 ticker 데이터만 처리
//       if (!rawData.s) {
//         // symbol이 없으면 건너뛰기
//         return null;
//       }

//       const { baseAsset, quoteAsset } = this.binanceHttpService.parseTradingPair(rawData.s);
//       const redisKey = `${EXCHANGE_NAME.BINANCE}-${baseAsset}-${quoteAsset}`;

//       const tickerData: ParseMessageTickerDataType = {
//         exchange: EXCHANGE_NAME.BINANCE,
//         symbol: rawData.s,
//         currentPrice: rawData.c,
//         changeRate: rawData.P,
//         tradeVolume: rawData.q,
//       };

//       // NOTE: 데이터 확인용 console.log
//       // console.log('rawData: ', rawData);
//       // console.log('tickerData: ', tickerData);
//       await this.redisService.set(redisKey, JSON.stringify(tickerData));
//       return tickerData;
//     } catch (error) {
//       this.logger.error(`Error parsing message data: ${error.message}`, {
//         data,
//         error,
//       });

//       return null;
//     }
//   }
// }
