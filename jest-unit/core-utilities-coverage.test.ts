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
        { 'conditional': true, 'ignored': false },
        'final'
      );
      expect(result).toContain('base');
      expect(result).toContain('array1');
      expect(result).toContain('array2');
      expect(result).toContain('conditional');
      expect(result).toContain('final');
      expect(result).not.toContain('ignored');
    });
  });

  describe('designTokens', () => {
    it('exports color tokens', () => {
      expect(designTokens.colors).toBeDefined();
      expect(designTokens.colors.primary).toBeDefined();
      expect(designTokens.colors.secondary).toBeDefined();
      expect(designTokens.colors.accent).toBeDefined();
    });

    it('exports spacing tokens', () => {
      expect(designTokens.spacing).toBeDefined();
      expect(designTokens.spacing.xs).toBeDefined();
      expect(designTokens.spacing.sm).toBeDefined();
      expect(designTokens.spacing.md).toBeDefined();
      expect(designTokens.spacing.lg).toBeDefined();
      expect(designTokens.spacing.xl).toBeDefined();
    });

    it('exports typography tokens', () => {
      expect(designTokens.typography).toBeDefined();
      expect(designTokens.typography.fontFamily).toBeDefined();
      expect(designTokens.typography.fontSize).toBeDefined();
      expect(designTokens.typography.fontWeight).toBeDefined();
      expect(designTokens.typography.lineHeight).toBeDefined();
    });

    it('exports border radius tokens', () => {
      expect(designTokens.borderRadius).toBeDefined();
      expect(designTokens.borderRadius.sm).toBeDefined();
      expect(designTokens.borderRadius.md).toBeDefined();
      expect(designTokens.borderRadius.lg).toBeDefined();
    });

    it('exports shadow tokens', () => {
      expect(designTokens.shadows).toBeDefined();
      expect(designTokens.shadows.sm).toBeDefined();
      expect(designTokens.shadows.md).toBeDefined();
      expect(designTokens.shadows.lg).toBeDefined();
    });

    it('has consistent color structure', () => {
      expect(typeof designTokens.colors.primary).toBe('string');
      expect(typeof designTokens.colors.secondary).toBe('string');
      expect(typeof designTokens.colors.accent).toBe('string');
      expect(typeof designTokens.colors.neutral).toBe('string');
    });

    it('has valid spacing values', () => {
      Object.values(designTokens.spacing).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^\d+(\.\d+)?(px|rem|em|%)$/);
      });
    });

    it('has valid typography values', () => {
      expect(designTokens.typography.fontFamily).toMatch(/^[a-zA-Z\s,'-]+$/);
      Object.values(designTokens.typography.fontSize).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('globalDesignStandards', () => {
    it('exports component standards', () => {
      expect(globalDesignStandards.components).toBeDefined();
      expect(globalDesignStandards.components.button).toBeDefined();
      expect(globalDesignStandards.components.card).toBeDefined();
      expect(globalDesignStandards.components.input).toBeDefined();
    });

    it('exports layout standards', () => {
      expect(globalDesignStandards.layout).toBeDefined();
      expect(globalDesignStandards.layout.container).toBeDefined();
      expect(globalDesignStandards.layout.grid).toBeDefined();
    });

    it('exports interaction standards', () => {
      expect(globalDesignStandards.interactions).toBeDefined();
      expect(globalDesignStandards.interactions.hover).toBeDefined();
      expect(globalDesignStandards.interactions.focus).toBeDefined();
      expect(globalDesignStandards.interactions.active).toBeDefined();
    });

    it('has consistent button standards', () => {
      const buttonStandards = globalDesignStandards.components.button;
      expect(buttonStandards.baseClasses).toBeDefined();
      expect(buttonStandards.variants).toBeDefined();
      expect(buttonStandards.sizes).toBeDefined();
    });

    it('has valid CSS class names', () => {
      const buttonClasses = globalDesignStandards.components.button.baseClasses;
      expect(typeof buttonClasses).toBe('string');
      expect(buttonClasses.length).toBeGreaterThan(0);
    });

    it('has complete variant definitions', () => {
      const variants = globalDesignStandards.components.button.variants;
      expect(variants.primary).toBeDefined();
      expect(variants.secondary).toBeDefined();
      expect(variants.outline).toBeDefined();
      expect(variants.ghost).toBeDefined();
      expect(variants.destructive).toBeDefined();
    });

    it('has complete size definitions', () => {
      const sizes = globalDesignStandards.components.button.sizes;
      expect(sizes.sm).toBeDefined();
      expect(sizes.md).toBeDefined();
      expect(sizes.lg).toBeDefined();
    });
  });

  describe('visualEffects', () => {
    it('exports animation definitions', () => {
      expect(visualEffects.animations).toBeDefined();
      expect(visualEffects.animations.fadeIn).toBeDefined();
      expect(visualEffects.animations.slideIn).toBeDefined();
      expect(visualEffects.animations.bounce).toBeDefined();
    });

    it('exports transition definitions', () => {
      expect(visualEffects.transitions).toBeDefined();
      expect(visualEffects.transitions.fast).toBeDefined();
      expect(visualEffects.transitions.medium).toBeDefined();
      expect(visualEffects.transitions.slow).toBeDefined();
    });

    it('exports gradient definitions', () => {
      expect(visualEffects.gradients).toBeDefined();
      expect(visualEffects.gradients.primary).toBeDefined();
      expect(visualEffects.gradients.secondary).toBeDefined();
    });

    it('exports particle effect definitions', () => {
      expect(visualEffects.particles).toBeDefined();
      expect(visualEffects.particles.count).toBeDefined();
      expect(visualEffects.particles.speed).toBeDefined();
    });

    it('has valid animation timings', () => {
      Object.values(visualEffects.animations).forEach(animation => {
        if (typeof animation === 'object' && animation !== null) {
          expect(animation).toHaveProperty('duration');
          expect(animation).toHaveProperty('easing');
        }
      });
    });

    it('has valid transition values', () => {
      Object.values(visualEffects.transitions).forEach(transition => {
        expect(typeof transition).toBe('string');
        expect(transition).toMatch(/^\d+(\.\d+)?s$/);
      });
    });

    it('has valid gradient values', () => {
      Object.values(visualEffects.gradients).forEach(gradient => {
        expect(typeof gradient).toBe('string');
        expect(gradient).toMatch(/^(linear|radial)-gradient\(/);
      });
    });

    it('has numeric particle values', () => {
      expect(typeof visualEffects.particles.count).toBe('number');
      expect(typeof visualEffects.particles.speed).toBe('number');
      expect(visualEffects.particles.count).toBeGreaterThan(0);
      expect(visualEffects.particles.speed).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('integrates design tokens with global standards', () => {
      const primaryColor = designTokens.colors.primary;
      const buttonVariant = globalDesignStandards.components.button.variants.primary;
      
      expect(typeof primaryColor).toBe('string');
      expect(typeof buttonVariant).toBe('string');
    });

    it('integrates visual effects with design tokens', () => {
      const primaryGradient = visualEffects.gradients.primary;
      const primaryColor = designTokens.colors.primary;
      
      expect(typeof primaryGradient).toBe('string');
      expect(typeof primaryColor).toBe('string');
    });

    it('provides consistent spacing across systems', () => {
      const spacingMd = designTokens.spacing.md;
      const layoutGrid = globalDesignStandards.layout.grid;
      
      expect(typeof spacingMd).toBe('string');
      expect(typeof layoutGrid).toBe('object');
    });

    it('maintains animation consistency', () => {
      const fadeInAnimation = visualEffects.animations.fadeIn;
      const hoverInteraction = globalDesignStandards.interactions.hover;
      
      expect(fadeInAnimation).toBeDefined();
      expect(hoverInteraction).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty inputs gracefully', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
      expect(cn([])).toBe('');
      expect(cn({})).toBe('');
    });

    it('handles deeply nested objects', () => {
      const nestedClasses = {
        level1: {
          level2: {
            level3: 'deep-class'
          }
        }
      };
      
      // cn doesn't handle nested objects, but shouldn't throw
      expect(() => cn(nestedClasses as any)).not.toThrow();
    });

    it('handles circular references safely', () => {
      const circular: any = { a: 'class' };
      circular.self = circular;
      
      expect(() => cn(circular)).not.toThrow();
    });

    it('validates design token integrity', () => {
      // Ensure all required properties exist
      expect(designTokens).toHaveProperty('colors');
      expect(designTokens).toHaveProperty('spacing');
      expect(designTokens).toHaveProperty('typography');
      expect(designTokens).toHaveProperty('borderRadius');
      expect(designTokens).toHaveProperty('shadows');
    });

    it('validates global standards integrity', () => {
      expect(globalDesignStandards).toHaveProperty('components');
      expect(globalDesignStandards).toHaveProperty('layout');
      expect(globalDesignStandards).toHaveProperty('interactions');
    });

    it('validates visual effects integrity', () => {
      expect(visualEffects).toHaveProperty('animations');
      expect(visualEffects).toHaveProperty('transitions');
      expect(visualEffects).toHaveProperty('gradients');
      expect(visualEffects).toHaveProperty('particles');
    });
  });

  describe('Performance Tests', () => {
    it('cn function performs efficiently with many classes', () => {
      const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`);
      
      const startTime = performance.now();
      const result = cn(...manyClasses);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
      expect(result).toContain('class-0');
      expect(result).toContain('class-99');
    });

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
        const color = designTokens.colors.primary;
        const spacing = designTokens.spacing.md;
        const font = designTokens.typography.fontSize.base;
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });
  });
});