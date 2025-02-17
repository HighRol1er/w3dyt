import { OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_CONFIG } from 'src/common/constants';

export abstract class BaseWebsocketService implements OnModuleInit {
  protected ws: WebSocket;
  protected clients: Set<WebSocket> = new Set();
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  protected reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;
  protected readonly logger: Logger;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}WebsocketService`);
  }

  onModuleInit() {
    this.connect();
  }

  protected abstract getWebSocketEndpoint(): string;
  protected abstract getSubscribeMessage(): any;
  protected abstract parseMessageData(data: Buffer): any;

  protected async connect() {
    this.ws = new WebSocket(this.getWebSocketEndpoint());

    this.ws.on('open', () => {
      this.logger.log(`${this.exchangeName} WebSocket Connected`);
      const subscribeMessage = this.getSubscribeMessage();
      this.ws.send(JSON.stringify(subscribeMessage));
    });

    this.ws.on('message', (data: Buffer) => {
      const filteredData = this.parseMessageData(data);
      if (filteredData) {
        this.broadcastToClients(filteredData);
      }
    });

    this.ws.on('close', () => {
      this.logger.warn(`Disconnected from ${this.exchangeName} WebSocket`);
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

  protected broadcastToClients(data: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
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
