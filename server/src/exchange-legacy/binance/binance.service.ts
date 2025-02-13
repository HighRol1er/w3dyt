import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from '../../common/constants/api.constants';
export interface BinancePrice {
  symbol: string;
  price: string;
  time: number;
}

export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

@Injectable()
export class BinanceService {
  private readonly BINANCE_API_URL = API_ENDPOINTS.BINANCE;

  async getAllMarketPrices(): Promise<BinanceTicker[]> {
    try {
      const response = await axios.get<BinanceTicker[]>(
        `${this.BINANCE_API_URL}/ticker/24hr`,
      );
      
      // USDT 마켓만 필터링
      const usdtMarkets = response.data.filter(ticker => 
        ticker.symbol.endsWith('USDT')
      );
      
      return usdtMarkets;
    } catch (error) {
      throw new Error(`바이낸스 마켓 정보 조회 실패: ${error.message}`);
    }
  }

  async getSimplePrices(): Promise<BinancePrice[]> {
    try {
      const response = await axios.get<BinancePrice[]>(
        `${this.BINANCE_API_URL}/ticker/price`,
      );
      
      // USDT 마켓만 필터링
      const usdtMarkets = response.data.filter(price => 
        price.symbol.endsWith('USDT')
      );
      
      return usdtMarkets;
    } catch (error) {
      throw new Error(`바이낸스 가격 정보 조회 실패: ${error.message}`);
    }
  }
}
