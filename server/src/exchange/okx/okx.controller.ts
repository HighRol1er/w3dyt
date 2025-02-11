import { Controller, Get, Param } from '@nestjs/common';
import { OKXService } from './okx.service';

@Controller('okx')
export class OKXController {
  constructor(private readonly okxService: OKXService) {}

  @Get('market/all')
  getAllMarketPrices() {
    return this.okxService.getAllMarketPrices();
  }
}
