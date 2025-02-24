import { Module } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { UpbitHttpService } from './upbit-http.service';
import { UpbitWebSocketService } from './upbit-ws.service';
import { UpbitService } from './upbit-manager.service';
@Module({
  imports: [],
  providers: [UpbitWebSocketService, UpbitHttpService, UpbitService, RedisService],
  exports: [UpbitService, UpbitHttpService],
})
export class UpbitModule {}
