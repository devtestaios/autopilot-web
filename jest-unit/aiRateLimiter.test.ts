/**
 * Comprehensive test suite for AI Rate Limiter
 * Tests database integration, cost tracking, and rate limiting logic
 */

// Mock Supabase first
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            head: true,
            count: 'exact'
          }))
        }))
      })),
      insert: jest.fn(() => ({
        error: null
      }))
    }))
  }
}));

import { aiRateLimiter } from '../aiRateLimiter';
import { supabase } from '../supabase';

describe('AIRateLimiter', () => {
  let rateLimiter: any;

  beforeEach(() => {
    rateLimiter = aiRateLimiter;
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = aiRateLimiter;
      const instance2 = aiRateLimiter;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Rate Limiting Logic', () => {
    it('should allow requests within limits', async () => {
      // Mock database responses
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ count: 5, error: null }))
          }))
        }))
      });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining.daily).toBeGreaterThan(0);
    });

    it('should deny requests when daily limit exceeded', async () => {
      // Mock database responses for high usage
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ count: 25, error: null })) // Above trial daily limit of 20
          }))
        }))
      });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Daily limit exceeded');
    });

    it('should deny requests when cost limit exceeded', async () => {
      // Mock cost sum query
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ count: 5, error: null }))
          }))
        }))
      }).mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              data: [{ cost_usd: '1.50' }], // Above trial daily limit of $1.00
              error: null 
            }))
          }))
        }))
      });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Daily cost limit exceeded');
    });

    it('should handle invalid subscription tiers', async () => {
      const result = await rateLimiter.checkRateLimit('user-123', 'invalid-tier', 0.01);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Invalid subscription tier');
    });
  });

  describe('Usage Recording', () => {
    it('should record usage to database', async () => {
      const mockInsert = jest.fn(() => Promise.resolve({ error: null }));
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        insert: mockInsert
      });

      const record = {
        userId: 'user-123',
        tenantId: 'tenant-456',
        model: 'claude-3-sonnet',
        endpoint: '/api/chat',
        subscriptionTier: 'trial',
        inputTokens: 100,
        outputTokens: 50,
        costUSD: 0.015,
        timestamp: new Date()
      };

      await rateLimiter.recordUsage(record);

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: record.userId,
        company_id: record.tenantId,
        tenant_id: record.tenantId,
        model: record.model,
        endpoint: record.endpoint,
        subscription_tier: record.subscriptionTier,
        input_tokens: record.inputTokens,
        output_tokens: record.outputTokens,
        cost_usd: record.costUSD,
        request_status: 'success',
        created_at: record.timestamp.toISOString()
      });
    });

    it('should handle database errors gracefully', async () => {
      const mockInsert = jest.fn(() => Promise.resolve({ error: new Error('DB Error') }));
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        insert: mockInsert
      });

      const record = {
        userId: 'user-123',
        tenantId: 'tenant-456',
        model: 'claude-3-sonnet',
        endpoint: '/api/chat',
        subscriptionTier: 'trial',
        inputTokens: 100,
        outputTokens: 50,
        costUSD: 0.015,
        timestamp: new Date()
      };

      // Should not throw error
      await expect(rateLimiter.recordUsage(record)).resolves.not.toThrow();
    });
  });

  describe('Usage Statistics', () => {
    it('should return current usage statistics', async () => {
      // Mock database responses
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 5, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 15, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 45, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ 
                data: [{ cost_usd: '0.75' }], 
                error: null 
              }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ 
                data: [{ cost_usd: '2.25' }], 
                error: null 
              }))
            }))
          }))
        });

      const stats = await rateLimiter.getUserUsageStats('user-123');

      expect(stats).toEqual({
        hourly: 5,
        daily: 15,
        monthly: 45,
        dailyCost: 0.75,
        monthlyCost: 2.25
      });
    });

    it('should handle database errors in statistics', async () => {
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ error: new Error('DB Error') }))
          }))
        }))
      });

      const stats = await rateLimiter.getUserUsageStats('user-123');

      expect(stats).toEqual({
        hourly: 0,
        daily: 0,
        monthly: 0,
        dailyCost: 0,
        monthlyCost: 0
      });
    });
  });

  describe('Subscription Tier Limits', () => {
    const testCases = [
      {
        tier: 'trial',
        expected: { hourly: 5, daily: 20, monthly: 100 }
      },
      {
        tier: 'solo_professional',
        expected: { hourly: 10, daily: 50, monthly: 500 }
      },
      {
        tier: 'growth_team',
        expected: { hourly: 25, daily: 150, monthly: 1500 }
      },
      {
        tier: 'enterprise',
        expected: { hourly: 100, daily: 600, monthly: 6000 }
      }
    ];

    testCases.forEach(({ tier, expected }) => {
      it(`should enforce ${tier} limits correctly`, async () => {
        // Mock low usage
        const mockSupabase = supabase.from as jest.Mock;
        mockSupabase.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 1, error: null }))
            }))
          }))
        });

        const result = await rateLimiter.checkRateLimit('user-123', tier, 0.01);
        
        expect(result.allowed).toBe(true);
        expect(result.remaining.hourly).toBe(expected.hourly - 1);
        expect(result.remaining.daily).toBe(expected.daily - 1);
        expect(result.remaining.monthly).toBe(expected.monthly - 1);
      });
    });
  });

  describe('Global Limits', () => {
    it('should enforce global daily limits', async () => {
      // Mock high global usage
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 5, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              data: Array(500).fill({ cost_usd: '2.00' }), // $1000+ global daily cost
              error: null 
            }))
          }))
        });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Global daily limit exceeded');
    });

    it('should enforce global monthly limits', async () => {
      // Mock high global monthly usage
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => Promise.resolve({ count: 5, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              data: [{ cost_usd: '500.00' }], // Below daily limit
              error: null 
            }))
          }))
        })
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              data: Array(1250).fill({ cost_usd: '20.00' }), // $25000+ global monthly cost
              error: null 
            }))
          }))
        });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Global monthly limit exceeded');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        select: jest.fn(() => {
          throw new Error('Network error');
        })
      });

      const result = await rateLimiter.checkRateLimit('user-123', 'trial', 0.01);
      
      // Should still provide a response, likely denying the request for safety
      expect(result).toHaveProperty('allowed');
      expect(result).toHaveProperty('remaining');
    });

    it('should handle malformed database responses', async () => {
      const mockSupabase = supabase.from as jest.Mock;
      mockSupabase.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              count: null, 
              data: null, 
              error: null 
            }))
          }))
        }))
      });

      const stats = await rateLimiter.getUserUsageStats('user-123');
      
      expect(stats.daily).toBe(0);
      expect(stats.dailyCost).toBe(0);
    });
  });
});