import { Module } from '@nestjs/common';
import { UpbitWebsocketService } from './exchange/upbit/upbit-websocket.service';
import { UpbitWebsocketController } from './exchange/upbit/upbit-websocket.controller';

@Module({
  imports: [], 
  controllers: [UpbitWebsocketController],
  providers: [UpbitWebsocketService],
  exports: [UpbitWebsocketService],
})
export class SocketModule {}
