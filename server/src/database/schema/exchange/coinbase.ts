import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const coinbaseSymbolSchema = pgTable('exchange_coinbase', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // ETH-USD
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // ETH
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USD
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const coinbaseSymbolSelectSchema = createSelectSchema(coinbaseSymbolSchema);
const coinbaseSymbolInsertSchema = createInsertSchema(coinbaseSymbolSchema, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type CoinbaseSymbolSelect = z.infer<typeof coinbaseSymbolSelectSchema>;
export type CoinbaseSymbolInsert = z.infer<typeof coinbaseSymbolInsertSchema>;
