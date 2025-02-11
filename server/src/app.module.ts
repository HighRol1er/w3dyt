import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from './exchange/exchange.module';
import { CollectorModule } from './collector/collector.module';

@Module({
  imports: [ExchangeModule, CollectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
