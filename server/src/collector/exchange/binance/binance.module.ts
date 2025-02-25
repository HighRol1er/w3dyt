// import { Module, OnModuleInit } from '@nestjs/common';
// import { RedisService } from 'src/redis/redis.service';
// import { BinanceHttpService } from './binance-http.service';
// import { BinanceWebsocketService } from './binance-ws.service';
// @Module({
//   providers: [BinanceHttpService, BinanceWebsocketService, RedisService],
//   exports: [BinanceHttpService, BinanceWebsocketService],
// })
// export class BinanceModule implements OnModuleInit {
//   constructor(
//     private readonly binanceHttpService: BinanceHttpService,
//     private readonly binanceWebSocketService: BinanceWebsocketService,
//   ) {}

//   async onModuleInit() {
//     await this.binanceHttpService.fetchAllMarketData();
//     await this.binanceWebSocketService.connectWebSocket();
//   }
// }
