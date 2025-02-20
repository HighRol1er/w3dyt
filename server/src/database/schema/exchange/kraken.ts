import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const krakenTickers = pgTable('exchange_kraken', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // BTC-USD
  wsname: varchar('wsname', { length: 30 }).notNull(), // BTC/USD
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USD
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const krakenTickersSelectSchema = createSelectSchema(krakenTickers);
export const krakenTickersInsertSchema = createInsertSchema(krakenTickers);
