import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const binanceTickersSchema = pgTable('exchange_binance', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  // validatedAt: timestamp('validated_at').defaultNow(), // 굳이 필요할까?
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const binanceTickersSelectSchema = createSelectSchema(binanceTickersSchema);
const binanceTickersInsertSchema = createInsertSchema(binanceTickersSchema, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type BinanceTickerSelect = z.infer<typeof binanceTickersSelectSchema>;
export type BinanceTickerInsert = z.infer<typeof binanceTickersInsertSchema>;
