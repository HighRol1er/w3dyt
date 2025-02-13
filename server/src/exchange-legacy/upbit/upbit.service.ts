import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from 'src/common/constants/api.constants';


export interface Market {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface UpbitTicker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

@Injectable()
export class UpbitService {
  private readonly UPBIT_API_URL = API_ENDPOINTS.UPBIT;

  async getMarkets(): Promise<Market[]> {
    try {
      const response = await axios.get<Market[]>(`${this.UPBIT_API_URL}/market/all`);
      return response.data;
    } catch (error) {
      throw new Error(`업비트 마켓 정보 조회 실패: ${error.message}`);
    }
  }

  async getAllMarketPrices(): Promise<UpbitTicker[]> {
    try {
      // 1. 먼저 모든 마켓 목록을 가져옵니다
      const markets = await this.getMarkets();
      
      // 2. KRW 마켓만 필터링 (선택사항)
      const krwMarkets = markets
        .filter(market => market.market.startsWith('KRW-'))
        .map(market => market.market);
      
      // 3. 한 번의 요청으로 모든 마켓의 가격 정보를 가져옵니다
      const response = await axios.get<UpbitTicker[]>(`${this.UPBIT_API_URL}/ticker`, {
        params: {
          markets: krwMarkets.join(','),
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`전체 마켓 가격 조회 실패: ${error.message}`);
    }
  }

}
