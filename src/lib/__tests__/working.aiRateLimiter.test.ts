import {
  checkAIRateLimit,
  recordAIUsage,
  aiRateLimiter,
  RateLimitResult,
  AIUsageRecord,
  RateLimitConfig
} from '@/lib/aiRateLimiter';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            data: [],
            error: null
          }))
        }))
      })),
      insert: jest.fn(() => ({
        data: null,
        error: null
      }))
    }))
  }
}));

describe('AI Rate Limiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAIRateLimit', () => {
    test('allows request within limits for trial user', async () => {
      const result = await checkAIRateLimit('user123', 'trial', 0.50);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeDefined();
      expect(result.resetTime).toBeDefined();
      expect(result.costRemaining).toBeDefined();
    });

    test('allows request within limits for enterprise user', async () => {
      const result = await checkAIRateLimit('user456', 'enterprise', 5.00);

      expect(result.allowed).toBe(true);
      expect(result.remaining.hourly).toBeGreaterThan(0);
      expect(result.remaining.daily).toBeGreaterThan(0);
      expect(result.remaining.monthly).toBeGreaterThan(0);
    });

    test('handles estimated cost parameter', async () => {
      const result = await checkAIRateLimit('user789', 'solo_professional');

      expect(result.allowed).toBe(true);
      expect(result.costRemaining.daily).toBeGreaterThan(0);
      expect(result.costRemaining.monthly).toBeGreaterThan(0);
    });
  });

  describe('recordAIUsage', () => {
    test('records usage with all required parameters', async () => {
      const mockUsage = {
        userId: 'user123',
        tenantId: 'tenant456',
        model: 'claude' as const,
        inputTokens: 100,
        outputTokens: 50,
        costUSD: 0.75,
        endpoint: '/api/ai/chat',
        subscriptionTier: 'trial'
      };

      await expect(recordAIUsage(
        mockUsage.userId,
        mockUsage.tenantId,
        mockUsage.model,
        mockUsage.inputTokens,
        mockUsage.outputTokens,
        mockUsage.costUSD,
        mockUsage.endpoint,
        mockUsage.subscriptionTier
      )).resolves.not.toThrow();
    });

    test('records usage without tenant ID', async () => {
      await expect(recordAIUsage(
        'user123',
        undefined,
        'gpt-4',
        200,
        100,
        1.50,
        '/api/ai/generate',
        'enterprise'
      )).resolves.not.toThrow();
    });
  });

  describe('aiRateLimiter instance', () => {
    test('provides singleton instance', () => {
      expect(aiRateLimiter).toBeDefined();
      expect(typeof aiRateLimiter).toBe('object');
    });
  });

  describe('Type exports', () => {
    test('RateLimitResult interface is properly typed', () => {
      const mockResult: RateLimitResult = {
        allowed: true,
        remaining: {
          hourly: 10,
          daily: 50,
          monthly: 500
        },
        resetTime: {
          hourly: new Date(),
          daily: new Date(),
          monthly: new Date()
        },
        costRemaining: {
          daily: 5.00,
          monthly: 50.00
        }
      };

      expect(mockResult.allowed).toBe(true);
      expect(mockResult.remaining).toBeDefined();
      expect(mockResult.resetTime).toBeDefined();
      expect(mockResult.costRemaining).toBeDefined();
    });

    test('AIUsageRecord interface is properly typed', () => {
      const mockRecord: AIUsageRecord = {
        userId: 'user123',
        tenantId: 'tenant456',
        timestamp: new Date(),
        model: 'claude',
        inputTokens: 100,
        outputTokens: 50,
        costUSD: 0.75,
        endpoint: '/api/ai/chat',
        subscriptionTier: 'trial'
      };

      expect(mockRecord.userId).toBe('user123');
      expect(mockRecord.model).toBe('claude');
      expect(mockRecord.inputTokens).toBe(100);
    });
  });
});