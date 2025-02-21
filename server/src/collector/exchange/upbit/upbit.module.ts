import { Module } from '@nestjs/common';
import { UpbitWebSocketService } from './upbit-ws.service';
import { UpbitApiService } from './upbit-api.service';
import { UpbitService } from './upbit.service';
import { RedisService } from 'src/redis/redis.service';
@Module({
  imports: [],
  providers: [UpbitWebSocketService, UpbitApiService, UpbitService, RedisService],
  exports: [UpbitService, UpbitApiService],
})
export class UpbitModule {}
