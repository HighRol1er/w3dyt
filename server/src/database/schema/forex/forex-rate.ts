import { pgTable, timestamp, varchar, decimal, serial } from 'drizzle-orm/pg-core';

export const forexRates = pgTable('forex_rates', {
  id: serial('id').primaryKey(),
  currency_pair: varchar('currency_pair', { length: 10 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
  rate: decimal('rate', { precision: 10, scale: 4 }).notNull(),
});
