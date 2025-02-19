import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRate } from '../exchange-rate';
import { Logger } from '@nestjs/common';

// Test CLI: pnpm test -- src/exchange/forex/__tests__/exchange-rate.spec.ts --verbose
describe('ExchangeRate', () => {
  let service: ExchangeRate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRate,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeRate>(ExchangeRate);
  });

  describe('USD/KRW Rate', () => {
    it('should fetch USD/KRW rate successfully', async () => {
      const rate = await service.fetchUsdKrwRate();
      console.log('Current USD/KRW Rate:', rate);
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    }, 10000);
  });

  describe('USD/JPY Rate', () => {
    it('should fetch USD/JPY rate successfully', async () => {
      const rate = await service.fetchUsdJpyRate();
      console.log('Current USD/JPY Rate:', rate);
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    }, 10000);
  });

  describe('USD/EUR Rate', () => {
    it('should fetch USD/EUR rate successfully', async () => {
      const rate = await service.fetchUsdEurRate();
      console.log('Current USD/EUR Rate:', rate);
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    }, 10000);
  });

  describe('USD/GBP Rate', () => {
    it('should fetch USD/GBP rate successfully', async () => {
      const rate = await service.fetchUsdGbpRate();
      console.log('Current USD/GBP Rate:', rate);
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    }, 10000);
  });

  describe('USD/CNY Rate', () => {
    it('should fetch USD/CNY rate successfully', async () => {
      const rate = await service.fetchUsdCnyRate();
      console.log('Current USD/CNY Rate:', rate);
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    }, 10000);
  });
});
