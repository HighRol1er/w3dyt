import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectorController } from './collector.controller';
import { CollectorService } from './collector.service';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ExchangeModule,
  ],
  controllers: [CollectorController],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
