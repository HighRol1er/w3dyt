import { Module } from '@nestjs/common';
// import { UpbitWebsocketService } from './upbit/upbit-ws.service';
// import { BinanceWebsocketService } from './binance/binance-ws.service';
// import { BithumbWebsocketService } from './bithumb/bithumb-ws.service';
// import { OKXWebsocketService } from './okx/okx-ws.service';
// import { KrakenWebsocketService } from './kraken/kraken-ws.service';
// import { CoinbaseWebsocketService } from './coinbase/coinbase-ws.service';
// import { BybitWebsocketService } from './bybit/bybit-ws.service';
import { RedisService } from 'src/redis/redis.service';
// import { UpbitService } from './upbit/upbit.service';
import { UpbitModule } from './upbit/upbit.module';
@Module({
  imports: [UpbitModule],
  providers: [
    RedisService,

    // UpbitWebsocketService,
    // UpbitService,
    // BinanceWebsocketService,
    // BithumbWebsocketService,
    // OKXWebsocketService,
    // KrakenWebsocketService,
    // CoinbaseWebsocketService,
    // BybitWebsocketService,
  ],
  exports: [
    RedisService,
    UpbitModule,
    // UpbitService,
    // // UpbitWebsocketService,
    // BinanceWebsocketService,
    // BithumbWebsocketService,
    // OKXWebsocketService,
    // KrakenWebsocketService,
    // CoinbaseWebsocketService,
    // // BybitWebsocketService,
  ],
})
export class ExchangeModule {}
