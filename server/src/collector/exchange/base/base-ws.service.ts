import { OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_CONFIG } from 'src/common/constants';
import { SubscribeMessageType, ParseMessageTickerDataType } from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';
export abstract class BaseWebsocketService implements OnModuleInit {
  protected ws: WebSocket;
  protected clients: Set<WebSocket> = new Set();
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  protected reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;
  protected readonly logger: Logger;
  protected abstract readonly endpoint: string;

  constructor(
    protected readonly exchangeName: string,
    protected readonly redisService: RedisService,
  ) {
    this.logger = new Logger(`${exchangeName}WebsocketService`);
  }

  async onModuleInit() {
    await this.connect();
  }

  protected abstract getSubscribeMessage(): SubscribeMessageType;
  protected abstract parseMessageData(data: Buffer): ParseMessageTickerDataType;
  // NOTE: TEST CODE
  // protected abstract getSubscribeMessage(): any;
  // protected abstract parseMessageData(data: Buffer): any;

  protected async connect() {
    this.ws = new WebSocket(this.endpoint);

    this.ws.on('open', () => {
      this.logger.log(`${this.exchangeName} WebSocket Connected`);
      const subscribeMessage = this.getSubscribeMessage();
      this.ws.send(JSON.stringify(subscribeMessage));
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

  handleConnection(client: WebSocket) {
    this.clients.add(client);
    this.logger.log(`${this.exchangeName} Client connected`);

    client.on('close', () => {
      this.clients.delete(client);
      this.logger.log(`${this.exchangeName} Client disconnected`);
    });
  }

  protected handleReconnect() {
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
  }
}
