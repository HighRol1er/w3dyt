import { Module } from '@nestjs/common';
import { UpbitWebSocketService } from './upbit-ws.service';
import { UpbitService } from './upbit.service';

@Module({
  imports: [],
  providers: [UpbitWebSocketService, UpbitService],
  exports: [UpbitService],
})
export class UpbitModule {}
