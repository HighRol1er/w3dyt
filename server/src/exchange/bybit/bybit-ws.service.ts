// import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
// import { WebSocket } from 'ws';
// import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
// import { bybitMarketData } from 'scripts/market/bybit-market-data';

// @Injectable()
// export class BybitWebsocketService implements OnModuleInit {
//   private ws: WebSocket;
//   private clients: Set<WebSocket> = new Set();
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
//   private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

//   private readonly logger = new Logger(BybitWebsocketService.name);

//   onModuleInit() {
//     this.connect();
//   }

//   async connect() {
//     this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.BYBIT);

//     this.ws.on('open', () => {
//       this.logger.log('Bybit WebSocket Connected');

//       const subscribeMessage = JSON.stringify({
//         op: 'subscribe',
//         args: bybitMarketData.map(market => `option/ticker.${market.symbol}`),
//       });
//       this.ws.send(subscribeMessage);
//     });

//     this.ws.on('message', (data: Buffer) => {
//       const rawData = JSON.parse(data.toString());
//       console.log('rawData: ', rawData);
//       if (rawData.topic && rawData.topic.startsWith('option/ticker.')) {
//         const filteredData = {
//           exchange: 'BYBIT',
//           symbol: rawData.data.symbol,
//           price: parseFloat(rawData.data.lastPrice),
//           changeRate: parseFloat(rawData.data.price24hPcnt).toFixed(2) + '%',
//           volume24h: parseFloat(rawData.data.volume24h),
//         };

//         this.clients.forEach(client => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(filteredData));
//           }
//         });
//       }
//     });

//     this.ws.on('close', () => {
//       this.logger.warn('Disconnected from Bybit WebSocket');
//       if (this.reconnectAttempts < this.maxReconnectAttempts) {
//         this.logger.log(
//           `Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`,
//         );
//         setTimeout(() => {
//           this.reconnectAttempts++;
//           this.connect();
//         }, this.reconnectDelay);
//       } else {
//         this.logger.error('Max reconnection attempts reached');
//       }
//     });

//     this.ws.on('error', error => {
//       this.logger.error('WebSocket error:', error);
//     });
//   }

//   handleConnection(client: WebSocket) {
//     this.clients.add(client);
//     this.logger.log('Client connected');

//     client.on('close', () => {
//       this.clients.delete(client);
//       this.logger.log('Client disconnected');
//     });
//   }
// }
import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { bybitMarketData } from 'scripts/market/bybit-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import { formatChangeRate } from 'src/common/utils/number.util';
import {
  BybitSubscribeMessageType,
  ParseMessageDataType,
  BybitRawDataType,
} from 'src/types/websocket';

@Injectable()
export class BybitWebsocketService extends BaseWebsocketService {
  protected readonly endpoint = WEBSOCKET_ENDPOINTS.BYBIT;

  constructor() {
    super('Bybit');
  }

  protected getSubscribeMessage(): any {
    return {
      op: 'subscribe',
      args: ['spot/ticker.btcusdt'], // 단일 심볼로 테스트
    };
  }

  protected parseMessageData(data: Buffer): any {
    const rawData = JSON.parse(data.toString());
    // console.log('rawData: ', rawData);

    // 임시로 null 반환하여 formattedData 처리 건너뛰기

    /* 기존 코드는 주석 처리
    const formattedData: ParseMessageDataType = {
      exchange: EXCHANGE_NAME.BYBIT,
      symbol: rawData.data.symbol,
      currentPrice: parseFloat(rawData.data.lastPrice),
      changeRate: formatChangeRate(parseFloat(rawData.data.price24hPcnt)),
      tradeVolume: parseFloat(rawData.data.volume24h),
    };

    return formattedData;
    */
  }
}
