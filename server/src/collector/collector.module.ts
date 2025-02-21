import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeModule } from './exchange/exchange.module';
import { ForexModule } from './forex/forex.module';
import { CollectorService } from './collector.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, ExchangeModule, ForexModule],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
