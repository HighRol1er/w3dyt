import { Module } from '@nestjs/common';
import { ExchangeRate } from './exchange-rate';

// XXX: 이건 삭제하고 다른 곳에 모듈 부착해도 될듯
@Module({
  providers: [ExchangeRate],
  exports: [ExchangeRate],
})
export class ForexModule {}
