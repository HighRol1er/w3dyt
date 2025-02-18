import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_ENDPOINTS } from '../../common/constants/api-endpoint.constants';

export interface BithumbTicker {
  opening_price: string;
  closing_price: string;
  min_price: string;
  max_price: string;
  units_traded: string;
  acc_trade_value: string;
  prev_closing_price: string;
  units_traded_24H: string;
  acc_trade_value_24H: string;
  fluctate_24H: string;
  fluctate_rate_24H: string;
  date: string;
}

export interface BithumbResponse<T> {
  status: string;
  data: T;
}

@Injectable()
export class BithumbService {
  private readonly BITHUMB_API_URL = API_ENDPOINTS.BITHUMB;

  async getAllMarketPrices(): Promise<BithumbResponse<{ [key: string]: BithumbTicker }>> {
    try {
      const response = await axios.get<BithumbResponse<{ [key: string]: BithumbTicker }>>(
        `${this.BITHUMB_API_URL}/ticker/ALL_KRW`,
      );

      return response.data;
    } catch (error) {
      throw new Error(`빗썸 마켓 정보 조회 실패: ${error.message}`);
    }
  }
}
