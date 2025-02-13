import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { z } from 'zod';
import { UpbitWebSocketMessage, UpbitTickerCache } from './types';

@Injectable()
export class UpbitWebsocketService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UpbitWebsocketService.name);
  private ws: WebSocket;
  private readonly UPBIT_WS_URL = 'wss://api.upbit.com/websocket/v1';
  private isConnected = false;
  private latestPrices: UpbitTickerCache = {};
  
  private readonly SUBSCRIBE_CODES = [
    'KRW-BTC',
    // 'KRW-ETH',
    // 'KRW-XRP',
    // 'KRW-SOL',
    // 'KRW-ADA',
  ] as const;

  constructor() {
    this.initializeWebSocket();
  }

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  private initializeWebSocket() {
    this.ws = new WebSocket(this.UPBIT_WS_URL);

    this.ws.on('open', () => {
      this.isConnected = true;
      this.logger.log('Upbit WebSocket Connected');
      this.subscribe();
    });

    this.ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as UpbitWebSocketMessage;
        this.handleMessage(message);
      } catch (error) {
        this.logger.error('Error parsing message:', error);
      }
    });

    this.ws.on('close', () => {
      this.isConnected = false;
      this.logger.warn('Upbit WebSocket Disconnected');
      setTimeout(() => this.connect(), 1000);
    });

    this.ws.on('error', (error) => {
      this.logger.error('WebSocket Error:', error);
    });
  }

  private connect() {
    if (!this.isConnected) {
      this.initializeWebSocket();
    }
  }

  private disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  private subscribe() {
    const subscribeMessage = [
      {
        ticket: `UPBIT_TICKER_${Date.now()}`,
      },
      {
        type: 'ticker',
        codes: this.SUBSCRIBE_CODES,
        isOnlyRealtime: true,
      },
    ];

    this.ws.send(JSON.stringify(subscribeMessage));
  }

  private async handleMessage(message: UpbitWebSocketMessage) {
    if (message.type === 'ticker') {
      try {
        const tickerData = {
          symbol: message.code,
          price: message.trade_price,
          changeRate: (message.change_rate * 100).toFixed(2) + '%',
          volume24h: message.acc_trade_volume_24h,
          timestamp: new Date().toISOString(),
        };

        // 캐시 업데이트
        this.latestPrices[tickerData.symbol] = tickerData;
        
        this.logger.debug(`Updated ${tickerData.symbol} price: ${tickerData.price}`);
      } catch (error) {
        this.logger.error('Error handling ticker data:', error);
      }
    }
  }

  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  public getLatestPrices() {
    return this.latestPrices;
  }

  public getLatestPrice(symbol: string) {
    return this.latestPrices[symbol];
  }
}
