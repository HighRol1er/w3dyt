import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ExchangeModule } from './exchange/exchange.module';
import { ExchangeGateway } from './gateway/exchange.gateway';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    // DatabaseModule,
    ExchangeModule,
  ],
  providers: [ExchangeGateway],
})
export class AppModule {}
