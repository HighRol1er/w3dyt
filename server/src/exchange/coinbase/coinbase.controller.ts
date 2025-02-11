import { Controller, Get } from '@nestjs/common';
import { CoinbaseService, CoinbaseProduct } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(private readonly coinbaseService: CoinbaseService) {}

  @Get('market/all')
  getAllProducts(): Promise<CoinbaseProduct[]> {
    return this.coinbaseService.getAllProducts();
  }
}
