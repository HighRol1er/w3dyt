import { Controller, Get, Param } from '@nestjs/common';
import { UpbitService } from './upbit.service';

@Controller('/upbit')
export class UpbitController {
  constructor(private readonly upbitService: UpbitService) {}


  @Get('market/all')
  getAllMarketPrices() {
    return this.upbitService.getAllMarketPrices();
  }
}
