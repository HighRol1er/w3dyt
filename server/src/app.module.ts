import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    // DatabaseModule,
    ExchangeModule,
  ],
})
export class AppModule {}
