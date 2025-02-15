import { Module } from '@nestjs/common';
import { UpbitWebsocketService } from './upbit/upbit-websocket.service';
import { BinanceWebsocketService } from './binance/binance-websocket.service';
import { BithumbWebsocketService } from './bithumb/bithumb-websocket.service';

@Module({
  imports: [],
  providers: [UpbitWebsocketService, BinanceWebsocketService, BithumbWebsocketService],
  exports: [UpbitWebsocketService, BinanceWebsocketService, BithumbWebsocketService],
})
export class ExchangeModule {}
