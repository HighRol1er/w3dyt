import { Controller, Get } from '@nestjs/common';
import { BybitService, BybitResponse, BybitTicker } from './bybit.service';

@Controller('bybit')
export class BybitController {
  constructor(private readonly bybitService: BybitService) {}

  @Get('market/all')
  getAllMarketPrices(): Promise<BybitResponse<BybitTicker>> {
    return this.bybitService.getAllMarketPrices();
  }
}
