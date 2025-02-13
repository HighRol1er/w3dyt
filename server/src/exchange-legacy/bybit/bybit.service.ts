import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from '../../common/constants/api.constants';

export interface BybitTicker {
  symbol: string;
  lastPrice: string;
  highPrice24h: string;
  lowPrice24h: string;
  prevPrice24h: string;
  volume24h: string;
  turnover24h: string;
  price24hPcnt: string;
  usdIndexPrice: string
}

export interface BybitResponse<T> {
  retCode: number;
  retMsg: string;
  result: {
    list: T[];
  };
  retExtInfo: {};
  time: number;
}

@Injectable()
export class BybitService {
  private readonly BYBIT_API_URL = API_ENDPOINTS.BYBIT;

  async getAllMarketPrices(): Promise<BybitResponse<BybitTicker>> {
    try {
      const response = await axios.get<BybitResponse<BybitTicker>>(
        `${this.BYBIT_API_URL}/market/tickers`,
        {
          params: {
            category: 'spot', // 현물 마켓만 조회
          },
        },
      );

      // USDT 마켓만 필터링
      response.data.result.list = response.data.result.list.filter(ticker =>
        ticker.symbol.endsWith('USDT')
      );

      return response.data;
    } catch (error) {
      throw new Error(`바이비트 마켓 정보 조회 실패: ${error.message}`);
    }
  }
}
