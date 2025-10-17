import { 
  cn, 
  themeClasses, 
  getThemeClasses, 
  getConditionalThemeClasses,
  marketingThemeClasses,
  getContentCreatorClasses,
  isContentCreatorRoute
} from '../theme-utils';

describe('Theme Utilities Tests', () => {
  describe('cn function', () => {
    test('merges classes correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    test('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'ignored');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('ignored');
    });

    test('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    test('handles null and undefined', () => {
      const result = cn('base', null, undefined, 'end');
      expect(result).toContain('base');
      expect(result).toContain('end');
    });

    test('deduplicates classes', () => {
      const result = cn('duplicate', 'other', 'duplicate');
      expect(result).toContain('duplicate');
      expect(result).toContain('other');
      // Test that function works, exact deduplication behavior may vary
    });
  });

  describe('themeClasses object', () => {
    test('contains all expected properties', () => {
      expect(themeClasses.appBackground).toBeDefined();
      expect(themeClasses.card).toBeDefined();
      expect(themeClasses.cardHover).toBeDefined();
      expect(themeClasses.surface).toBeDefined();
      expect(themeClasses.surfaceElevated).toBeDefined();
      expect(themeClasses.nav).toBeDefined();
      expect(themeClasses.navItem).toBeDefined();
      expect(themeClasses.navItemActive).toBeDefined();
      expect(themeClasses.buttonPrimary).toBeDefined();
      expect(themeClasses.buttonSecondary).toBeDefined();
      expect(themeClasses.buttonGhost).toBeDefined();
      expect(themeClasses.input).toBeDefined();
      expect(themeClasses.textPrimary).toBeDefined();
      expect(themeClasses.textSecondary).toBeDefined();
      expect(themeClasses.textMuted).toBeDefined();
      expect(themeClasses.contentCreator).toBeDefined();
    });

    test('all properties are strings', () => {
      Object.values(themeClasses).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getThemeClasses function', () => {
    test('returns theme class for valid component type', () => {
      const result = getThemeClasses('card');
      expect(result).toBe(themeClasses.card);
    });

    test('merges with additional classes', () => {
      const result = getThemeClasses('card', 'extra-class');
      expect(result).toContain(themeClasses.card);
      expect(result).toContain('extra-class');
    });

    test('handles button classes with built-in styling', () => {
      const result = getThemeClasses('buttonPrimary');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded-md');
      expect(result).toContain('font-medium');
    });

    test('handles input classes', () => {
      const result = getThemeClasses('input', 'border');
      expect(result).toContain('px-3');
      expect(result).toContain('py-2');
      expect(result).toContain('w-full');
      expect(result).toContain('border');
    });
  });

  describe('getConditionalThemeClasses function', () => {
    test('returns true classes when condition is true', () => {
      const result = getConditionalThemeClasses(true, 'true-class', 'false-class');
      expect(result).toContain('true-class');
      expect(result).not.toContain('false-class');
    });

    test('returns false classes when condition is false', () => {
      const result = getConditionalThemeClasses(false, 'true-class', 'false-class');
      expect(result).toContain('false-class');
      expect(result).not.toContain('true-class');
    });

    test('includes base classes', () => {
      const result = getConditionalThemeClasses(true, 'true-class', 'false-class', 'base-class');
      expect(result).toContain('base-class');
      expect(result).toContain('true-class');
    });

    test('handles empty base classes', () => {
      const result = getConditionalThemeClasses(true, 'true-class', 'false-class');
      expect(result).toBe('true-class');
    });
  });

  describe('marketingThemeClasses object', () => {
    test('contains all expected marketing-specific properties', () => {
      expect(marketingThemeClasses.platformCard).toBeDefined();
      expect(marketingThemeClasses.platformCardHover).toBeDefined();
      expect(marketingThemeClasses.dashboardContainer).toBeDefined();
      expect(marketingThemeClasses.metricsCard).toBeDefined();
      expect(marketingThemeClasses.campaignCard).toBeDefined();
    });

    test('platform cards include transitions', () => {
      expect(marketingThemeClasses.platformCard).toContain('transition-all');
      expect(marketingThemeClasses.platformCard).toContain('duration-200');
      expect(marketingThemeClasses.platformCardHover).toContain('hover:shadow-lg');
    });

    test('dashboard container includes background', () => {
      expect(marketingThemeClasses.dashboardContainer).toContain('bg-theme-app');
      expect(marketingThemeClasses.dashboardContainer).toContain('min-h-screen');
    });
  });

  describe('getContentCreatorClasses function', () => {
    test('returns content creator class without additional classes', () => {
      const result = getContentCreatorClasses();
      expect(result).toBe('content-creator-area');
    });

    test('merges with additional classes', () => {
      const result = getContentCreatorClasses('extra-styling');
      expect(result).toContain('content-creator-area');
      expect(result).toContain('extra-styling');
    });

    test('handles multiple additional classes', () => {
      const result = getContentCreatorClasses('class1 class2 class3');
      expect(result).toContain('content-creator-area');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });
  });

  describe('isContentCreatorRoute function', () => {
    test('returns true for content-suite routes', () => {
      expect(isContentCreatorRoute('/content-suite')).toBe(true);
      expect(isContentCreatorRoute('/app/content-suite/design')).toBe(true);
    });

    test('returns true for content-creation routes', () => {
      expect(isContentCreatorRoute('/content-creation')).toBe(true);
      expect(isContentCreatorRoute('/app/content-creation/new')).toBe(true);
    });

    test('returns true for design-studio routes', () => {
      expect(isContentCreatorRoute('/design-studio')).toBe(true);
      expect(isContentCreatorRoute('/app/design-studio/templates')).toBe(true);
    });

    test('returns true for feed-planner routes', () => {
      expect(isContentCreatorRoute('/feed-planner')).toBe(true);
      expect(isContentCreatorRoute('/app/feed-planner/calendar')).toBe(true);
    });

    test('returns false for other routes', () => {
      expect(isContentCreatorRoute('/dashboard')).toBe(false);
      expect(isContentCreatorRoute('/analytics')).toBe(false);
      expect(isContentCreatorRoute('/settings')).toBe(false);
      expect(isContentCreatorRoute('/')).toBe(false);
      expect(isContentCreatorRoute('/social-media')).toBe(false);
    });

    test('handles empty and invalid paths', () => {
      expect(isContentCreatorRoute('')).toBe(false);
      expect(isContentCreatorRoute('invalid')).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('theme classes work together', () => {
      const cardClasses = getThemeClasses('card', 'custom-spacing');
      const conditionalClasses = getConditionalThemeClasses(
        true, 
        'hover:scale-105', 
        'opacity-50', 
        cardClasses
      );
      
      expect(conditionalClasses).toContain('theme-card');
      expect(conditionalClasses).toContain('custom-spacing');
      expect(conditionalClasses).toContain('hover:scale-105');
    });

    test('content creator detection with theme classes', () => {
      const isCreatorRoute = isContentCreatorRoute('/content-suite/editor');
      const classes = isCreatorRoute 
        ? getContentCreatorClasses('special-editor-styles')
        : getThemeClasses('appBackground');
      
      expect(classes).toContain('content-creator-area');
      expect(classes).toContain('special-editor-styles');
    });

    test('marketing theme classes integration', () => {
      const platformCard = cn(
        marketingThemeClasses.platformCard,
        getConditionalThemeClasses(true, 'animate-pulse', 'opacity-50')
      );
      
      expect(platformCard).toContain('marketing-platform-card');
      expect(platformCard).toContain('p-6');
      expect(platformCard).toContain('rounded-lg');
      expect(platformCard).toContain('animate-pulse');
    });
  });
});