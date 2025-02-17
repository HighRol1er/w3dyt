import { formatChangeRate } from '../number.util';

describe('NumberUtil', () => {
  describe('formatChangeRate', () => {
    it('should format positive numbers correctly', () => {
      expect(formatChangeRate(1.23456789)).toBe('1.23%');
      expect(formatChangeRate(0.00123456)).toBe('0.00%');
      expect(formatChangeRate(99.9999999)).toBe('100.00%');
    });

    it('should format negative numbers correctly', () => {
      expect(formatChangeRate(-1.23456789)).toBe('-1.23%');
      expect(formatChangeRate(-0.00123456)).toBe('-0.00%');
      expect(formatChangeRate(-99.9999999)).toBe('-100.00%');
    });

    it('should format zero correctly', () => {
      expect(formatChangeRate(0)).toBe('0.00%');
    });

    it('should handle extreme numbers', () => {
      expect(formatChangeRate(Number.MAX_VALUE)).toMatch(/[\d\.e\+\-]+%/);
      expect(formatChangeRate(Number.MIN_VALUE)).toBe('0.00%');
    });

    it('should handle NaN and return "0.00%"', () => {
      expect(formatChangeRate(NaN)).toBe('0.00%');
    });
  });
});
