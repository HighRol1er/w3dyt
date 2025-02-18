import { formatChangeRate } from '../number.util';

describe('NumberUtil', () => {
  describe('formatChangeRate', () => {
    it('should convert decimal rates to percentage correctly', () => {
      expect(formatChangeRate(0.1234)).toBe('12.34%');
      expect(formatChangeRate(0.0012)).toBe('0.12%');
      expect(formatChangeRate(0.9999)).toBe('99.99%');
    });

    it('should handle negative rates correctly', () => {
      expect(formatChangeRate(-0.1234)).toBe('-12.34%');
      expect(formatChangeRate(-0.0012)).toBe('-0.12%');
      expect(formatChangeRate(-0.9999)).toBe('-99.99%');
    });

    it('should format zero correctly', () => {
      expect(formatChangeRate(0)).toBe('0.00%');
    });

    it('should handle small decimal numbers', () => {
      expect(formatChangeRate(0.000123)).toBe('0.01%');
      expect(formatChangeRate(-0.000123)).toBe('-0.01%');
    });

    it('should handle NaN and return "0.00%"', () => {
      expect(formatChangeRate(NaN)).toBe('0.00%');
    });
  });
});
