import { Module } from '@nestjs/common';
import { ExchangeRate } from './exchange-rate';

@Module({
  providers: [ExchangeRate],
  exports: [ExchangeRate],
})
export class ForexModule {}
