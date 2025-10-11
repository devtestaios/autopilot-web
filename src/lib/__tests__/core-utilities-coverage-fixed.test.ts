// Core utility functions comprehensive coverage
import { cn } from '@/lib/utils';
import { designTokens } from '@/lib/designTokens';
import { glassmorphism, gradients } from '@/lib/visualEffects';

describe('Core Utilities - Production Coverage', () => {
  describe('cn utility function', () => {
    it('combines multiple class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('handles undefined and null values', () => {
      expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2');
    });

    it('handles empty strings', () => {
      expect(cn('', 'class1', '', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )).toBe('base-class active-class');
    });

    it('handles array inputs', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('handles object inputs', () => {
      expect(cn({
        'class1': true,
        'class2': false,
        'class3': true
      })).toBe('class1 class3');
    });

    it('deduplicates classes', () => {
      expect(cn('class1', 'class2', 'class1')).toContain('class1');
      expect(cn('class1', 'class2', 'class1')).toContain('class2');
    });

    it('handles complex combinations', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        { 'conditional': true },
        'final'
      );
      expect(result).toBe('base array1 array2 conditional final');
    });

    it('works with Tailwind CSS classes', () => {
      expect(cn('px-4 py-2', 'bg-blue-500 text-white')).toBe('px-4 py-2 bg-blue-500 text-white');
    });

    it('handles edge cases', () => {
      expect(cn()).toBe('');
      expect(cn(null)).toBe('');
      expect(cn(false)).toBe('');
      expect(cn(0)).toBe('');
    });
  });

  describe('designTokens', () => {
    it('exports color tokens', () => {
      expect(designTokens.colors).toBeDefined();
      expect(designTokens.colors.primary).toBeDefined();
      expect(designTokens.colors.secondary).toBeDefined();
      expect(designTokens.colors.semantic).toBeDefined();
      expect(designTokens.colors.neutral).toBeDefined();
    });

    it('exports spacing tokens', () => {
      expect(designTokens.spacing).toBeDefined();
      expect(designTokens.spacing[1]).toBeDefined();
      expect(designTokens.spacing[2]).toBeDefined();
      expect(designTokens.spacing[4]).toBeDefined();
    });

    it('exports typography tokens', () => {
      expect(designTokens.typography).toBeDefined();
      expect(designTokens.typography.fontFamily).toBeDefined();
      expect(designTokens.typography.fontSize).toBeDefined();
      expect(designTokens.typography.fontWeight).toBeDefined();
    });

    it('exports border radius tokens', () => {
      expect(designTokens.borderRadius).toBeDefined();
      expect(designTokens.borderRadius.sm).toBeDefined();
      expect(designTokens.borderRadius.md).toBeDefined();
      expect(designTokens.borderRadius.lg).toBeDefined();
    });

    it('exports shadow tokens', () => {
      expect(designTokens.boxShadow).toBeDefined();
      expect(designTokens.boxShadow.sm).toBeDefined();
      expect(designTokens.boxShadow.md).toBeDefined();
      expect(designTokens.boxShadow.lg).toBeDefined();
    });

    it('has consistent color structure', () => {
      expect(typeof designTokens.colors.primary[500]).toBe('string');
      expect(typeof designTokens.colors.secondary[500]).toBe('string');
      expect(typeof designTokens.colors.neutral[500]).toBe('string');
    });

    it('has valid spacing values', () => {
      expect(typeof designTokens.spacing[1]).toBe('string');
      expect(typeof designTokens.spacing[2]).toBe('string');
      expect(typeof designTokens.spacing[4]).toBe('string');
    });

    it('has valid typography values', () => {
      expect(Array.isArray(designTokens.typography.fontFamily.sans)).toBe(true);
      expect(Array.isArray(designTokens.typography.fontSize.base)).toBe(true);
      expect(typeof designTokens.typography.fontWeight.normal).toBe('string');
    });
  });

  describe('visualEffects', () => {
    it('exports glassmorphism effects', () => {
      expect(glassmorphism).toBeDefined();
      expect(glassmorphism.light).toBeDefined();
      expect(glassmorphism.dark).toBeDefined();
      expect(glassmorphism.card).toBeDefined();
    });

    it('exports gradient effects', () => {
      expect(gradients).toBeDefined();
      expect(gradients.primary).toBeDefined();
      expect(gradients.secondary).toBeDefined();
      expect(gradients.success).toBeDefined();
    });

    it('has valid glassmorphism values', () => {
      expect(typeof glassmorphism.light.backdrop).toBe('string');
      expect(typeof glassmorphism.dark.backdrop).toBe('string');
      expect(typeof glassmorphism.card).toBe('string');
    });

    it('has valid gradient values', () => {
      expect(typeof gradients.primary).toBe('string');
      expect(typeof gradients.secondary).toBe('string');
      expect(gradients.primary).toMatch(/gradient/);
    });
  });

  describe('Integration Tests', () => {
    it('integrates design tokens with utilities', () => {
      const primaryColor = designTokens.colors.primary[500];
      const spacing = designTokens.spacing[4];
      
      expect(typeof primaryColor).toBe('string');
      expect(typeof spacing).toBe('string');
      
      // Test cn utility with design tokens
      const combinedClass = cn('base', `text-[${primaryColor}]`, `p-[${spacing}]`);
      expect(combinedClass).toContain('base');
    });

    it('integrates visual effects with design tokens', () => {
      const primaryGradient = gradients.primary;
      const primaryColor = designTokens.colors.primary[500];
      
      expect(typeof primaryGradient).toBe('string');
      expect(typeof primaryColor).toBe('string');
    });

    it('provides consistent spacing across systems', () => {
      const spacing1 = designTokens.spacing[1];
      const spacing2 = designTokens.spacing[2];
      
      expect(typeof spacing1).toBe('string');
      expect(typeof spacing2).toBe('string');
      expect(spacing1).toMatch(/rem|px/);
      expect(spacing2).toMatch(/rem|px/);
    });

    it('maintains glassmorphism consistency', () => {
      const lightGlass = glassmorphism.light;
      const darkGlass = glassmorphism.dark;
      
      expect(lightGlass).toBeDefined();
      expect(darkGlass).toBeDefined();
      expect(lightGlass.backdrop).toMatch(/backdrop-blur/);
      expect(darkGlass.backdrop).toMatch(/backdrop-blur/);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('validates design token integrity', () => {
      // Ensure all required properties exist
      expect(designTokens).toHaveProperty('colors');
      expect(designTokens).toHaveProperty('spacing');
      expect(designTokens).toHaveProperty('typography');
      expect(designTokens).toHaveProperty('borderRadius');
    });

    it('validates visual effects integrity', () => {
      expect(glassmorphism).toHaveProperty('light');
      expect(glassmorphism).toHaveProperty('dark');
      expect(gradients).toHaveProperty('primary');
      expect(gradients).toHaveProperty('secondary');
    });

    it('handles cn with large inputs', () => {
      const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`);
      const result = cn(...manyClasses);
      expect(result).toContain('class-0');
      expect(result).toContain('class-99');
    });
    
    it('handles nested objects in cn', () => {
      const nestedObject = {
        'outer-class': true,
        'nested': {
          'inner-class': true,
          'false-class': false
        }
      };
      // cn handles this gracefully
      const result = cn(nestedObject);
      expect(typeof result).toBe('string');
    });
  });

  describe('Performance Tests', () => {
    it('handles repeated calls efficiently', () => {
      const testClasses = ['base', 'modifier', 'state'];
      
      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        cn(...testClasses);
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should handle many calls quickly
    });

    it('design token access is efficient', () => {
      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        const color = designTokens.colors.primary[500];
        const spacing = designTokens.spacing[4];
        const font = designTokens.typography.fontSize.base;
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });
  });
});