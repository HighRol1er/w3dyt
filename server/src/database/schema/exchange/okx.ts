import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
export const okxSymbolSchema = pgTable('exchange_okx', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // BTC-USDT
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // USDT
  // validatedAt: timestamp('validated_at').defaultNow(), // 굳이 필요할까?
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const okxSymbolSelectSchema = createSelectSchema(okxSymbolSchema);
const okxSymbolInsertSchema = createInsertSchema(okxSymbolSchema, {
  currency_pair: z.string().min(1),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type OkxSymbolSelect = z.infer<typeof okxSymbolSelectSchema>;
export type OkxSymbolInsert = z.infer<typeof okxSymbolInsertSchema>;
