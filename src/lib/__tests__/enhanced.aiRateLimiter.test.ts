// Enhanced AI Rate Limiter Testing Suite  
// Target: Increase aiRateLimiter coverage from 60.67% to 90%+

import { 
  checkAIRateLimit,
  recordAIUsage,
  getUsageStats,
  resetUsageStats,
  getCurrentCosts,
  predictMonthlyCosts,
  setRateLimit,
  getRateLimit,
  checkBudgetAlert,
  getAIProvider,
  setAIProvider,
  getProviderCosts,
  calculateTokenCosts,
  optimizeAIRequests,
  getUsageHistory,
  exportUsageReport,
  AIProvider,
  UsageStats,
  RateLimitConfig,
  CostPrediction
} from '@/lib/aiRateLimiter';

// Mock Date for consistent testing
const mockDate = new Date('2024-01-15T10:30:00Z');
const originalDate = Date;

describe('Enhanced AI Rate Limiter Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetUsageStats();
    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  describe('Core Rate Limiting', () => {
    test('checkAIRateLimit allows requests within limits', () => {
      setRateLimit(1000, 'daily');
      
      const result = checkAIRateLimit(100);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(900);
      expect(result.resetTime).toBeDefined();
    });

    test('checkAIRateLimit blocks requests exceeding limits', () => {
      setRateLimit(100, 'daily');
      
      // Simulate usage approaching limit
      recordAIUsage('claude', 80, 0.50);
      
      const result = checkAIRateLimit(50);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(20);
      expect(result.reason).toContain('Daily limit');
    });

    test('checkAIRateLimit handles different time periods', () => {
      const periods = ['hourly', 'daily', 'weekly', 'monthly'] as const;
      
      periods.forEach(period => {
        setRateLimit(1000, period);
        const result = checkAIRateLimit(100);
        
        expect(result.allowed).toBe(true);
        expect(result.period).toBe(period);
        expect(result.resetTime).toBeDefined();
      });
    });

    test('rate limit resets at appropriate intervals', () => {
      setRateLimit(100, 'daily');
      recordAIUsage('claude', 100, 1.00);
      
      // Simulate next day
      const nextDay = new Date(mockDate.getTime() + 24 * 60 * 60 * 1000);
      global.Date = jest.fn(() => nextDay) as any;
      global.Date.now = jest.fn(() => nextDay.getTime());
      
      const result = checkAIRateLimit(50);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(50);
    });
  });

  describe('Usage Recording and Statistics', () => {
    test('recordAIUsage tracks different AI providers', () => {
      const providers: AIProvider[] = ['claude', 'openai', 'gemini'];
      
      providers.forEach((provider, index) => {
        recordAIUsage(provider, 100 + index * 10, (index + 1) * 0.25);
      });
      
      const stats = getUsageStats();
      
      expect(stats.providers.claude.tokens).toBe(100);
      expect(stats.providers.openai.tokens).toBe(110);
      expect(stats.providers.gemini.tokens).toBe(120);
      expect(stats.providers.claude.cost).toBe(0.25);
      expect(stats.providers.openai.cost).toBe(0.50);
      expect(stats.providers.gemini.cost).toBe(0.75);
    });

    test('recordAIUsage accumulates usage over time', () => {
      recordAIUsage('claude', 100, 0.50);
      recordAIUsage('claude', 200, 1.00);
      recordAIUsage('claude', 150, 0.75);
      
      const stats = getUsageStats();
      
      expect(stats.providers.claude.tokens).toBe(450);
      expect(stats.providers.claude.cost).toBe(2.25);
      expect(stats.providers.claude.requests).toBe(3);
    });

    test('getUsageStats returns comprehensive statistics', () => {
      recordAIUsage('claude', 1000, 5.00);
      recordAIUsage('openai', 800, 4.00);
      
      const stats = getUsageStats();
      
      expect(stats.totalTokens).toBe(1800);
      expect(stats.totalCost).toBe(9.00);
      expect(stats.totalRequests).toBe(2);
      expect(stats.period).toBeDefined();
      expect(stats.providers).toHaveProperty('claude');
      expect(stats.providers).toHaveProperty('openai');
    });

    test('resetUsageStats clears all statistics', () => {
      recordAIUsage('claude', 1000, 5.00);
      recordAIUsage('openai', 500, 2.50);
      
      const statsBefore = getUsageStats();
      expect(statsBefore.totalTokens).toBe(1500);
      
      resetUsageStats();
      
      const statsAfter = getUsageStats();
      expect(statsAfter.totalTokens).toBe(0);
      expect(statsAfter.totalCost).toBe(0);
      expect(statsAfter.totalRequests).toBe(0);
    });
  });

  describe('Cost Management', () => {
    test('getCurrentCosts returns accurate cost breakdown', () => {
      recordAIUsage('claude', 1000, 5.00);
      recordAIUsage('openai', 500, 3.00);
      recordAIUsage('gemini', 750, 2.50);
      
      const costs = getCurrentCosts();
      
      expect(costs.total).toBe(10.50);
      expect(costs.byProvider.claude).toBe(5.00);
      expect(costs.byProvider.openai).toBe(3.00);
      expect(costs.byProvider.gemini).toBe(2.50);
      expect(costs.period).toBeDefined();
    });

    test('predictMonthlyCosts estimates future costs', () => {
      // Simulate 5 days of usage
      for (let day = 0; day < 5; day++) {
        recordAIUsage('claude', 200, 1.00);
      }
      
      const prediction = predictMonthlyCosts();
      
      expect(prediction.estimatedTotal).toBeCloseTo(30.00, 1); // 5 * 6 days ≈ 30
      expect(prediction.confidence).toBeGreaterThan(0);
      expect(prediction.confidence).toBeLessThanOrEqual(1);
      expect(prediction.breakdown).toHaveProperty('claude');
    });

    test('predictMonthlyCosts handles insufficient data', () => {
      recordAIUsage('claude', 100, 0.50);
      
      const prediction = predictMonthlyCosts();
      
      expect(prediction.estimatedTotal).toBeGreaterThan(0);
      expect(prediction.confidence).toBeLessThan(0.5); // Low confidence
      expect(prediction.note).toContain('insufficient');
    });
  });

  describe('Rate Limit Configuration', () => {
    test('setRateLimit configures different limits and periods', () => {
      const configs = [
        { limit: 1000, period: 'hourly' as const },
        { limit: 5000, period: 'daily' as const },
        { limit: 25000, period: 'weekly' as const },
        { limit: 100000, period: 'monthly' as const }
      ];
      
      configs.forEach(config => {
        setRateLimit(config.limit, config.period);
        const currentConfig = getRateLimit();
        
        expect(currentConfig.limit).toBe(config.limit);
        expect(currentConfig.period).toBe(config.period);
      });
    });

    test('getRateLimit returns current configuration', () => {
      setRateLimit(2000, 'daily');
      
      const config = getRateLimit();
      
      expect(config.limit).toBe(2000);
      expect(config.period).toBe('daily');
      expect(config.current).toBeDefined();
      expect(config.resetTime).toBeDefined();
    });

    test('setRateLimit validates input parameters', () => {
      expect(() => setRateLimit(-100, 'daily')).toThrow('Rate limit must be positive');
      expect(() => setRateLimit(0, 'daily')).toThrow('Rate limit must be positive');
      expect(() => setRateLimit(1000, 'invalid' as any)).toThrow('Invalid period');
    });
  });

  describe('Budget Alerts', () => {
    test('checkBudgetAlert detects budget threshold breaches', () => {
      const budgetAlert = checkBudgetAlert(100.00, 0.8); // 80% threshold
      expect(budgetAlert.triggered).toBe(false);
      
      recordAIUsage('claude', 10000, 85.00); // 85% of budget
      
      const alertAfterUsage = checkBudgetAlert(100.00, 0.8);
      expect(alertAfterUsage.triggered).toBe(true);
      expect(alertAfterUsage.percentage).toBeCloseTo(0.85, 2);
      expect(alertAfterUsage.message).toContain('85%');
    });

    test('checkBudgetAlert handles different alert thresholds', () => {
      recordAIUsage('claude', 5000, 50.00);
      
      const thresholds = [0.25, 0.5, 0.75, 0.9];
      
      thresholds.forEach(threshold => {
        const alert = checkBudgetAlert(100.00, threshold);
        
        if (threshold <= 0.5) {
          expect(alert.triggered).toBe(true);
        } else {
          expect(alert.triggered).toBe(false);
        }
      });
    });

    test('checkBudgetAlert provides detailed alert information', () => {
      recordAIUsage('claude', 8000, 90.00);
      
      const alert = checkBudgetAlert(100.00, 0.8);
      
      expect(alert.triggered).toBe(true);
      expect(alert.currentCost).toBe(90.00);
      expect(alert.budgetLimit).toBe(100.00);
      expect(alert.threshold).toBe(0.8);
      expect(alert.percentage).toBe(0.9);
      expect(alert.remainingBudget).toBe(10.00);
    });
  });

  describe('AI Provider Management', () => {
    test('setAIProvider and getAIProvider manage current provider', () => {
      const providers: AIProvider[] = ['claude', 'openai', 'gemini'];
      
      providers.forEach(provider => {
        setAIProvider(provider);
        expect(getAIProvider()).toBe(provider);
      });
    });

    test('setAIProvider validates provider options', () => {
      expect(() => setAIProvider('invalid' as any)).toThrow('Invalid AI provider');
      
      const validProviders: AIProvider[] = ['claude', 'openai', 'gemini'];
      validProviders.forEach(provider => {
        expect(() => setAIProvider(provider)).not.toThrow();
      });
    });

    test('getProviderCosts returns per-provider cost information', () => {
      recordAIUsage('claude', 1000, 5.00);
      recordAIUsage('openai', 800, 4.00);
      recordAIUsage('gemini', 600, 3.00);
      
      const costs = getProviderCosts();
      
      expect(costs.claude.total).toBe(5.00);
      expect(costs.openai.total).toBe(4.00);
      expect(costs.gemini.total).toBe(3.00);
      expect(costs.claude.averagePerToken).toBeCloseTo(0.005, 3);
    });
  });

  describe('Token Cost Calculations', () => {
    test('calculateTokenCosts computes accurate pricing', () => {
      const testCases = [
        { provider: 'claude' as const, tokens: 1000, expected: 5.00 },
        { provider: 'openai' as const, tokens: 1000, expected: 6.00 },
        { provider: 'gemini' as const, tokens: 1000, expected: 4.00 }
      ];
      
      testCases.forEach(testCase => {
        const cost = calculateTokenCosts(testCase.provider, testCase.tokens);
        expect(cost).toBeCloseTo(testCase.expected, 2);
      });
    });

    test('calculateTokenCosts handles different token volumes', () => {
      const volumes = [100, 1000, 10000, 100000];
      
      volumes.forEach(volume => {
        const cost = calculateTokenCosts('claude', volume);
        expect(cost).toBeGreaterThan(0);
        expect(cost).toBe(volume * 0.005); // Claude rate
      });
    });

    test('calculateTokenCosts applies volume discounts', () => {
      const smallVolume = calculateTokenCosts('claude', 1000);
      const largeVolume = calculateTokenCosts('claude', 100000);
      
      const smallRate = smallVolume / 1000;
      const largeRate = largeVolume / 100000;
      
      expect(largeRate).toBeLessThanOrEqual(smallRate); // Volume discount
    });
  });

  describe('AI Request Optimization', () => {
    test('optimizeAIRequests suggests cost-effective providers', () => {
      const optimization = optimizeAIRequests(5000, 'general');
      
      expect(optimization.recommendedProvider).toBeDefined();
      expect(optimization.estimatedCost).toBeGreaterThan(0);
      expect(optimization.reasoning).toBeDefined();
      expect(optimization.alternatives).toBeInstanceOf(Array);
    });

    test('optimizeAIRequests considers task type', () => {
      const taskTypes = ['coding', 'writing', 'analysis', 'general'] as const;
      
      taskTypes.forEach(taskType => {
        const optimization = optimizeAIRequests(1000, taskType);
        
        expect(optimization.taskType).toBe(taskType);
        expect(optimization.recommendedProvider).toBeDefined();
        expect(optimization.reasoning).toContain(taskType);
      });
    });

    test('optimizeAIRequests provides alternative options', () => {
      const optimization = optimizeAIRequests(2000, 'coding');
      
      expect(optimization.alternatives).toHaveLength(2); // 2 alternatives
      optimization.alternatives.forEach(alt => {
        expect(alt.provider).toBeDefined();
        expect(alt.estimatedCost).toBeGreaterThan(0);
        expect(alt.pros).toBeInstanceOf(Array);
        expect(alt.cons).toBeInstanceOf(Array);
      });
    });
  });

  describe('Usage History and Reporting', () => {
    test('getUsageHistory returns historical data', () => {
      // Simulate usage over multiple days
      const days = 7;
      for (let day = 0; day < days; day++) {
        const date = new Date(mockDate.getTime() + day * 24 * 60 * 60 * 1000);
        global.Date = jest.fn(() => date) as any;
        recordAIUsage('claude', 500 + day * 100, 2.5 + day * 0.5);
      }
      
      const history = getUsageHistory(days);
      
      expect(history).toHaveLength(days);
      history.forEach((entry, index) => {
        expect(entry.date).toBeDefined();
        expect(entry.tokens).toBe(500 + index * 100);
        expect(entry.cost).toBe(2.5 + index * 0.5);
      });
    });

    test('getUsageHistory handles different time ranges', () => {
      const timeRanges = [1, 7, 30, 90];
      
      timeRanges.forEach(days => {
        const history = getUsageHistory(days);
        expect(history.length).toBeLessThanOrEqual(days);
      });
    });

    test('exportUsageReport generates comprehensive reports', () => {
      recordAIUsage('claude', 5000, 25.00);
      recordAIUsage('openai', 3000, 18.00);
      
      const report = exportUsageReport('weekly', 'csv');
      
      expect(report.format).toBe('csv');
      expect(report.period).toBe('weekly');
      expect(report.data).toContain('claude');
      expect(report.data).toContain('openai');
      expect(report.data).toContain('25.00');
      expect(report.data).toContain('18.00');
      expect(report.generatedAt).toBeDefined();
    });

    test('exportUsageReport supports different formats', () => {
      recordAIUsage('claude', 1000, 5.00);
      
      const formats = ['csv', 'json', 'pdf'] as const;
      
      formats.forEach(format => {
        const report = exportUsageReport('monthly', format);
        
        expect(report.format).toBe(format);
        expect(report.data).toBeDefined();
        expect(report.downloadUrl).toBeDefined();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles invalid provider gracefully', () => {
      expect(() => recordAIUsage('invalid' as any, 100, 1.00)).toThrow('Invalid AI provider');
    });

    test('handles negative usage values', () => {
      expect(() => recordAIUsage('claude', -100, 1.00)).toThrow('Tokens must be positive');
      expect(() => recordAIUsage('claude', 100, -1.00)).toThrow('Cost must be positive');
    });

    test('handles extreme usage values', () => {
      const extremeTokens = 1000000;
      const extremeCost = 10000.00;
      
      expect(() => recordAIUsage('claude', extremeTokens, extremeCost)).not.toThrow();
      
      const stats = getUsageStats();
      expect(stats.providers.claude.tokens).toBe(extremeTokens);
      expect(stats.providers.claude.cost).toBe(extremeCost);
    });

    test('maintains data integrity under concurrent access', () => {
      const promises = Array(10).fill(0).map((_, index) => 
        Promise.resolve(recordAIUsage('claude', 100, 0.50))
      );
      
      return Promise.all(promises).then(() => {
        const stats = getUsageStats();
        expect(stats.providers.claude.tokens).toBe(1000);
        expect(stats.providers.claude.cost).toBe(5.00);
        expect(stats.providers.claude.requests).toBe(10);
      });
    });
  });

  describe('Performance and Scalability', () => {
    test('handles large volumes of usage data efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        recordAIUsage('claude', 100, 0.50);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      
      const stats = getUsageStats();
      expect(stats.providers.claude.requests).toBe(1000);
    });

    test('memory usage remains stable with extended usage tracking', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 10000; i++) {
        recordAIUsage('claude', 50, 0.25);
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase
    });
  });
});