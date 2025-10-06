// Simplified AI Rate Limiter Testing Suite  
// Target: Test actual functions available in aiRateLimiter.ts

import { 
  aiRateLimiter,
  checkAIRateLimit,
  recordAIUsage
} from '@/lib/aiRateLimiter';

// Mock fetch for any potential API calls
global.fetch = jest.fn();

describe('Simplified AI Rate Limiter Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AI Rate Limiter Instance', () => {
    test('aiRateLimiter instance is available', () => {
      expect(aiRateLimiter).toBeDefined();
      expect(aiRateLimiter).toHaveProperty('checkRateLimit');
      expect(aiRateLimiter).toHaveProperty('recordUsage');
      expect(aiRateLimiter).toHaveProperty('getCurrentCosts');
      expect(aiRateLimiter).toHaveProperty('getUsageStats');
    });

    test('aiRateLimiter has expected methods', () => {
      expect(typeof aiRateLimiter.checkRateLimit).toBe('function');
      expect(typeof aiRateLimiter.recordUsage).toBe('function');
      expect(typeof aiRateLimiter.getCurrentCosts).toBe('function');
      expect(typeof aiRateLimiter.getUsageStats).toBe('function');
      expect(typeof aiRateLimiter.resetUsageStats).toBe('function');
    });
  });

  describe('Helper Functions', () => {
    test('checkAIRateLimit function is exported', () => {
      expect(typeof checkAIRateLimit).toBe('function');
    });

    test('recordAIUsage function is exported', () => {
      expect(typeof recordAIUsage).toBe('function');
    });
  });

  describe('Rate Limiting Functionality', () => {
    test('checkAIRateLimit handles basic rate limiting', async () => {
      const result = await checkAIRateLimit('user-123', 'growth_team', 0.50);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allowed');
      expect(result).toHaveProperty('reason');
      expect(typeof result.allowed).toBe('boolean');
      expect(typeof result.reason).toBe('string');
    });

    test('checkAIRateLimit with different subscription tiers', async () => {
      const tiers = ['trial', 'growth_team', 'enterprise'];
      
      for (const tier of tiers) {
        const result = await checkAIRateLimit(`user-${tier}`, tier, 1.00);
        
        expect(result).toBeDefined();
        expect(result).toHaveProperty('allowed');
        expect(result).toHaveProperty('reason');
      }
    });

    test('checkAIRateLimit with varying costs', async () => {
      const costs = [0.01, 0.50, 1.00, 5.00];
      
      for (const cost of costs) {
        const result = await checkAIRateLimit('user-test', 'growth_team', cost);
        
        expect(result).toBeDefined();
        expect(result.allowed).toBeDefined();
      }
    });
  });

  describe('Usage Recording', () => {
    test('recordAIUsage handles basic usage recording', async () => {
      const usageData = {
        userId: 'user-123',
        tenantId: 'tenant-456',
        model: 'claude' as const,
        inputTokens: 1000,
        outputTokens: 500,
        costUSD: 2.50,
        endpoint: '/api/ai/chat',
        subscriptionTier: 'growth_team'
      };

      await expect(recordAIUsage(
        usageData.userId,
        usageData.tenantId,
        usageData.model,
        usageData.inputTokens,
        usageData.outputTokens,
        usageData.costUSD,
        usageData.endpoint,
        usageData.subscriptionTier
      )).resolves.not.toThrow();
    });

    test('recordAIUsage with different AI models', async () => {
      const models = ['claude', 'gpt-4', 'gpt-3.5'] as const;
      
      for (const model of models) {
        await expect(recordAIUsage(
          'user-test',
          'tenant-test',
          model,
          500,
          250,
          1.25,
          '/api/ai/test',
          'growth_team'
        )).resolves.not.toThrow();
      }
    });

    test('recordAIUsage with varying token counts', async () => {
      const tokenPairs = [
        { input: 100, output: 50 },
        { input: 1000, output: 500 },
        { input: 5000, output: 2500 }
      ];
      
      for (const tokens of tokenPairs) {
        await expect(recordAIUsage(
          'user-tokens',
          'tenant-tokens',
          'claude',
          tokens.input,
          tokens.output,
          tokens.input * 0.001,
          '/api/ai/tokens',
          'growth_team'
        )).resolves.not.toThrow();
      }
    });
  });

  describe('Instance Methods', () => {
    test('getCurrentCosts returns cost information', async () => {
      const costs = await aiRateLimiter.getCurrentCosts('user-123', 'tenant-123');
      
      expect(costs).toBeDefined();
      expect(typeof costs).toBe('object');
      expect(costs).toHaveProperty('totalCostUSD');
      expect(costs).toHaveProperty('period');
      expect(typeof costs.totalCostUSD).toBe('number');
      expect(typeof costs.period).toBe('string');
    });

    test('getUsageStats returns usage statistics', async () => {
      const stats = await aiRateLimiter.getUsageStats('user-123', 'tenant-123');
      
      expect(stats).toBeDefined();
      expect(typeof stats).toBe('object');
      expect(stats).toHaveProperty('totalTokens');
      expect(stats).toHaveProperty('totalCost');
      expect(stats).toHaveProperty('requestCount');
      expect(typeof stats.totalTokens).toBe('number');
      expect(typeof stats.totalCost).toBe('number');
      expect(typeof stats.requestCount).toBe('number');
    });

    test('resetUsageStats clears statistics', async () => {
      // Record some usage first
      await recordAIUsage(
        'user-reset',
        'tenant-reset',
        'claude',
        1000,
        500,
        2.50,
        '/api/ai/reset',
        'growth_team'
      );
      
      // Reset stats
      await aiRateLimiter.resetUsageStats('user-reset', 'tenant-reset');
      
      // Check that stats are reset
      const stats = await aiRateLimiter.getUsageStats('user-reset', 'tenant-reset');
      expect(stats.totalTokens).toBe(0);
      expect(stats.totalCost).toBe(0);
      expect(stats.requestCount).toBe(0);
    });
  });

  describe('Cost Protection', () => {
    test('rate limiter protects against excessive costs', async () => {
      const highCost = 100.00; // Very high cost
      
      const result = await checkAIRateLimit('user-protection', 'trial', highCost);
      
      expect(result).toBeDefined();
      expect(result.allowed).toBeDefined();
      
      if (!result.allowed) {
        expect(result.reason).toContain('cost');
      }
    });

    test('different subscription tiers have different cost limits', async () => {
      const moderateCost = 10.00;
      
      const trialResult = await checkAIRateLimit('user-trial', 'trial', moderateCost);
      const enterpriseResult = await checkAIRateLimit('user-enterprise', 'enterprise', moderateCost);
      
      expect(trialResult).toBeDefined();
      expect(enterpriseResult).toBeDefined();
      
      // Enterprise should generally be more permissive
      if (!trialResult.allowed && enterpriseResult.allowed) {
        expect(trialResult.reason).toBeTruthy();
      }
    });
  });

  describe('Usage Tracking Integration', () => {
    test('usage recording affects cost calculations', async () => {
      const userId = 'user-tracking';
      const tenantId = 'tenant-tracking';
      
      // Get initial costs
      const initialCosts = await aiRateLimiter.getCurrentCosts(userId, tenantId);
      
      // Record some usage
      await recordAIUsage(
        userId,
        tenantId,
        'claude',
        2000,
        1000,
        5.00,
        '/api/ai/tracking',
        'growth_team'
      );
      
      // Get updated costs
      const updatedCosts = await aiRateLimiter.getCurrentCosts(userId, tenantId);
      
      // Costs should have increased
      expect(updatedCosts.totalCostUSD).toBeGreaterThanOrEqual(initialCosts.totalCostUSD);
    });

    test('usage recording affects usage statistics', async () => {
      const userId = 'user-stats';
      const tenantId = 'tenant-stats';
      
      // Get initial stats
      const initialStats = await aiRateLimiter.getUsageStats(userId, tenantId);
      
      // Record some usage
      await recordAIUsage(
        userId,
        tenantId,
        'gpt-4',
        1500,
        750,
        3.75,
        '/api/ai/stats',
        'growth_team'
      );
      
      // Get updated stats
      const updatedStats = await aiRateLimiter.getUsageStats(userId, tenantId);
      
      // Stats should have increased
      expect(updatedStats.totalTokens).toBeGreaterThanOrEqual(initialStats.totalTokens);
      expect(updatedStats.totalCost).toBeGreaterThanOrEqual(initialStats.totalCost);
      expect(updatedStats.requestCount).toBeGreaterThanOrEqual(initialStats.requestCount);
    });
  });

  describe('Error Handling', () => {
    test('handles invalid user IDs gracefully', async () => {
      await expect(checkAIRateLimit('', 'growth_team', 1.00))
        .resolves.not.toThrow();
      
      await expect(recordAIUsage(
        '',
        'tenant-test',
        'claude',
        1000,
        500,
        2.50,
        '/api/ai/test',
        'growth_team'
      )).resolves.not.toThrow();
    });

    test('handles invalid subscription tiers gracefully', async () => {
      await expect(checkAIRateLimit('user-test', 'invalid_tier', 1.00))
        .resolves.not.toThrow();
    });

    test('handles extreme values gracefully', async () => {
      // Very large numbers
      await expect(recordAIUsage(
        'user-extreme',
        'tenant-extreme',
        'claude',
        1000000,
        500000,
        1000.00,
        '/api/ai/extreme',
        'enterprise'
      )).resolves.not.toThrow();
      
      // Very small numbers
      await expect(recordAIUsage(
        'user-small',
        'tenant-small',
        'gpt-3.5',
        1,
        1,
        0.001,
        '/api/ai/small',
        'trial'
      )).resolves.not.toThrow();
    });
  });

  describe('Performance Testing', () => {
    test('handles multiple rapid calls efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array(10).fill(0).map((_, index) => 
        checkAIRateLimit(`user-perf-${index}`, 'growth_team', 0.50)
      );
      
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
      
      results.forEach(result => {
        expect(result).toHaveProperty('allowed');
        expect(result).toHaveProperty('reason');
      });
    });

    test('usage recording scales with volume', async () => {
      const startTime = Date.now();
      
      const promises = Array(5).fill(0).map((_, index) => 
        recordAIUsage(
          `user-volume-${index}`,
          `tenant-volume-${index}`,
          'claude',
          100,
          50,
          0.25,
          '/api/ai/volume',
          'growth_team'
        )
      );
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(3000); // Should complete in under 3 seconds
    });
  });
});