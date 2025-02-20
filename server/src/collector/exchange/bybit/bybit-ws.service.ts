/**
 *
 * Bybit은 추후에 구현 예정
 * 그 10개밖에 처리 못해서 이거 chunk로 나눠서 보낼 때 구현할 거임
 */

// import { Injectable } from '@nestjs/common';
// import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
// import { bybitMarketData } from 'scripts/market/bybit-market-data';
// import { BaseWebsocketService } from '../base/base-ws.service';
// import { formatChangeRate } from 'src/common/utils/number.util';
// import {
//   BybitSubscribeMessageType,
//   ParseMessageDataType,
//   BybitRawDataType,
// } from 'src/types/exchange-ws';

// @Injectable()
// export class BybitWebsocketService extends BaseWebsocketService {
//   protected readonly endpoint = WEBSOCKET_ENDPOINTS.BYBIT;

//   constructor() {
//     super('Bybit');
//   }

//   protected getSubscribeMessage(): any {
//     return {
//       op: 'subscribe',
//       args: ['spot/ticker.btcusdt'], // 단일 심볼로 테스트
//     };
//   }

//   protected parseMessageData(data: Buffer): any {
//     const rawData = JSON.parse(data.toString());
//     // console.log('rawData: ', rawData);

//     // 임시로 null 반환하여 formattedData 처리 건너뛰기

//     /* 기존 코드는 주석 처리
//     const formattedData: ParseMessageDataType = {
//       exchange: EXCHANGE_NAME.BYBIT,
//       symbol: rawData.data.symbol,
//       currentPrice: parseFloat(rawData.data.lastPrice),
//       changeRate: formatChangeRate(parseFloat(rawData.data.price24hPcnt)),
//       tradeVolume: parseFloat(rawData.data.volume24h),
//     };

//     return formattedData;
//     */
//   }
// }
