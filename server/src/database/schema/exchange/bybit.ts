import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const bybitSymbolSchema = pgTable('exchange_bybit', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const bybitSymbolSelectSchema = createSelectSchema(bybitSymbolSchema);
const bybitSymbolInsertSchema = createInsertSchema(bybitSymbolSchema, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type BybitSymbolSelect = z.infer<typeof bybitSymbolSelectSchema>;
export type BybitSymbolInsert = z.infer<typeof bybitSymbolInsertSchema>;
