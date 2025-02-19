import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// 마켓 테이블 스키마 정의
export const markets = pgTable('markets', {
  symbol: text('symbol').primaryKey(),
  exchange: text('exchange').notNull(),
  kor_name: text('kor_name'),
  eng_name: text('eng_name'),
  base_asset: text('base_asset').notNull(),
  quote_asset: text('quote_asset').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Zod 스키마 생성
export const insertMarketSchema = createInsertSchema(markets, {
  symbol: z.string().min(1),
  exchange: z.string().min(1),
  kor_name: z.string().optional(),
  eng_name: z.string().optional(),
  base_asset: z.string().min(1),
  quote_asset: z.string().min(1),
  is_active: z.boolean().default(true),
});

export const selectMarketSchema = createSelectSchema(markets);

// 타입 정의
export type Market = z.infer<typeof selectMarketSchema>;
export type NewMarket = z.infer<typeof insertMarketSchema>;

// 마켓 데이터 저장 함수
export async function saveMarketData(
  db: any,
  marketData: typeof import('../../../scripts/market/upbit-market-data').upbitMarketData,
) {
  try {
    const marketsToInsert = marketData.map(market => ({
      symbol: market.symbol,
      exchange: 'UPBIT',
      kor_name: market.kor_name,
      eng_name: market.eng_name,
      base_asset: market.baseAsset,
      quote_asset: market.quoteAsset,
      is_active: true,
    }));

    // Zod로 데이터 검증
    const validatedMarkets = marketsToInsert.map(market => insertMarketSchema.parse(market));

    // upsert 수행
    await db
      .insert(markets)
      .values(validatedMarkets)
      .onConflictDoUpdate({
        target: markets.symbol,
        set: {
          kor_name: db.sql`EXCLUDED.kor_name`,
          eng_name: db.sql`EXCLUDED.eng_name`,
          base_asset: db.sql`EXCLUDED.base_asset`,
          quote_asset: db.sql`EXCLUDED.quote_asset`,
          updated_at: db.sql`CURRENT_TIMESTAMP`,
        },
      });

    console.log(`Successfully saved ${validatedMarkets.length} markets`);
  } catch (error) {
    console.error('Error saving market data:', error);
    throw error;
  }
}
