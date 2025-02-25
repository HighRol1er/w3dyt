import { Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { BithumbHttpService } from './bithumb-http.service';
import { BithumbWebSocketService } from './bithumb-ws.service';
@Module({
  providers: [BithumbHttpService, BithumbWebSocketService, RedisService],
  exports: [BithumbHttpService, BithumbWebSocketService],
})
export class BithumbModule implements OnModuleInit {
  constructor(
    private readonly bithumbHttpService: BithumbHttpService,
    private readonly bithumbWebSocketService: BithumbWebSocketService,
  ) {}

  async onModuleInit() {
    await this.bithumbHttpService.fetchAllMarketData();
    await this.bithumbWebSocketService.connectWebSocket();
  }
}
