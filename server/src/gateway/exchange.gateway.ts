import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { UpbitWebsocketService } from '../exchange/upbit/upbit-websocket.service';
import { BinanceWebsocketService } from '../exchange/binance/binance-websocket.service';
import { BithumbWebsocketService } from '../exchange/bithumb/bithumb-websocket.service';

@WebSocketGateway({
  path: '/exchange',
  cors: {
    origin: 'http://localhost:3001', // Next.js 클라이언트 주소
    credentials: true,
  },
})
export class ExchangeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly upbitWebsocketService: UpbitWebsocketService,
    private readonly binanceWebsocketService: BinanceWebsocketService,
    private readonly bithumbWebsocketService: BithumbWebsocketService,
  ) {}

  handleConnection(client: WebSocket) {
    console.log('Client connected to exchange gateway');

    // 각 거래소의 웹소켓 서비스에 클라이언트 연결
    this.upbitWebsocketService.handleConnection(client);
    this.binanceWebsocketService.handleConnection(client);
    this.bithumbWebsocketService.handleConnection(client);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected from exchange gateway');
  }
}
