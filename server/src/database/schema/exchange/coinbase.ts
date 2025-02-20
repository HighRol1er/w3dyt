import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const coinbaseTickers = pgTable('exchange_coinbase', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // ETH-USD
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // ETH
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USD
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const coinbaseTickersSelectSchema = createSelectSchema(coinbaseTickers);
const coinbaseTickersInsertSchema = createInsertSchema(coinbaseTickers, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type CoinbaseTickerSelect = z.infer<typeof coinbaseTickersSelectSchema>;
export type CoinbaseTickerInsert = z.infer<typeof coinbaseTickersInsertSchema>;
