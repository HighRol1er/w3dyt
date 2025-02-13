import { pgTable, serial, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';

export const upbitTickers = pgTable('upbit_tickers', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  changeRate: varchar('change_rate', { length: 10 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
}); 