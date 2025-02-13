import { Module } from '@nestjs/common';
import { UpbitWebsocketService } from './upbit/upbit-websocket.service';
import { BinanceWebsocketService } from './binance/binance-websocket.service';

@Module({
  imports: [],
  providers: [UpbitWebsocketService, BinanceWebsocketService],
  exports: [UpbitWebsocketService, BinanceWebsocketService],
})
export class ExchangeModule {}
