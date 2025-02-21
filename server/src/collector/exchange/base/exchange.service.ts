// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { WebSocketService } from './websocket.service';
// import { MarketDataService } from './market-data.service';

// @Injectable()
// export class ExchangeService implements OnModuleInit {
//   constructor(
//     private readonly webSocketService: WebSocketService,
//     private readonly marketDataService: MarketDataService,
//   ) {}

//   async onModuleInit() {
//     await this.marketDataService.fetchAllMarketData();
//     this.webSocketService.connectWebSocket();
//   }

//   getMarketCodes(): string[] {
//     return this.marketDataService.getMarketCodes();
//   }

//   getMarketPairs() {
//     return this.marketDataService.getMarketPairs();
//   }
// }
