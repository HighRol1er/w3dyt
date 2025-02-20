import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const bybitTickers = pgTable('exchange_bybit', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const bybitTickersSelectSchema = createSelectSchema(bybitTickers);
const bybitTickersInsertSchema = createInsertSchema(bybitTickers, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type BybitTickerSelect = z.infer<typeof bybitTickersSelectSchema>;
export type BybitTickerInsert = z.infer<typeof bybitTickersInsertSchema>;
