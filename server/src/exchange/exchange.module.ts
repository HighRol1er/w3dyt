import { Module } from '@nestjs/common';
import { UpbitWebsocketService } from './upbit/upbit-ws.service';
import { BinanceWebsocketService } from './binance/binance-ws.service';
import { BithumbWebsocketService } from './bithumb/bithumb-ws.service';
import { OKXWebsocketService } from './okx/okx-ws.service';
import { KrakenWebsocketService } from './kraken/kraken-ws.service';
import { CoinbaseWebsocketService } from './coinbase/coinbase-ws.service';
import { BybitWebsocketService } from './bybit/bybit-ws.service';

@Module({
  imports: [],
  providers: [
    UpbitWebsocketService,
    BinanceWebsocketService,
    BithumbWebsocketService,
    OKXWebsocketService,
    KrakenWebsocketService,
    CoinbaseWebsocketService,
    BybitWebsocketService,
  ],
  exports: [
    UpbitWebsocketService,
    BinanceWebsocketService,
    BithumbWebsocketService,
    OKXWebsocketService,
    KrakenWebsocketService,
    CoinbaseWebsocketService,
    BybitWebsocketService,
  ],
})
export class ExchangeModule {}
