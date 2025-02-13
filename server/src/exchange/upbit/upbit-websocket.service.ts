import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS } from 'src/common/constants';

@Injectable()
export class UpbitWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();

  onModuleInit() {
    this.connect();
  }

  async connect() {
    this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.UPBIT);

    this.ws.on('open', () => {
      console.log('Upbit WebSocket Connected');
      const subscribeMessage = JSON.stringify([
        { ticket: 'test' },
        {
          type: 'ticker',
          codes: ['KRW-BTC'],
          isOnlyRealtime: true,
        },
      ]);
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      // 연결된 모든 클라이언트에게 데이터 전송

      // NOTE:데이터 확인용 console.log
      // console.log('Received data:', JSON.parse(data.toString()));

      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });
    this.ws.on('close', () => {
      console.log('Disconnected from Upbit WebSocket');
      // 재연결 시도
      // XXX : 재연결을 몇번까지 할건지도 정해줘야 될꺼같음
      setTimeout(() => this.connect(), 1000);
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
