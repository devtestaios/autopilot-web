import { cn } from '@/lib/utils';

describe('Utils Library - Advanced Testing', () => {
  describe('cn function comprehensive tests', () => {
    test('combines multiple class names correctly', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    test('handles conditional classes properly', () => {
      const isActive = true;
      const isDisabled = false;
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );
      
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
      expect(result).not.toContain('disabled-class');
    });

    test('filters out falsy values correctly', () => {
      const result = cn(
        'valid-class',
        null,
        undefined,
        false,
        '',
        'another-valid-class'
      );
      
      expect(result).toContain('valid-class');
      expect(result).toContain('another-valid-class');
      expect(result).not.toContain('null');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('false');
    });

    test('handles empty inputs gracefully', () => {
      expect(cn()).toBeDefined();
      expect(cn('')).toBeDefined();
      expect(cn(null)).toBeDefined();
      expect(cn(undefined)).toBeDefined();
      expect(typeof cn()).toBe('string');
    });

    test('handles objects with boolean values', () => {
      const result = cn({
        'always-present': true,
        'conditionally-present': true,
        'never-present': false,
      });
      
      expect(result).toContain('always-present');
      expect(result).toContain('conditionally-present');
      expect(result).not.toContain('never-present');
    });

    test('works with arrays of classes', () => {
      const classes = ['class1', 'class2'];
      const result = cn(classes, 'class3');
      
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    test('handles complex conditional logic', () => {
      const variant = 'primary';
      const size = 'large';
      const isLoading = false;
      
      const result = cn(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        size === 'small' && 'btn-sm',
        size === 'large' && 'btn-lg',
        isLoading && 'btn-loading'
      );
      
      expect(result).toContain('btn');
      expect(result).toContain('btn-primary');
      expect(result).toContain('btn-lg');
      expect(result).not.toContain('btn-secondary');
      expect(result).not.toContain('btn-sm');
      expect(result).not.toContain('btn-loading');
    });

    test('handles Tailwind CSS class patterns', () => {
      const result = cn(
        'bg-white',
        'dark:bg-gray-900',
        'text-gray-900',
        'dark:text-white',
        'hover:bg-gray-50',
        'focus:ring-2',
        'focus:ring-blue-500'
      );
      
      expect(result).toContain('bg-white');
      expect(result).toContain('dark:bg-gray-900');
      expect(result).toContain('text-gray-900');
      expect(result).toContain('dark:text-white');
      expect(result).toContain('hover:bg-gray-50');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('focus:ring-blue-500');
    });

    test('handles responsive design classes', () => {
      const result = cn(
        'w-full',
        'sm:w-1/2',
        'md:w-1/3',
        'lg:w-1/4',
        'xl:w-1/6'
      );
      
      expect(result).toContain('w-full');
      expect(result).toContain('sm:w-1/2');
      expect(result).toContain('md:w-1/3');
      expect(result).toContain('lg:w-1/4');
      expect(result).toContain('xl:w-1/6');
    });

    test('processes mixed input types', () => {
      const result = cn(
        'string-class',
        true && 'conditional-class',
        false && 'never-included',
        { 'object-class': true, 'false-class': false },
        ['array', 'classes']
      );
      
      expect(result).toContain('string-class');
      expect(result).toContain('conditional-class');
      expect(result).toContain('object-class');
      expect(result).toContain('array');
      expect(result).toContain('classes');
      expect(result).not.toContain('never-included');
      expect(result).not.toContain('false-class');
    });
  });

  describe('Utility function behavior', () => {
    test('returns a string result', () => {
      const result = cn('test');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('handles whitespace correctly', () => {
      const result = cn('  class1  ', '  class2  ');
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    test('processes special characters in class names', () => {
      const result = cn(
        'class-with-dash',
        'class_with_underscore',
        'class:with:colon',
        'class.with.dot'
      );
      
      expect(result).toContain('class-with-dash');
      expect(result).toContain('class_with_underscore');
      expect(result).toContain('class:with:colon');
      expect(result).toContain('class.with.dot');
    });

    test('works with component state patterns', () => {
      const state = {
        isActive: true,
        isHovered: false,
        isDisabled: false,
        isSelected: true
      };
      
      const result = cn(
        'component-base',
        state.isActive && 'state-active',
        state.isHovered && 'state-hovered',
        state.isDisabled && 'state-disabled',
        state.isSelected && 'state-selected',
        (state.isActive || state.isSelected) && 'state-engaged'
      );
      
      expect(result).toContain('component-base');
      expect(result).toContain('state-active');
      expect(result).toContain('state-selected');
      expect(result).toContain('state-engaged');
      expect(result).not.toContain('state-hovered');
      expect(result).not.toContain('state-disabled');
    });
  });

  describe('Performance and edge cases', () => {
    test('handles large numbers of class inputs', () => {
      const manyClasses = Array.from({ length: 50 }, (_, i) => `class-${i}`);
      const result = cn(...manyClasses);
      
      expect(result).toContain('class-0');
      expect(result).toContain('class-25');
      expect(result).toContain('class-49');
    });

    test('handles deeply nested conditions', () => {
      const config = {
        theme: 'dark',
        size: 'md',
        variant: 'primary',
        features: {
          hover: true,
          focus: true,
          disabled: false
        }
      };
      
      const result = cn(
        'base',
        config.theme === 'dark' && 'dark-theme',
        config.theme === 'light' && 'light-theme',
        config.size === 'sm' && 'size-small',
        config.size === 'md' && 'size-medium',
        config.size === 'lg' && 'size-large',
        config.variant === 'primary' && 'variant-primary',
        config.features.hover && !config.features.disabled && 'hover-enabled',
        config.features.focus && !config.features.disabled && 'focus-enabled'
      );
      
      expect(result).toContain('base');
      expect(result).toContain('dark-theme');
      expect(result).toContain('size-medium');
      expect(result).toContain('variant-primary');
      expect(result).toContain('hover-enabled');
      expect(result).toContain('focus-enabled');
      expect(result).not.toContain('light-theme');
      expect(result).not.toContain('size-small');
      expect(result).not.toContain('size-large');
    });

    test('maintains stability with repeated calls', () => {
      const inputs = ['base', 'modifier', true && 'conditional'];
      const result1 = cn(...inputs);
      const result2 = cn(...inputs);
      
      expect(result1).toBe(result2);
    });
  });
});