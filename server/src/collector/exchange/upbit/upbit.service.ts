import { Injectable, OnModuleInit } from '@nestjs/common';
// import { WebSocketService } from '../base/sample-base-ws.service';
import { UpbitWebSocketService } from './upbit-ws.service';
// import { MarketDataService } from '../base/base-api.service';

@Injectable()
export class UpbitService implements OnModuleInit {
  constructor(
    private readonly webSocketService: UpbitWebSocketService,
    // private readonly marketDataService: MarketDataService,
  ) {}

  async onModuleInit() {
    // await this.marketDataService.fetchAllMarketData();
    this.webSocketService.connectWebSocket();
  }

  // getMarketCodes(): string[] {
  //   return this.marketDataService.getMarketCodes();
  // }

  // getMarketPairs() {
  //   return this.marketDataService.getMarketPairs();
  // }
}
