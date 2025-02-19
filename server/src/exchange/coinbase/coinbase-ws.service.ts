import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { coinbaseMarketData } from 'scripts/market/coinbase-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import {
  CoinbaseRawDataType,
  CoinbaseSubscribeMessageType,
  ParseMessageDataType,
} from 'src/types/websocket';

@Injectable()
export class CoinbaseWebsocketService extends BaseWebsocketService {
  protected readonly endpoint = WEBSOCKET_ENDPOINTS.COINBASE;

  constructor() {
    super('Coinbase');
  }

  protected getSubscribeMessage(): CoinbaseSubscribeMessageType {
    return {
      type: 'subscribe',
      product_ids: coinbaseMarketData.map(market => market.symbol),
      channels: ['ticker'],
    };
  }

  protected parseMessageData(data: Buffer): ParseMessageDataType {
    const rawData: CoinbaseRawDataType = JSON.parse(data.toString());

    // Type guard
    if (rawData.type !== 'ticker') {
      return null;
    }

    const formattedData: ParseMessageDataType = {
      exchange: EXCHANGE_NAME.COINBASE,
      symbol: rawData.product_id,
      currentPrice: parseFloat(rawData.price),
      // XXX: coinbase는 롤링 24시간 기준이라서 한국 시간에 맞추려면 9시 데이터를 저장해서 조회해야 한다.
      // 그리고 저장한 데이터를 기준으로 open price에 맞춰서 해야 함
      changeRate: '',
      tradeVolume: parseFloat(rawData.volume_24h),
    };
    // NOTE: 데이터 확인용 콘솔 출력
    // console.log('rawData: ', rawData);
    console.log('formattedData: ', formattedData);

    return formattedData;
  }
}
