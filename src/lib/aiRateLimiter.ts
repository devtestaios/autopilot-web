/**
 * AI Rate Limiting System
 * Prevents AI cost overrun that could bankrupt the platform
 * Implements per-user, per-tenant, and global rate limiting
 */

import { supabase } from '@/lib/supabase';

export interface RateLimitConfig {
  // Per-user limits by subscription tier
  userLimits: {
    trial: { hourly: 5, daily: 20, monthly: 100 };
    solo_professional: { hourly: 10, daily: 50, monthly: 500 };
    growth_team: { hourly: 25, daily: 150, monthly: 1500 };
    professional_agency: { hourly: 50, daily: 300, monthly: 3000 };
    enterprise: { hourly: 100, daily: 600, monthly: 6000 };
    enterprise_plus: { hourly: 200, daily: 1200, monthly: 12000 };
  };
  
  // Cost limits (USD) to prevent financial disaster
  costLimits: {
    perUser: {
      trial: { daily: 1.00, monthly: 10.00 };
      solo_professional: { daily: 5.00, monthly: 50.00 };
      growth_team: { daily: 15.00, monthly: 150.00 };
      professional_agency: { daily: 30.00, monthly: 300.00 };
      enterprise: { daily: 60.00, monthly: 600.00 };
      enterprise_plus: { daily: 120.00, monthly: 1200.00 };
    };
    global: {
      daily: 1000.00; // Platform-wide daily limit
      monthly: 25000.00; // Platform-wide monthly limit
    };
  };
}

export interface AIUsageRecord {
  userId: string;
  tenantId?: string;
  timestamp: Date;
  model: 'claude' | 'gpt-4' | 'gpt-3.5';
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  endpoint: string;
  subscriptionTier: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: {
    hourly: number;
    daily: number;
    monthly: number;
  };
  resetTime: {
    hourly: Date;
    daily: Date;
    monthly: Date;
  };
  costRemaining: {
    daily: number;
    monthly: number;
  };
  reason?: string;
}

class AIRateLimiter {
  private static instance: AIRateLimiter;
  private config: RateLimitConfig;

  constructor() {
    this.config = {
      userLimits: {
        trial: { hourly: 5, daily: 20, monthly: 100 },
        solo_professional: { hourly: 10, daily: 50, monthly: 500 },
        growth_team: { hourly: 25, daily: 150, monthly: 1500 },
        professional_agency: { hourly: 50, daily: 300, monthly: 3000 },
        enterprise: { hourly: 100, daily: 600, monthly: 6000 },
        enterprise_plus: { hourly: 200, daily: 1200, monthly: 12000 }
      },
      costLimits: {
        perUser: {
          trial: { daily: 1.00, monthly: 10.00 },
          solo_professional: { daily: 5.00, monthly: 50.00 },
          growth_team: { daily: 15.00, monthly: 150.00 },
          professional_agency: { daily: 30.00, monthly: 300.00 },
          enterprise: { daily: 60.00, monthly: 600.00 },
          enterprise_plus: { daily: 120.00, monthly: 1200.00 }
        },
        global: {
          daily: 1000.00,
          monthly: 25000.00
        }
      }
    };
  }

  static getInstance(): AIRateLimiter {
    if (!AIRateLimiter.instance) {
      AIRateLimiter.instance = new AIRateLimiter();
    }
    return AIRateLimiter.instance;
  }

  /**
   * Check if user can make AI request
   */
  async checkRateLimit(
    userId: string, 
    subscriptionTier: string, 
    estimatedCost: number = 0.01
  ): Promise<RateLimitResult> {
    const now = new Date();

    // Get time boundaries
    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage from database instead of memory
    const [hourlyUsage, dailyUsage, monthlyUsage, dailyCost, monthlyCost] = await Promise.all([
      this.getUsageCount(userId, hourStart),
      this.getUsageCount(userId, dayStart),
      this.getUsageCount(userId, monthStart),
      this.getCostSum(userId, dayStart),
      this.getCostSum(userId, monthStart)
    ]);

    // Get limits for subscription tier
    const limits = this.config.userLimits[subscriptionTier as keyof typeof this.config.userLimits];
    const costLimits = this.config.costLimits.perUser[subscriptionTier as keyof typeof this.config.costLimits.perUser];

    if (!limits || !costLimits) {
      return {
        allowed: false,
        remaining: { hourly: 0, daily: 0, monthly: 0 },
        resetTime: {
          hourly: new Date(hourStart.getTime() + 60 * 60 * 1000),
          daily: new Date(dayStart.getTime() + 24 * 60 * 60 * 1000),
          monthly: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
        },
        costRemaining: { daily: 0, monthly: 0 },
        reason: 'Invalid subscription tier'
      };
    }

    // Check usage limits
    if (hourlyUsage >= limits.hourly) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Hourly limit exceeded');
    }

    if (dailyUsage >= limits.daily) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Daily limit exceeded');
    }

    if (monthlyUsage >= limits.monthly) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Monthly limit exceeded');
    }

    // Check cost limits
    if (dailyCost + estimatedCost > costLimits.daily) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Daily cost limit exceeded');
    }

    if (monthlyCost + estimatedCost > costLimits.monthly) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Monthly cost limit exceeded');
    }

    // Check global limits
    const globalDailyCost = await this.getGlobalDailyCost();
    const globalMonthlyCost = await this.getGlobalMonthlyCost();

    if (globalDailyCost + estimatedCost > this.config.costLimits.global.daily) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Global daily limit exceeded');
    }

    if (globalMonthlyCost + estimatedCost > this.config.costLimits.global.monthly) {
      return this.createLimitResult(false, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart, 'Global monthly limit exceeded');
    }

    // Request allowed
    return this.createLimitResult(true, limits, hourlyUsage, dailyUsage, monthlyUsage, costLimits, dailyCost, monthlyCost, hourStart, dayStart, monthStart);
  }

  /**
   * Record AI usage after successful request
   */
  async recordUsage(record: AIUsageRecord): Promise<void> {
    // Persist directly to database instead of in-memory storage
    await this.persistToDatabase(record);
  }

  /**
   * Get current usage statistics for user
   */
  async getUserUsageStats(userId: string): Promise<{
    hourly: number;
    daily: number;
    monthly: number;
    dailyCost: number;
    monthlyCost: number;
  }> {
    const now = new Date();
    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [hourly, daily, monthly, dailyCost, monthlyCost] = await Promise.all([
      this.getUsageCount(userId, hourStart),
      this.getUsageCount(userId, dayStart),
      this.getUsageCount(userId, monthStart),
      this.getCostSum(userId, dayStart),
      this.getCostSum(userId, monthStart)
    ]);

    return {
      hourly,
      daily,
      monthly,
      dailyCost,
      monthlyCost
    };
  }

  // ===============================================
  // DATABASE QUERY METHODS
  // ===============================================

  private async getUsageCount(userId: string, since: Date): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', since.toISOString());

      if (error) {
        console.error('Error getting usage count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUsageCount:', error);
      return 0;
    }
  }

  private async getCostSum(userId: string, since: Date): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('cost_usd')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString());

      if (error) {
        console.error('Error getting cost sum:', error);
        return 0;
      }

      return data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;
    } catch (error) {
      console.error('Error in getCostSum:', error);
      return 0;
    }
  }

  private async getGlobalDailyCost(): Promise<number> {
    try {
      const today = new Date();
      const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const { data, error } = await supabase
        .from('ai_usage')
        .select('cost_usd')
        .gte('created_at', dayStart.toISOString());

      if (error) {
        console.error('Error getting global daily cost:', error);
        return 0;
      }

      return data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;
    } catch (error) {
      console.error('Error in getGlobalDailyCost:', error);
      return 0;
    }
  }

  private async getGlobalMonthlyCost(): Promise<number> {
    try {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const { data, error } = await supabase
        .from('ai_usage')
        .select('cost_usd')
        .gte('created_at', monthStart.toISOString());

      if (error) {
        console.error('Error getting global monthly cost:', error);
        return 0;
      }

      return data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;
    } catch (error) {
      console.error('Error in getGlobalMonthlyCost:', error);
      return 0;
    }
  }

  private async persistToDatabase(record: AIUsageRecord): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_usage')
        .insert({
          user_id: record.userId,
          company_id: record.tenantId, // Map tenantId to company_id
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

      if (error) {
        console.error('Error persisting AI usage to database:', error);
        // Don't throw - we don't want to break the AI request flow
      }
    } catch (error) {
      console.error('Error in persistToDatabase:', error);
      // Don't throw - we don't want to break the AI request flow
    }
  }

  private createLimitResult(
    allowed: boolean,
    limits: any,
    hourlyUsage: number,
    dailyUsage: number,
    monthlyUsage: number,
    costLimits: any,
    dailyCost: number,
    monthlyCost: number,
    hourStart: Date,
    dayStart: Date,
    monthStart: Date,
    reason?: string
  ): RateLimitResult {
    return {
      allowed,
      remaining: {
        hourly: Math.max(0, limits.hourly - hourlyUsage),
        daily: Math.max(0, limits.daily - dailyUsage),
        monthly: Math.max(0, limits.monthly - monthlyUsage)
      },
      resetTime: {
        hourly: new Date(hourStart.getTime() + 60 * 60 * 1000),
        daily: new Date(dayStart.getTime() + 24 * 60 * 60 * 1000),
        monthly: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
      },
      costRemaining: {
        daily: Math.max(0, costLimits.daily - dailyCost),
        monthly: Math.max(0, costLimits.monthly - monthlyCost)
      },
      reason
    };
  }


}

// Export singleton instance
export const aiRateLimiter = AIRateLimiter.getInstance();

// Helper function for API routes
export async function checkAIRateLimit(
  userId: string,
  subscriptionTier: string,
  estimatedCost?: number
): Promise<RateLimitResult> {
  return aiRateLimiter.checkRateLimit(userId, subscriptionTier, estimatedCost);
}

// Helper function to record usage
export async function recordAIUsage(
  userId: string,
  tenantId: string | undefined,
  model: 'claude' | 'gpt-4' | 'gpt-3.5',
  inputTokens: number,
  outputTokens: number,
  costUSD: number,
  endpoint: string,
  subscriptionTier: string
): Promise<void> {
  return aiRateLimiter.recordUsage({
    userId,
    tenantId,
    timestamp: new Date(),
    model,
    inputTokens,
    outputTokens,
    costUSD,
    endpoint,
    subscriptionTier
  });
}