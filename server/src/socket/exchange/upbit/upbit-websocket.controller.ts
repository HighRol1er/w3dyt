import { Controller, Get } from '@nestjs/common';
import { UpbitWebsocketService } from '../upbit/upbit-websocket.service';

@Controller('upbit-ws')
export class UpbitWebsocketController {
  constructor(private readonly upbitWebsocketService: UpbitWebsocketService) {}

  @Get('status')
  getStatus() {
    return {
      isConnected: this.upbitWebsocketService.isWebSocketConnected(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('prices')
  getPrices() {
    return this.upbitWebsocketService.getLatestPrices();
  }
} 