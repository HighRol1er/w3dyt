import { Controller, Get } from '@nestjs/common';
import { CollectorService, CollectedPrice } from './collector.service';

@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @Get('prices')
  getLatestPrices(): CollectedPrice[] {
    return this.collectorService.getLatestPrices();
  }

  @Get('prices/collect')
  collectPrices(): Promise<CollectedPrice[]> {
    return this.collectorService.collectAllPrices();
  }
} 