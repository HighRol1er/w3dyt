import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
import { upbitMarketData } from 'scripts/market/upbit-market-data';

// 이게 지금 업비트에서만 쓰이는데
// 바이낸스랑 빗썸도 각 코드에 맞춰서 타입 재사용 가능하게 해줘야함
interface CoinInfo {
  cd: string;
  tp: number;
  scr: number;
  atp24h: number;
}

@Injectable()
export class UpbitWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();
  // 재연결 관련
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

  private readonly logger = new Logger(UpbitWebsocketService.name); // 로거

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
          codes: upbitMarketData.map(market => market.market),
          is_only_snapshot: true,
          is_only_realtime: true,
        },
        { format: 'SIMPLE' },
      ]);
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      const rawData = JSON.parse(data.toString());

      const filteredData = {
        exchange: 'UPBIT',
        symbol: rawData.cd,
        price: rawData.tp,
        changeRate: rawData.scr.toFixed(2) + '%',
        volume24h: rawData.atp24h,
      };

      // NOTE: 데이터 확인용 console.log
      // console.log('Filtered data:', filteredData);

      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(filteredData));
        }
      });
    });
    this.ws.on('close', () => {
      console.log('Disconnected from Upbit WebSocket');

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
