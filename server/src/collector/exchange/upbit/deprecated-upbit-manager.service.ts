// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { AssetPair } from '../base/base-http.service';
// import { UpbitHttpService } from './upbit-http.service';
// import { UpbitWebSocketService } from './upbit-ws.service';

// @Injectable()
// export class UpbitService implements OnModuleInit {
//   constructor(
//     private readonly upbitWebSocketService: UpbitWebSocketService,
//     private readonly upbitHttpService: UpbitHttpService,
//   ) {}

//   async onModuleInit() {
//     await this.upbitHttpService.fetchAllMarketData();
//     await this.upbitWebSocketService.connectWebSocket();
//   }

//   fetchTickerList(): string[] {
//     return this.upbitHttpService.fetchTickerList();
//   }

//   fetchAssetPairs(): AssetPair[] {
//     return this.upbitHttpService.fetchAssetPairs();
//   }
// }
