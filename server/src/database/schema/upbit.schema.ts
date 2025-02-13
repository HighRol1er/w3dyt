import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { pgTable, serial, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';

// Drizzle 스키마
export const upbitTickers = pgTable('upbit_tickers', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  changeRate: varchar('change_rate', { length: 10 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
});

// Zod 스키마
export const UpbitTickerSchema = z.object({
  symbol: z.string().min(1).max(20),
  price: z.number().positive(),
  changeRate: z.string().max(10),
  volume24h: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});

// Insert DTO
export const insertUpbitTickerSchema = createInsertSchema(upbitTickers);

// Response DTO
export const UpbitTickerResponseSchema = UpbitTickerSchema.extend({
  id: z.number(),
});

// Types
export type UpbitTicker = z.infer<typeof UpbitTickerSchema>;
export type UpbitTickerInsert = z.infer<typeof insertUpbitTickerSchema>;
export type UpbitTickerResponse = z.infer<typeof UpbitTickerResponseSchema>; 