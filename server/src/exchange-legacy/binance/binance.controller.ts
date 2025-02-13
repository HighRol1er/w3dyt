import { Controller, Get } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('market/all')
  getAllMarketPrices() {
    return this.binanceService.getAllMarketPrices();
  }

  @Get('prices')
  getSimplePrices() {
    return this.binanceService.getSimplePrices();
  }
}
