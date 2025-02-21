import { Injectable, OnModuleInit } from '@nestjs/common';
// import { WebSocketService } from '../base/sample-base-ws.service';
import { UpbitWebSocketService } from './upbit-ws.service';
import { UpbitApiService } from './upbit-api.service';
import { AssetPair } from '../base/base-api.service';

@Injectable()
export class UpbitService implements OnModuleInit {
  constructor(
    private readonly upbitWebSocketService: UpbitWebSocketService,
    private readonly upbitApiService: UpbitApiService,
  ) {}

  // async fetchAllMarketData() {
  //   await this.upbitApiService.fetchAllMarketData();
  //   await this.upbitWebSocketService.connectWebSocket();

  // }

  async onModuleInit() {
    await this.upbitApiService.fetchAllMarketData();
    await this.upbitWebSocketService.connectWebSocket();
  }

  fetchTickerList(): string[] {
    return this.upbitApiService.fetchTickerList();
  }

  fetchAssetPairs(): AssetPair[] {
    return this.upbitApiService.fetchAssetPairs();
  }
}
