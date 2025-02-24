// import { Module } from '@nestjs/common';
// import { RedisService } from 'src/redis/redis.service';
// import { UpbitHttpService } from './upbit-http.service';
// import { UpbitWebSocketService } from './upbit-ws.service';
// import { UpbitService } from './upbit-manager.service';
// @Module({
//   imports: [],
//   providers: [UpbitWebSocketService, UpbitHttpService, UpbitService, RedisService],
//   exports: [UpbitService, UpbitHttpService],
// })
// export class UpbitModule {}
import { Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { UpbitHttpService } from './upbit-http.service';
import { UpbitWebSocketService } from './upbit-ws.service';

@Module({
  providers: [UpbitHttpService, UpbitWebSocketService, RedisService],
  exports: [UpbitHttpService, UpbitWebSocketService],
})
export class UpbitModule implements OnModuleInit {
  constructor(
    private readonly upbitHttpService: UpbitHttpService,
    private readonly upbitWebSocketService: UpbitWebSocketService,
  ) {}

  async onModuleInit() {
    await this.upbitHttpService.fetchAllMarketData();
    await this.upbitWebSocketService.connectWebSocket();
  }
}
