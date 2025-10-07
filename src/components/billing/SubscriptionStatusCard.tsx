/**
 * Subscription Status Component
 * Shows current plan, usage, and billing information
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SUBSCRIPTION_PLANS } from '@/lib/enterpriseAPI';
import { 
  Crown, 
  Users, 
  Database, 
  Calendar, 
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Settings
} from 'lucide-react';

interface SubscriptionStatus {
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  current_period_end: string;
  trial_end?: string;
  usage: {
    users: number;
    storage_gb: number;
    api_calls_month: number;
    campaigns: number;
  };
  billing_info?: {
    next_payment_date: string;
    amount: number;
    payment_method: string;
  };
}

export default function SubscriptionStatusCard() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/billing/status');
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' });
      const { portal_url } = await response.json();
      window.location.href = portal_url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-2">No Subscription Found</h3>
          <p className="text-gray-600 mb-4">Start your journey with a free trial</p>
          <Button asChild>
            <a href="/pricing">Choose Plan</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id);
  const isTrialing = subscription.status === 'trialing';
  const isPastDue = subscription.status === 'past_due';

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-700">Free Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-700">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-700">Canceled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {currentPlan?.name || 'Unknown Plan'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {currentPlan?.enterprise_features.white_label && (
              <Crown className="w-5 h-5 text-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-4">{currentPlan?.description}</p>
              
              {isTrialing && subscription.trial_end && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      Trial expires on {new Date(subscription.trial_end).toLocaleDateString()}
                    </span>
                  </div>
                  <Button size="sm" asChild>
                    <a href="/pricing">Upgrade Now</a>
                  </Button>
                </div>
              )}

              {isPastDue && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-900 dark:text-red-100">
                      Payment Required
                    </span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                    Please update your payment method to continue service.
                  </p>
                  <Button size="sm" variant="destructive" onClick={openBillingPortal}>
                    Update Payment
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {subscription.billing_info && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Next Payment
                  </h4>
                  <p className="text-2xl font-bold">
                    ${subscription.billing_info.amount}
                  </p>
                  <p className="text-gray-600">
                    Due {new Date(subscription.billing_info.next_payment_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {subscription.billing_info.payment_method}
                  </p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={openBillingPortal}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Billing
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Users */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.users} / {currentPlan?.limits.users === -1 ? '∞' : currentPlan?.limits.users}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.users, currentPlan?.limits.users || 0)} 
                className="h-2" 
              />
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.storage_gb}GB / {currentPlan?.limits.storage_gb === -1 ? '∞' : currentPlan?.limits.storage_gb + 'GB'}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.storage_gb, currentPlan?.limits.storage_gb || 0)} 
                className="h-2" 
              />
            </div>

            {/* API Calls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">API Calls (Month)</span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.api_calls_month.toLocaleString()} / {currentPlan?.limits.api_calls_month === -1 ? '∞' : currentPlan?.limits.api_calls_month.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.api_calls_month, currentPlan?.limits.api_calls_month || 0)} 
                className="h-2" 
              />
            </div>

            {/* Campaigns */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Active Campaigns</span>
                <span className="text-sm text-gray-600">
                  {subscription.usage.campaigns} / {currentPlan?.limits.campaigns === -1 ? '∞' : currentPlan?.limits.campaigns}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.campaigns, currentPlan?.limits.campaigns || 0)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}