import { cn } from '../utils';
import { clsx } from 'clsx';

// Mock formatting functions for comprehensive testing
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
  });
  return formatter.format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

const formatPercentage = (num: number, decimals: number = 2): string => {
  return `${(num * 100).toFixed(decimals)}%`;
};

describe('Utility Functions - Core Business Logic', () => {
  describe('formatCurrency', () => {
    test('formats basic currency values', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('handles negative values', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    test('handles large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    test('handles decimal precision', () => {
      expect(formatCurrency(10.1)).toBe('$10.10');
      expect(formatCurrency(10.99)).toBe('$10.99');
      expect(formatCurrency(10.999)).toBe('$11.00'); // Rounds up
    });

    test('handles edge cases', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.001)).toBe('$0.00'); // Rounds down
      expect(formatCurrency(Number.MAX_SAFE_INTEGER)).toContain('$');
    });

    test('handles different currency options', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00');
      expect(formatCurrency(100, 'GBP')).toBe('£100.00');
      expect(formatCurrency(100, 'JPY')).toBe('¥100');
    });
  });

  describe('formatNumber', () => {
    test('formats basic numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    test('handles decimal numbers', () => {
      expect(formatNumber(100.5)).toBe('100.5');
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    test('handles negative numbers', () => {
      expect(formatNumber(-100)).toBe('-100');
      expect(formatNumber(-1234.56)).toBe('-1,234.56');
    });

    test('handles zero and small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(0.1)).toBe('0.1');
      expect(formatNumber(0.01)).toBe('0.01');
    });

    test('handles large numbers', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567890)).toBe('1,234,567,890');
    });

    test('handles edge cases', () => {
      expect(formatNumber(Number.MAX_SAFE_INTEGER)).toContain(',');
      expect(formatNumber(Number.MIN_SAFE_INTEGER)).toContain(',');
    });
  });

  describe('formatPercentage', () => {
    test('formats basic percentages', () => {
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(0.25)).toBe('25.00%');
      expect(formatPercentage(1)).toBe('100.00%');
    });

    test('handles decimal percentages', () => {
      expect(formatPercentage(0.123)).toBe('12.30%');
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.12345)).toBe('12.35%'); // Rounds
    });

    test('handles large percentages', () => {
      expect(formatPercentage(2)).toBe('200.00%');
      expect(formatPercentage(10.5)).toBe('1050.00%');
    });

    test('handles negative percentages', () => {
      expect(formatPercentage(-0.1)).toBe('-10.00%');
      expect(formatPercentage(-0.25)).toBe('-25.00%');
    });

    test('handles zero percentage', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });

    test('handles edge cases', () => {
      expect(formatPercentage(0.001)).toBe('0.10%');
      expect(formatPercentage(0.0001)).toBe('0.01%');
    });

    test('handles custom decimal places', () => {
      expect(formatPercentage(0.123456, 0)).toBe('12%');
      expect(formatPercentage(0.123456, 1)).toBe('12.3%');
      expect(formatPercentage(0.123456, 3)).toBe('12.346%');
    });
  });

  describe('clsx function', () => {
    test('combines class names', () => {
      expect(clsx('class1', 'class2')).toBe('class1 class2');
      expect(clsx('class1 class2', 'class3')).toBe('class1 class2 class3');
    });

    test('handles conditional classes', () => {
      expect(clsx('base', true && 'conditional')).toBe('base conditional');
      expect(clsx('base', false && 'conditional')).toBe('base');
    });

    test('handles object syntax', () => {
      expect(clsx({
        'class1': true,
        'class2': false,
        'class3': true
      })).toBe('class1 class3');
    });

    test('handles array syntax', () => {
      expect(clsx(['class1', 'class2'])).toBe('class1 class2');
      expect(clsx(['class1', false && 'class2', 'class3'])).toBe('class1 class3');
    });

    test('handles mixed syntax', () => {
      expect(clsx(
        'base',
        { 'conditional': true },
        ['array-class'],
        false && 'ignored'
      )).toBe('base conditional array-class');
    });

    test('handles empty values', () => {
      expect(clsx()).toBe('');
      expect(clsx('')).toBe('');
      expect(clsx(null, undefined, false)).toBe('');
    });
  });

  describe('cn function (className utility)', () => {
    test('combines and deduplicates Tailwind classes', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    test('handles conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    test('handles complex Tailwind merging', () => {
      expect(cn('bg-red-500 hover:bg-red-600', 'bg-blue-500')).toBe('hover:bg-red-600 bg-blue-500');
      expect(cn('p-4 px-6', 'py-2')).toBe('p-4 px-6 py-2');
    });

    test('handles object and array syntax', () => {
      expect(cn({
        'bg-red-500': true,
        'text-white': false,
        'p-4': true
      })).toBe('bg-red-500 p-4');

      expect(cn(['bg-red-500', 'text-white'], 'p-4')).toBe('bg-red-500 text-white p-4');
    });

    test('handles responsive and state variants', () => {
      expect(cn('lg:text-xl', 'md:text-lg', 'text-base')).toBe('lg:text-xl md:text-lg text-base');
      expect(cn('hover:bg-blue-500', 'focus:bg-blue-600')).toBe('hover:bg-blue-500 focus:bg-blue-600');
    });

    test('handles empty and null values', () => {
      expect(cn()).toBe('');
      expect(cn('', null, undefined)).toBe('');
      expect(cn('valid-class', '', 'another-class')).toBe('valid-class another-class');
    });
  });

  describe('Utility Integration Tests', () => {
    test('currency formatting in different locales', () => {
      const price = 1234.56;
      expect(formatCurrency(price)).toBe('$1,234.56');
      expect(formatCurrency(price, 'EUR')).toBe('€1,234.56');
    });

    test('number and percentage formatting consistency', () => {
      const value = 0.12345;
      expect(formatPercentage(value)).toBe('12.35%');
      expect(formatNumber(value * 100)).toBe('12.345');
    });

    test('class combination for dynamic styling', () => {
      const baseClasses = 'px-4 py-2 rounded';
      const variantClasses = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white',
        outline: 'border border-gray-300 text-gray-700'
      };
      
      expect(cn(baseClasses, variantClasses.primary)).toBe('px-4 py-2 rounded bg-blue-500 text-white');
      expect(cn(baseClasses, variantClasses.outline)).toBe('px-4 py-2 rounded border border-gray-300 text-gray-700');
    });

    test('responsive utility combinations', () => {
      const responsiveClasses = cn(
        'text-sm md:text-base lg:text-lg',
        'p-2 md:p-4 lg:p-6',
        'hidden md:block'
      );
      
      expect(responsiveClasses).toContain('text-sm');
      expect(responsiveClasses).toContain('md:text-base');
      expect(responsiveClasses).toContain('lg:text-lg');
      expect(responsiveClasses).toContain('hidden');
      expect(responsiveClasses).toContain('md:block');
    });

    test('conditional formatting with utilities', () => {
      const isNegative = true;
      const value = -150;
      
      const formattedCurrency = formatCurrency(Math.abs(value));
      const className = cn(
        'font-semibold',
        isNegative ? 'text-red-500' : 'text-green-500'
      );
      
      expect(formattedCurrency).toBe('$150.00');
      expect(className).toBe('font-semibold text-red-500');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles NaN and Infinity', () => {
      expect(formatNumber(NaN)).toBe('NaN');
      expect(formatNumber(Infinity)).toBe('Infinity');
      expect(formatNumber(-Infinity)).toBe('-Infinity');
    });

    test('handles very small numbers', () => {
      expect(formatNumber(0.0000001)).toBe('0.0000001');
      expect(formatPercentage(0.0000001)).toBe('0.00001%');
    });

    test('handles undefined and null in class utilities', () => {
      expect(() => cn(undefined as any)).not.toThrow();
      expect(() => clsx(null as any)).not.toThrow();
    });
  });
});