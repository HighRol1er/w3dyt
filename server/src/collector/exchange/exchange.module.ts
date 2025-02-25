import { Module } from '@nestjs/common';
// import { UpbitWebsocketService } from './upbit/upbit-ws.service';
// import { BinanceWebsocketService } from './binance/binance-ws.service';
// import { BithumbWebsocketService } from './bithumb/bithumb-ws.service';
// import { OKXWebsocketService } from './okx/okx-ws.service';
// import { KrakenWebsocketService } from './kraken/kraken-ws.service';
// import { CoinbaseWebsocketService } from './coinbase/coinbase-ws.service';
// import { BybitWebsocketService } from './bybit/bybit-ws.service';
import { RedisService } from 'src/redis/redis.service';
import { UpbitModule } from './upbit/upbit.module';
import { BinanceModule } from './binance/binance.module';
import { BithumbModule } from './bithumb/bithumb.module';
@Module({
  imports: [UpbitModule, BithumbModule, BinanceModule],
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
    BinanceModule,
    BithumbModule,
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
