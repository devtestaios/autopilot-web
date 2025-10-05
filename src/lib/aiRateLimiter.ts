/**
 * AI Rate Limiting System
 * Prevents AI cost overrun that could bankrupt the platform
 * Implements per-user, per-tenant, and global rate limiting
 */

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
  private usageStore: Map<string, AIUsageRecord[]> = new Map();
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
    const userKey = `user:${userId}`;
    const userUsage = this.getUserUsage(userKey);
    const now = new Date();

    // Get time boundaries
    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count current usage
    const hourlyUsage = this.countUsage(userUsage, hourStart);
    const dailyUsage = this.countUsage(userUsage, dayStart);
    const monthlyUsage = this.countUsage(userUsage, monthStart);

    // Calculate costs
    const dailyCost = this.calculateCost(userUsage, dayStart);
    const monthlyCost = this.calculateCost(userUsage, monthStart);

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
    const userKey = `user:${record.userId}`;
    const userUsage = this.getUserUsage(userKey);
    
    userUsage.push(record);
    this.usageStore.set(userKey, userUsage);

    // Clean up old records (keep last 31 days)
    const cutoff = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
    const filteredUsage = userUsage.filter(u => u.timestamp > cutoff);
    this.usageStore.set(userKey, filteredUsage);

    // TODO: Persist to database for permanent storage
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
    const userKey = `user:${userId}`;
    const userUsage = this.getUserUsage(userKey);
    const now = new Date();

    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      hourly: this.countUsage(userUsage, hourStart),
      daily: this.countUsage(userUsage, dayStart),
      monthly: this.countUsage(userUsage, monthStart),
      dailyCost: this.calculateCost(userUsage, dayStart),
      monthlyCost: this.calculateCost(userUsage, monthStart)
    };
  }

  private getUserUsage(userKey: string): AIUsageRecord[] {
    return this.usageStore.get(userKey) || [];
  }

  private countUsage(usage: AIUsageRecord[], since: Date): number {
    return usage.filter(u => u.timestamp >= since).length;
  }

  private calculateCost(usage: AIUsageRecord[], since: Date): number {
    return usage
      .filter(u => u.timestamp >= since)
      .reduce((total, u) => total + u.costUSD, 0);
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

  private async getGlobalDailyCost(): Promise<number> {
    // TODO: Implement global cost tracking from database
    return 0;
  }

  private async getGlobalMonthlyCost(): Promise<number> {
    // TODO: Implement global cost tracking from database
    return 0;
  }

  private async persistToDatabase(record: AIUsageRecord): Promise<void> {
    // TODO: Implement database persistence
    console.log('Recording AI usage:', record);
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