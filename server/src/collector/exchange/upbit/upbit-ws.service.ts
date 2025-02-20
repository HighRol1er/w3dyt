import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { upbitMarketData } from 'scripts/market/upbit-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import { formatChangeRate } from 'src/common/utils/number.util';
import {
  UpbitSubscribeMessageType,
  ParseMessageTickerDataType,
  UpbitRawDataType,
} from 'src/types/exchange-ws';
@Injectable()
export class UpbitWebsocketService extends BaseWebsocketService {
  protected readonly endpoint = WEBSOCKET_ENDPOINTS.UPBIT;

  constructor() {
    super('Upbit');
  }
  // NOTE: 처음 스냅샷 이후 실시간 데이터 들어옴
  protected getSubscribeMessage(): UpbitSubscribeMessageType {
    return [
      { ticket: 'test' },
      {
        type: 'ticker',
        codes: upbitMarketData.map(market => market.symbol),
      },
      { format: 'SIMPLE' },
    ];
  }

  protected parseMessageData(data: Buffer): ParseMessageTickerDataType {
    const rawData: UpbitRawDataType = JSON.parse(data.toString());

    // XXX : 아마 currentPrice랑 tradeVolume 문자열로 바꿔서 소수점 처리 + 콤마 처리 필요할 듯
    // 그리고 currentPrice에 대한 가격 SHIB같은 경우는 가격이 소수점이라서 가격 자리수마다 포메팅이 필요함 (util 함수로 만들어야함)
    const tickerData: ParseMessageTickerDataType = {
      exchange: EXCHANGE_NAME.UPBIT,
      symbol: rawData.cd,
      currentPrice: rawData.tp,
      changeRate: formatChangeRate(rawData.scr),
      tradeVolume: rawData.atp24h,
    };
    // NOTE: 데이터 확인용 console.log
    // console.log('rawData: ', rawData);
    // console.log('tickerData: ', tickerData);

    return tickerData;
  }
}
