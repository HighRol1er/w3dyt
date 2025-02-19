import { Injectable } from '@nestjs/common';
import { WEBSOCKET_ENDPOINTS, EXCHANGE_NAME } from 'src/common/constants';
import { bithumbMarketData } from 'scripts/market/bithumb-market-data';
import { BaseWebsocketService } from '../base/base-ws.service';
import { formatChangeRate } from 'src/common/utils/number.util';
import {
  BithumbSubscribeMessageType,
  ParseMessageDataType,
  BithumbRawDataType,
} from 'src/types/websocket';

@Injectable()
export class BithumbWebsocketService extends BaseWebsocketService {
  protected readonly endpoint = WEBSOCKET_ENDPOINTS.BITHUMB;

  constructor() {
    super('Bithumb');
  }

  protected getSubscribeMessage(): BithumbSubscribeMessageType {
    return [
      { ticket: 'test' },
      {
        type: 'ticker',
        codes: bithumbMarketData.map(market => market.symbol),
      },
      { format: 'SIMPLE' },
    ];
  }

  protected parseMessageData(data: Buffer): ParseMessageDataType {
    const rawData: BithumbRawDataType = JSON.parse(data.toString());

    const formattedData: ParseMessageDataType = {
      exchange: EXCHANGE_NAME.BITHUMB,
      symbol: rawData.cd,
      currentPrice: rawData.tp, // number
      changeRate: formatChangeRate(rawData.scr),
      tradeVolume: rawData.atv24h, // number
    };

    // NOTE: 데이터 확인용 console.log
    // console.log('rawData: ', rawData);
    console.log('formattedData: ', formattedData);

    return formattedData;
  }
}
