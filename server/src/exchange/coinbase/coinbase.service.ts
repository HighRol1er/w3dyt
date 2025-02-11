import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

export interface CoinbaseProduct {
  product_id: string;
  base_currency: string;
  quote_currency: string;
  price: string;
  volume_24h: string;
  volume_30d: string;
  status: string;
  base_increment: string;
  quote_increment: string;
  min_market_funds: string;
  max_market_funds: string;
  trading_disabled: boolean;
  cancel_only: boolean;
  post_only: boolean;
  limit_only: boolean;
}

@Injectable()
export class CoinbaseService {
  private readonly COINBASE_API_URL = 'https://api.exchange.coinbase.com';

  private readonly config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async getAllProducts(): Promise<CoinbaseProduct[]> {
    try {
      const response = await axios.get<CoinbaseProduct[]>(
        `${this.COINBASE_API_URL}/products`,
        this.config,
      );

      // USD 마켓만 필터링하고 거래 가능한 마켓만 선택
      const activeUsdMarkets = response.data.filter(
        product => 
          product.quote_currency === 'USD' && 
          !product.trading_disabled &&
          product.status === 'online'
      );

      return activeUsdMarkets;
    } catch (error) {
      throw new Error(`코인베이스 마켓 정보 조회 실패: ${error.message}`);
    }
  }
}
