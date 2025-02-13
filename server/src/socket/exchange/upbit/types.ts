import { z } from 'zod';
import type { UpbitTicker } from '../../../database/schema/upbit.schema';

export interface UpbitWebSocketMessage {
  type: string;
  code: string;
  trade_price: number;
  change_rate: number;
  acc_trade_volume_24h: number;
  timestamp?: string;
}

export class DrizzleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DrizzleError';
  }
}

export type UpbitTickerCache = Record<string, UpbitTicker>; 