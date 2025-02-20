import { pgTable, timestamp, varchar, decimal, serial } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const forexRates = pgTable('forex_rates', {
  id: serial('id').primaryKey(),
  currency_pair: varchar('currency_pair', { length: 10 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
  rate: decimal('rate', { precision: 10, scale: 4 }).notNull(),
});

// Zod 스키마
const forexRatesSelectSchema = createSelectSchema(forexRates);
const forexRatesInsertSchema = createInsertSchema(forexRates, {
  currency_pair: z.string().min(1),
  rate: z.number().positive(),
});

// 타입 정의
export type ForexRateSelect = z.infer<typeof forexRatesSelectSchema>;
export type ForexRateInsert = z.infer<typeof forexRatesInsertSchema>;
