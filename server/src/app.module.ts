import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ExchangeModule } from './collector/exchange/exchange.module';
import { ExchangeGateway } from './gateway/exchange.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ExchangeModule,
  ],
  providers: [ExchangeGateway],
})
export class AppModule {}
