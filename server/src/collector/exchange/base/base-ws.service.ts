import { Logger } from '@nestjs/common';
import { WEBSOCKET_CONFIG } from 'src/common/constants';
import { ParseMessageTickerDataType } from 'src/types/exchange-ws';
import { WebSocket } from 'ws';

export abstract class BaseWebSocketService {
  protected ws: WebSocket;
  protected clients: Set<WebSocket> = new Set();
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  protected reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;
  protected readonly logger: Logger;
  protected abstract readonly wsEndpoint: string;

  constructor(protected readonly exchangeName: string) {
    this.logger = new Logger(`${exchangeName}WebSocketService`);
  }

  protected abstract subscribe(): Promise<void>;
  protected abstract parseMessageData(data: Buffer): Promise<ParseMessageTickerDataType | null>;
  // NOTE: TEST CODE
  // protected abstract getSubscribeMessage(): any;
  // protected abstract parseMessageData(data: Buffer): any;

  async connectWebSocket() {
    this.ws = new WebSocket(this.wsEndpoint);

    this.ws.on('open', () => {
      this.logger.log(`${this.exchangeName} WebSocket Connected`);
      this.subscribe();
    });

    this.ws.on('message', (data: Buffer) => {
      const tickerData = this.parseMessageData(data);
      if (tickerData) {
        this.broadcastToClients(tickerData);
      }
    });

    this.ws.on('close', () => {
      this.logger.warn(`Disconnected from ${this.exchangeName} WebSocket`);
      this.handleReconnect();
    });

    this.ws.on('error', error => {
      this.logger.error('WebSocket error:', error);
      this.handleReconnect();
    });
  }

  protected broadcastToClients(data: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Client 연결 로직 (FE 부착할 때 쓸꺼)
  handleClientConnection(client: WebSocket) {
    this.clients.add(client);
    this.logger.log(`${this.exchangeName} Client connected`);

    client.on('close', () => {
      this.clients.delete(client);
      this.logger.log(`${this.exchangeName} Client disconnected`);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.logger.log(
        `Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`,
      );
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connectWebSocket();
      }, this.reconnectDelay);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
  }

  protected async resubscribe(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    await this.connectWebSocket();
  }

  public async refreshSubscription(): Promise<void> {
    this.logger.log(`Refreshing ${this.exchangeName} WebSocket subscription...`);
    await this.resubscribe();
  }
}
