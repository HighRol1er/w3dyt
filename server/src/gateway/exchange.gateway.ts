import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
// import { UpbitWebsocketService } from '../collector/exchange/upbit/upbit-ws.service';
// import { BinanceWebsocketService } from '../collector/exchange/binance/binance-ws.service';
// import { BithumbWebsocketService } from '../collector/exchange/bithumb/bithumb-ws.service';

@WebSocketGateway({
  path: '/exchange',
  cors: {
    origin: [
      process.env.CLIENT_URL_DEV || 'http://localhost:3000',
      process.env.CLIENT_URL_PROD || 'https://your-production-domain.com',
    ],
    credentials: true,
  },
})
export class ExchangeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor() // private readonly upbitWebsocketService: UpbitWebsocketService,
  // private readonly binanceWebsocketService: BinanceWebsocketService,
  // private readonly bithumbWebsocketService: BithumbWebsocketService,
  {}

  handleConnection(client: WebSocket) {
    console.log('Client connected to exchange gateway');

    // 각 거래소의 웹소켓 서비스에 클라이언트 연결
    // this.upbitWebsocketService.handleConnection(client);
    // this.binanceWebsocketService.handleConnection(client);
    // this.bithumbWebsocketService.handleConnection(client);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected from exchange gateway');
  }
}
