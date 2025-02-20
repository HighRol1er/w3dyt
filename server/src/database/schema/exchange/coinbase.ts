import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const coinbaseTickers = pgTable('exchange_coinbase', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // ETH-USD
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // ETH
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USD
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const coinbaseTickersSelectSchema = createSelectSchema(coinbaseTickers);
export const coinbaseTickersInsertSchema = createInsertSchema(coinbaseTickers);
