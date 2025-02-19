import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';
import { ForexModule } from './forex/forex.module';

@Module({
  imports: [ExchangeModule, ForexModule],
  providers: [],
  exports: [],
})
export class CollectorModule {}
