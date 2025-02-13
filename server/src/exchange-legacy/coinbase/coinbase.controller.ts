import { Controller, Get } from '@nestjs/common';
import { CoinbaseService, CoinbaseTicker } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(private readonly coinbaseService: CoinbaseService) {}

  @Get('market/all')
  getAllProducts(): Promise<CoinbaseTicker[]> {
    return this.coinbaseService.getAllProducts();
  }
}
