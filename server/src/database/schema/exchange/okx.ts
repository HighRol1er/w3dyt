import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const okxTickers = pgTable('exchange_okx', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // BTC-USDT
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  // validatedAt: timestamp('validated_at').defaultNow(), // 굳이 필요할까?
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const okxTickersSelectSchema = createSelectSchema(okxTickers);
export const okxTickersInsertSchema = createInsertSchema(okxTickers);
