import { Module } from '@nestjs/common';
import { UpbitWebSocketService } from './upbit-ws.service';
import { UpbitApiService } from './upbit-api.service';
import { UpbitService } from './upbit.service';

@Module({
  imports: [],
  providers: [UpbitWebSocketService, UpbitApiService, UpbitService],
  exports: [UpbitService],
})
export class UpbitModule {}
