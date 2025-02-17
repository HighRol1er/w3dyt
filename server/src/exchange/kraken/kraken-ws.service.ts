import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_ENDPOINTS, WEBSOCKET_CONFIG } from 'src/common/constants';
import { krakenMarketData } from 'scripts/market/kraken-market-data';

@Injectable()
export class KrakenWebsocketService implements OnModuleInit {
  private ws: WebSocket;
  private clients: Set<WebSocket> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  private reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;

  private readonly logger = new Logger(KrakenWebsocketService.name);

  onModuleInit() {
    this.connect();
  }

  async connect() {
    this.ws = new WebSocket(WEBSOCKET_ENDPOINTS.KRAKEN);

    this.ws.on('open', () => {
      this.logger.log('Kraken WebSocket Connected');
      const subscribeMessage = JSON.stringify({
        event: 'subscribe',
        pair: krakenMarketData.map(market => market.wsname),
        subscription: {
          name: 'ticker',
        },
      });
      this.ws.send(subscribeMessage);
    });

    this.ws.on('message', (data: Buffer) => {
      const rawData = JSON.parse(data.toString());
      if (Array.isArray(rawData) && rawData[2] === 'ticker') {
        const filteredData = {
          exchange: 'KRAKEN',
          symbol: rawData[3],
          price: parseFloat(rawData[1].c[0]),
          changeRate:
            ((parseFloat(rawData[1].c[0]) / parseFloat(rawData[1].o) - 1) * 100).toFixed(2) + '%',
          volume24h: parseFloat(rawData[1].v[1]),
        };

        this.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(filteredData));
          }
        });
      }
    });

    this.ws.on('close', () => {
      this.logger.warn('Disconnected from Kraken WebSocket');
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
