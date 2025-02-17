import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
import { coinbaseMarketData } from 'scripts/market/coinbase-market-data';

@Injectable()
export class CoinbaseWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

  private readonly logger = new Logger(CoinbaseWebsocketService.name);

  onModuleInit() {
    this.connect();
  }

  async connect() {
    this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.COINBASE);

    this.ws.on('open', () => {
      this.logger.log('Coinbase WebSocket Connected');
      const subscribeMessage = JSON.stringify({
        type: 'subscribe',
        product_ids: coinbaseMarketData.map(market => market.symbol),
        channels: ['ticker'],
      });
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      const rawData = JSON.parse(data.toString());
      if (rawData.type === 'ticker') {
        const filteredData = {
          exchange: 'COINBASE',
          symbol: rawData.product_id,
          price: parseFloat(rawData.price),
          changeRate:
            ((parseFloat(rawData.price) / parseFloat(rawData.open_24h) - 1) * 100).toFixed(2) + '%',
          volume24h: parseFloat(rawData.volume_24h),
        };

        this.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(filteredData));
          }
        });
      }
    });

    this.ws.on('close', () => {
      this.logger.warn('Disconnected from Coinbase WebSocket');
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
