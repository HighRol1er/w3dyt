import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const upbitSymbolSchema = pgTable('exchange_upbit', {
  currency_pair: varchar('currency_pair', { length: 20 }).primaryKey(), // KRW-BTC
  korean_name: varchar('korean_name', { length: 20 }).notNull(), // 비트코인
  english_name: varchar('english_name', { length: 50 }).notNull(), // Bitcoin
  base_asset: varchar('base_asset', { length: 10 }).notNull(), // BTC
  quote_asset: varchar('quote_asset', { length: 10 }).notNull(), // KRW
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

const upbitSymbolSelectSchema = createSelectSchema(upbitSymbolSchema);
const upbitSymbolInsertSchema = createInsertSchema(upbitSymbolSchema, {
  currency_pair: z.string().min(1),
  korean_name: z.string().optional(),
  english_name: z.string().optional(),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
});

export type UpbitSymbolSelect = z.infer<typeof upbitSymbolSelectSchema>;
export type UpbitSymbolInsert = z.infer<typeof upbitSymbolInsertSchema>;
