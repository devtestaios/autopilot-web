'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Clock, DollarSign, Zap, Shield } from 'lucide-react';
import { aiRateLimiter } from '@/lib/aiRateLimiter';

interface AIUsageStats {
  hourly: number;
  daily: number;
  monthly: number;
  dailyCost: number;
  monthlyCost: number;
}

interface AIUsageDashboardProps {
  userId: string;
  subscriptionTier: string;
}

export default function AIUsageDashboard({ userId, subscriptionTier }: AIUsageDashboardProps) {
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null);
  const [limits, setLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
    // Refresh every 30 seconds
    const interval = setInterval(loadUsageData, 30000);
    return () => clearInterval(interval);
  }, [userId, subscriptionTier]);

  const loadUsageData = async () => {
    try {
      const stats = await aiRateLimiter.getUserUsageStats(userId);
      setUsageStats(stats);

      // Get limits for subscription tier
      const tierLimits = {
        trial: { hourly: 5, daily: 20, monthly: 100, dailyCost: 1.00, monthlyCost: 10.00 },
        solo_professional: { hourly: 10, daily: 50, monthly: 500, dailyCost: 5.00, monthlyCost: 50.00 },
        growth_team: { hourly: 25, daily: 150, monthly: 1500, dailyCost: 15.00, monthlyCost: 150.00 },
        professional_agency: { hourly: 50, daily: 300, monthly: 3000, dailyCost: 30.00, monthlyCost: 300.00 },
        enterprise: { hourly: 100, daily: 600, monthly: 6000, dailyCost: 60.00, monthlyCost: 600.00 },
        enterprise_plus: { hourly: 200, daily: 1200, monthly: 12000, dailyCost: 120.00, monthlyCost: 1200.00 }
      };

      setLimits(tierLimits[subscriptionTier as keyof typeof tierLimits] || tierLimits.trial);
    } catch (error) {
      console.error('Failed to load AI usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return <Badge variant="destructive" className="ml-2">Critical</Badge>;
    if (percentage >= 75) return <Badge variant="secondary" className="ml-2">Warning</Badge>;
    return <Badge variant="default" className="ml-2">Healthy</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Usage Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats || !limits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Usage Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load usage data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* AI Requests Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            AI Requests
            {getStatusBadge(usageStats.daily, limits.daily)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hourly Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Hourly</span>
              <span className={getUsageColor(usageStats.hourly, limits.hourly)}>
                {usageStats.hourly}/{limits.hourly}
              </span>
            </div>
            <Progress 
              value={(usageStats.hourly / limits.hourly) * 100} 
              className="h-2"
            />
          </div>

          {/* Daily Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Daily</span>
              <span className={getUsageColor(usageStats.daily, limits.daily)}>
                {usageStats.daily}/{limits.daily}
              </span>
            </div>
            <Progress 
              value={(usageStats.daily / limits.daily) * 100} 
              className="h-2"
            />
          </div>

          {/* Monthly Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Monthly</span>
              <span className={getUsageColor(usageStats.monthly, limits.monthly)}>
                {usageStats.monthly}/{limits.monthly}
              </span>
            </div>
            <Progress 
              value={(usageStats.monthly / limits.monthly) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Cost Usage
            {getStatusBadge(usageStats.dailyCost, limits.dailyCost)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Daily Cost */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Daily</span>
              <span className={getUsageColor(usageStats.dailyCost, limits.dailyCost)}>
                ${usageStats.dailyCost.toFixed(2)}/${limits.dailyCost.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={(usageStats.dailyCost / limits.dailyCost) * 100} 
              className="h-2"
            />
          </div>

          {/* Monthly Cost */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Monthly</span>
              <span className={getUsageColor(usageStats.monthlyCost, limits.monthlyCost)}>
                ${usageStats.monthlyCost.toFixed(2)}/${limits.monthlyCost.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={(usageStats.monthlyCost / limits.monthlyCost) * 100} 
              className="h-2"
            />
          </div>

          {/* Projected Monthly Cost */}
          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Projected Monthly</span>
              <span>
                ${((usageStats.dailyCost * 30)).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tier Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Subscription: {subscriptionTier.replace('_', ' ').toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly Limit:</span>
              <span>{limits.hourly} requests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Limit:</span>
              <span>{limits.daily} requests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Limit:</span>
              <span>{limits.monthly} requests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Cost Limit:</span>
              <span>${limits.dailyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Cost Limit:</span>
              <span>${limits.monthlyCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Upgrade Notice */}
          {subscriptionTier === 'trial' && (
            <div className="pt-3 border-t">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Upgrade your plan for higher AI usage limits and advanced features.
                </p>
              </div>
            </div>
          )}

          {/* Warning for high usage */}
          {(usageStats.daily / limits.daily) > 0.8 && (
            <div className="pt-3 border-t">
              <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Approaching daily limit. Consider upgrading your plan.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}