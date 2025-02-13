import { Controller, Get } from '@nestjs/common';
import { BithumbService } from './bithumb.service';

@Controller('bithumb')
export class BithumbController {
  constructor(private readonly bithumbService: BithumbService) {}

  @Get('market/all')
  getAllMarketPrices() {
    return this.bithumbService.getAllMarketPrices();
  }
}
