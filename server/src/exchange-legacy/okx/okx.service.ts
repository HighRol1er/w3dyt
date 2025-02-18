import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from '../../common/constants/api-endpoint.constants';

export interface OKXTicker {
  instId: string; // 상품 ID (예: BTC-USDT)
  last: string; // 최신 거래가
  lastSz: string; // 최신 거래량
  askPx: string; // 매도 1호가
  askSz: string; // 매도 1호 수량
  bidPx: string; // 매수 1호가
  bidSz: string; // 매수 1호 수량
  open24h: string; // 24시간 시가
  high24h: string; // 24시간 고가
  low24h: string; // 24시간 저가
  volCcy24h: string; // 24시간 거래량 (계약)
  vol24h: string; // 24시간 거래량 (币)
  sodUtc0: string; // UTC 0시 시가
  sodUtc8: string; // UTC 8시 시가
  ts: string; // 시간
}

export interface OKXResponse<T> {
  code: string;
  msg: string;
  data: T;
}

@Injectable()
export class OKXService {
  private readonly OKX_API_URL = API_ENDPOINTS.OKX;

  async getAllMarketPrices(): Promise<OKXResponse<OKXTicker[]>> {
    try {
      const response = await axios.get<OKXResponse<OKXTicker[]>>(
        `${this.OKX_API_URL}/market/tickers`,
        {
          params: {
            instType: 'SPOT', // 현물 마켓만 조회
          },
        },
      );

      // USDT 마켓만 필터링
      response.data.data = response.data.data.filter(ticker => ticker.instId.endsWith('USDT'));

      return response.data;
    } catch (error) {
      throw new Error(`OKX 마켓 정보 조회 실패: ${error.message}`);
    }
  }
}
