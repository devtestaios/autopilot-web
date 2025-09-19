'use client';

import type { Campaign } from '@/types';
import { checkApiHealth } from '@/lib/api';
import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Target, Zap, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { PulseWaveIcon } from './PulseWaveLogo';

interface DashboardStatsProps {
  campaigns: Campaign[];
  loading?: boolean;
}

interface HealthStatus {
  health: string;
  version: string;
  database: string;
}

export default function DashboardStats({ campaigns, loading }: DashboardStatsProps) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  useEffect(() => {
    checkApiHealth().then(setHealthStatus);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-8 w-8 bg-muted rounded-lg"></div>
            </div>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
  const avgSpendPercentage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const platformCounts = campaigns.reduce((acc, campaign) => {
    acc[campaign.platform] = (acc[campaign.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeCampaigns = campaigns.filter(c => (c.spend || 0) < (c.budget || Infinity)).length;

  const statsData = [
    {
      title: 'Total Campaigns',
      value: totalCampaigns.toString(),
      change: `${activeCampaigns} active`,
      icon: Target,
      color: 'text-pulse-blue',
      bgColor: 'from-pulse-blue/10 to-pulse-blue/5',
      borderColor: 'border-pulse-blue/20'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      change: `${avgSpendPercentage.toFixed(1)}% utilized`,
      icon: DollarSign,
      color: 'text-bridge-purple',
      bgColor: 'from-bridge-purple/10 to-bridge-purple/5',
      borderColor: 'border-bridge-purple/20'
    },
    {
      title: 'Total Spend',
      value: formatCurrency(totalSpend),
      change: `${Object.keys(platformCounts).length} platforms`,
      icon: TrendingUp,
      color: 'text-energy-magenta',
      bgColor: 'from-energy-magenta/10 to-energy-magenta/5',
      borderColor: 'border-energy-magenta/20'
    },
    {
      title: 'Performance',
      value: `${totalSpend > 0 ? ((totalBudget - totalSpend) / totalBudget * 100).toFixed(1) : '100'}%`,
      change: 'Budget remaining',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'from-green-500/10 to-green-500/5',
      borderColor: 'border-green-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* System Health Status */}
      {healthStatus && (
        <div className="card glass-effect border-green-500/20 p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-orbitron font-bold text-foreground">System Status</h3>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-bold font-orbitron text-foreground">{healthStatus.health}</div>
                <div className="text-muted-foreground">Health</div>
              </div>
              <div className="text-center">
                <div className="font-bold font-orbitron text-foreground">{healthStatus.version}</div>
                <div className="text-muted-foreground">Version</div>
              </div>
              <div className="text-center">
                <div className="font-bold font-orbitron text-foreground">{healthStatus.database}</div>
                <div className="text-muted-foreground">Database</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className={`card card-hover p-6 bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold font-orbitron ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor}`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Breakdown */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-orbitron font-bold text-foreground">Platform Distribution</h3>
          <PulseWaveIcon size={24} animated={true} className="opacity-60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(platformCounts).map(([platform, count]) => (
            <div key={platform} className="text-center p-4 rounded-lg bg-muted/50 border border-border">
              <div className="text-xl font-bold font-orbitron text-foreground">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">{platform.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}