import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const bithumbTickers = pgTable('exchange_bithumb', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  korean_name: varchar('korean_name', { length: 20 }).notNull(), // 비트코인
  english_name: varchar('english_name', { length: 50 }).notNull(), // Bitcoin
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // KRW
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const bithumbTickersSelectSchema = createSelectSchema(bithumbTickers);
export const bithumbTickersInsertSchema = createInsertSchema(bithumbTickers);
