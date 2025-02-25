// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { BaseHttpService } from '../base/base-http.service';
// import { BinanceMarketResponse } from 'src/types/exchange-http';
// import { API_ENDPOINTS } from 'src/common/constants';
// import { AssetPair } from 'src/types/asset';
// @Injectable()
// export class BinanceHttpService extends BaseHttpService {
//   protected readonly apiEndpoint = API_ENDPOINTS.BINANCE;

//   constructor() {
//     super('Binance');
//   }

//   async fetchAllMarketData(): Promise<BinanceMarketResponse[]> {
//     try {
//       const response = await axios.get(this.apiEndpoint);
//       console.log('response', response.data.symbols);
//       this.marketList = this.parseExchangeData(response.data.symbols);
//       this.assetPairs = this.marketList.map(symbol => this.parseTradingPair(symbol));

//       this.logger.log(`Fetched market data for ${this.exchangeName}`);

//       // NOTE: 데이터 확인용 console.log
//       // console.log('response', response);
//       // console.log('rawData', this.rawData);
//       // console.log('symbolList', this.symbolList);
//       // console.log('assetPairs', this.assetPairs);

//       return response.data.symbols;
//     } catch (error) {
//       this.logger.error(`Error fetching market data for ${this.exchangeName}`, error);
//       throw error;
//     }
//   }

//   // protected parseExchangeData(data: BinanceMarketResponse[]): string[] {
//   //   return data
//   //     .filter(
//   //       symbol =>
//   //         symbol?.quoteAsset === 'USDT' &&
//   //         symbol?.status === 'TRADING' &&
//   //         symbol?.isSpotTradingAllowed === true,
//   //     )
//   //     .map(symbol => symbol.symbol);
//   // }

//   parseTradingPair(symbol: string): AssetPair {
//     const baseAsset = symbol.slice(0, -4); // Remove 'USDT' from the end
//     const quoteAsset = 'USDT';
//     return { baseAsset, quoteAsset };
//   }
// }
