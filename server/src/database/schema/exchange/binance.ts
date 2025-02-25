import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const binanceSymbolSchema = pgTable('exchange_binance', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  // validatedAt: timestamp('validated_at').defaultNow(), // 굳이 필요할까?
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const binanceSymbolSelectSchema = createSelectSchema(binanceSymbolSchema);
const binanceSymbolInsertSchema = createInsertSchema(binanceSymbolSchema, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type BinanceSymbolSelect = z.infer<typeof binanceSymbolSelectSchema>;
export type BinanceSymbolInsert = z.infer<typeof binanceSymbolInsertSchema>;
