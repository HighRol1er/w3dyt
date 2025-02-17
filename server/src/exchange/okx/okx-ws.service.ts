import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
import { okxMarketData } from 'scripts/market/okx-market-data';

@Injectable()
export class OKXWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

  private readonly logger = new Logger(OKXWebsocketService.name);

  onModuleInit() {
    this.connect();
  }

  async connect() {
    this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.OKX);

    this.ws.on('open', () => {
      this.logger.log('OKX WebSocket Connected');
      const subscribeMessage = JSON.stringify({
        op: 'subscribe',
        args: okxMarketData.map(market => ({
          channel: 'tickers',
          instId: market.symbol,
        })),
      });
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      const rawData = JSON.parse(data.toString());
      if (rawData.data) {
        const filteredData = {
          exchange: 'OKX',
          symbol: rawData.data[0].instId,
          price: parseFloat(rawData.data[0].last),
          changeRate: parseFloat(rawData.data[0].vol24h).toFixed(2) + '%',
          volume24h: parseFloat(rawData.data[0].vol24h),
        };

        // NOTE: 데이터 확인용 console.log
        // console.log('Filtered data:', filteredData);
        // console.log('Raw data:', rawData);

        this.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(filteredData));
          }
        });
      }
    });

    this.ws.on('close', () => {
      this.logger.warn('Disconnected from OKX WebSocket');
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.logger.log(
          `Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`,
        );
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectDelay);
      } else {
        this.logger.error('Max reconnection attempts reached');
      }
    });

    this.ws.on('error', error => {
      this.logger.error('WebSocket error:', error);
    });
  }

  handleConnection(client: WebSocket) {
    this.clients.add(client);
    this.logger.log('Client connected');

    client.on('close', () => {
      this.clients.delete(client);
      this.logger.log('Client disconnected');
    });
  }
}
