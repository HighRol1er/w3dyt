import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
import { bithumbMarketData } from 'scripts/market/bithumb-market-data';

@Injectable()
export class BithumbWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();

  // 재연결 관련
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

  onModuleInit() {
    this.connect();
  }

  async connect() {
    this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.BITHUMB);

    this.ws.on('open', () => {
      console.log('Bithumb WebSocket Connected');
      const subscribeMessage = JSON.stringify({
        type: 'ticker',
        symbols: bithumbMarketData.map(market => market.symbol),
        tickTypes: ['30M'],
        format: 'SIMPLE',
      });
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      // 연결된 모든 클라이언트에게 데이터 전송

      // NOTE: 데이터 확인용 console.log
      // console.log('Received data:', JSON.parse(data.toString()));

      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });

    this.ws.on('close', () => {
      console.log('Disconnected from Bithumb WebSocket');

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(
          `Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`,
        );
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectDelay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    });

    this.ws.on('error', error => {
      console.error('WebSocket error:', error);
    });
  }

  // 클라이언트 연결 관리
  handleConnection(client: WebSocket) {
    this.clients.add(client);
    console.log('Client connected');

    client.on('close', () => {
      this.clients.delete(client);
      console.log('Client disconnected');
    });
  }
}
