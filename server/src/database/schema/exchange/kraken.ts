import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const krakenSymbolSchema = pgTable('exchange_kraken', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // BTCUSD
  wsname: varchar('wsname', { length: 30 }).notNull(), // BTC/USD
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USD
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const krakenSymbolSelectSchema = createSelectSchema(krakenSymbolSchema);
const krakenSymbolInsertSchema = createInsertSchema(krakenSymbolSchema, {
  currency_pair: z.string().min(1),
  wsname: z.string().optional(),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type KrakenSymbolSelect = z.infer<typeof krakenSymbolSelectSchema>;
export type KrakenSymbolInsert = z.infer<typeof krakenSymbolInsertSchema>;
