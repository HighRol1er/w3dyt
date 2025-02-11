import { Module } from '@nestjs/common';
import { UpbitController } from './upbit/upbit.controller';
import { UpbitService } from './upbit/upbit.service';
import { BinanceController } from './binance/binance.controller';
import { BinanceService } from './binance/binance.service';
import { BithumbController } from './bithumb/bithumb.controller';
import { BithumbService } from './bithumb/bithumb.service';
import { OKXController } from './okx/okx.controller';
import { OKXService } from './okx/okx.service';
import { BybitController } from './bybit/bybit.controller';
import { BybitService } from './bybit/bybit.service';
import { CoinbaseController } from './coinbase/coinbase.controller';
import { CoinbaseService } from './coinbase/coinbase.service';

@Module({
  controllers: [
    UpbitController,
    BinanceController,
    BithumbController,
    OKXController,
    BybitController,
    CoinbaseController,
  ],
  providers: [
    UpbitService,
    BinanceService,
    BithumbService,
    OKXService,
    BybitService,
    CoinbaseService,
  ],
  exports: [
    UpbitService,
    BinanceService,
    BithumbService,
    OKXService,
    BybitService,
    CoinbaseService,
  ],
})
export class ExchangeModule {}
