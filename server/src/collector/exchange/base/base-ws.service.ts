import { OnModuleInit, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WEBSOCKET_CONFIG } from 'src/common/constants';
import { SubscribeMessageType, ParseMessageTickerDataType } from 'src/types/exchange-ws';
import { RedisService } from 'src/redis/redis.service';
import axios from 'axios';

export interface TickerPair {
  baseAsset: string; // 실제 거래되는 토큰 (BTC, ETH, XRP, DOGE, SOL, ADA, APE, 등)
  quoteAsset: string; // 가격의 기준이 되는 토큰 (KRW, USDT, USDC, BTC 등)
}

export function createTickerKey(exchange: string, baseAsset: string, quoteAsset: string): string {
  return `${exchange}-${baseAsset}-${quoteAsset}`;
}

export abstract class BaseWebsocketService implements OnModuleInit {
  protected ws: WebSocket;
  protected clients: Set<WebSocket> = new Set();
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS;
  protected reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY;
  protected readonly logger: Logger;
  protected abstract readonly wsEndpoint: string;
  protected abstract readonly apiEndpoint: string;

  constructor(
    protected readonly exchangeName: string,
    protected readonly redisService: RedisService,
  ) {
    this.logger = new Logger(`${exchangeName}WebsocketService`);
  }

  async onModuleInit() {
    await this.websocketConnect();
  }

  protected abstract getSubscribeMessage(): SubscribeMessageType;
  protected abstract parseMessageData(data: Buffer): ParseMessageTickerDataType;

  // NOTE: TEST CODE
  // protected abstract getSubscribeMessage(): any;
  // protected abstract parseMessageData(data: Buffer): any;

  /************************
   *  WebSocket 커넥션 관련  *
   *************************/

  protected async websocketConnect() {
    this.ws = new WebSocket(this.wsEndpoint);

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
        this.websocketConnect();
      }, this.reconnectDelay);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
  }

  /********************
   *   API 커넥션 관련   *
   ********************/

  protected marketTickers: string[] = [];
  protected marketPairs: TickerPair[] = [];

  abstract fetchAllMarketData(): Promise<any>;
  abstract parseMarketData(market: string): TickerPair;

  getMarketCodes(): string[] {
    return this.marketTickers;
  }

  getMarketPairs(): TickerPair[] {
    return this.marketPairs;
  }

  // Redis 키 형식으로 변환된 마켓 코드 가져오기
  getRedisKeys(): string[] {
    return this.marketPairs.map(({ baseAsset, quoteAsset }) =>
      createTickerKey(this.exchangeName, baseAsset, quoteAsset),
    );
  }
}

// async onModuleInit() {
//   await this.initializeMarkets();
//   await this.connect();
// }

// protected abstract fetchMarketData(): Promise<any>;

// protected async initializeMarkets() {
//   try {
//     const marketData = await this.fetchMarketData();
//     const marketsToInsert = marketData.map(market => ({
//       symbol: market.market,
//       exchange: this.exchangeName,
//       kor_name: market.korean_name,
//       eng_name: market.english_name,
//       base_asset: market.market.split('-')[1],
//       quote_asset: market.market.split('-')[0],
//       is_active: true,
//     }));

//     // Zod로 데이터 검증
//     const validatedMarkets = marketsToInsert.map(market =>
//       insertMarketSchema.parse(market)
//     );

//     await this.redisService.db
//       .insert(markets)
//       .values(validatedMarkets)
//       .onConflictDoUpdate({
//         target: markets.symbol,
//         set: {
//           kor_name: this.redisService.db.sql`EXCLUDED.kor_name`,
//           eng_name: this.redisService.db.sql`EXCLUDED.eng_name`,
//           base_asset: this.redisService.db.sql`EXCLUDED.base_asset`,
//           quote_asset: this.redisService.db.sql`EXCLUDED.quote_asset`,
//           updated_at: this.redisService.db.sql`CURRENT_TIMESTAMP`,
//         },
//       });

//     this.markets = validatedMarkets;
//     this.logger.log(`Successfully initialized ${validatedMarkets.length} markets for ${this.exchangeName}`);
//   } catch (error) {
//     this.logger.error(`Error initializing markets for ${this.exchangeName}:`, error);
//     throw error;
//   }
// }
