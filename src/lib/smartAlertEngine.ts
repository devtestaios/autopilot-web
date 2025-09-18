import { Campaign, PerformanceSnapshot } from '@/types';
import { googleAdsService } from './services/googleAdsService';

export interface Alert {
  id: string;
  type: 'budget' | 'performance' | 'opportunity' | 'anomaly' | 'prediction';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  campaignId?: string;
  campaignName?: string;
  timestamp: Date;
  actionable: boolean;
  suggestedActions?: string[];
  metrics?: Record<string, number>;
  dismissed?: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  type: Alert['type'];
  enabled: boolean;
  conditions: {
    metric: string;
    operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'change_gt' | 'change_lt';
    value: number;
    timeframe?: string; // '1h', '24h', '7d', etc.
  }[];
  severity: Alert['severity'];
  cooldown?: number; // minutes before same alert can fire again
}

class SmartAlertEngine {
  private alerts: Alert[] = [];
  private alertRules: AlertRule[] = [];
  private alertHistory: Map<string, Date> = new Map();
  private subscribers: ((alert: Alert) => void)[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    this.alertRules = [
      {
        id: 'budget-90-percent',
        name: 'Budget 90% Consumed',
        type: 'budget',
        enabled: true,
        conditions: [
          { metric: 'budget_utilization', operator: 'gte', value: 0.9 }
        ],
        severity: 'high',
        cooldown: 360 // 6 hours
      },
      {
        id: 'budget-exhausted',
        name: 'Budget Exhausted',
        type: 'budget',
        enabled: true,
        conditions: [
          { metric: 'budget_utilization', operator: 'gte', value: 1.0 }
        ],
        severity: 'critical',
        cooldown: 60 // 1 hour
      },
      {
        id: 'ctr-drop-significant',
        name: 'CTR Dropped Significantly',
        type: 'performance',
        enabled: true,
        conditions: [
          { metric: 'ctr_change_24h', operator: 'lt', value: -0.3 },
          { metric: 'impressions', operator: 'gt', value: 100 }
        ],
        severity: 'medium',
        cooldown: 720 // 12 hours
      },
      {
        id: 'conversion-rate-drop',
        name: 'Conversion Rate Declining',
        type: 'performance',
        enabled: true,
        conditions: [
          { metric: 'conversion_rate_change_7d', operator: 'lt', value: -0.25 },
          { metric: 'conversions', operator: 'gt', value: 5 }
        ],
        severity: 'high',
        cooldown: 1440 // 24 hours
      },
      {
        id: 'cpc-spike',
        name: 'Cost Per Click Spike',
        type: 'performance',
        enabled: true,
        conditions: [
          { metric: 'cpc_change_24h', operator: 'gt', value: 0.5 },
          { metric: 'clicks', operator: 'gt', value: 20 }
        ],
        severity: 'medium',
        cooldown: 480 // 8 hours
      },
      {
        id: 'low-impression-share',
        name: 'Low Impression Share Opportunity',
        type: 'opportunity',
        enabled: true,
        conditions: [
          { metric: 'impression_share', operator: 'lt', value: 0.3 },
          { metric: 'roas', operator: 'gt', value: 3.0 }
        ],
        severity: 'medium',
        cooldown: 2880 // 48 hours
      },
      {
        id: 'high-performing-low-budget',
        name: 'High Performing Campaign - Budget Opportunity',
        type: 'opportunity',
        enabled: true,
        conditions: [
          { metric: 'roas', operator: 'gt', value: 4.0 },
          { metric: 'budget_utilization', operator: 'gt', value: 0.8 },
          { metric: 'impression_share_lost_budget', operator: 'gt', value: 0.2 }
        ],
        severity: 'high',
        cooldown: 1440 // 24 hours
      },
      {
        id: 'anomaly-traffic-spike',
        name: 'Unusual Traffic Spike Detected',
        type: 'anomaly',
        enabled: true,
        conditions: [
          { metric: 'impressions_change_1h', operator: 'gt', value: 3.0 }
        ],
        severity: 'medium',
        cooldown: 180 // 3 hours
      }
    ];
  }

  async analyzeAllCampaigns(): Promise<Alert[]> {
    const newAlerts: Alert[] = [];
    
    try {
      const campaigns = await googleAdsService.fetchCampaigns();
      
      for (const campaign of campaigns) {
        const campaignAlerts = await this.analyzeCampaign(campaign);
        newAlerts.push(...campaignAlerts);
      }

      // Add new alerts to our collection
      this.alerts.push(...newAlerts);
      
      // Notify subscribers
      newAlerts.forEach(alert => {
        this.notifySubscribers(alert);
      });

      return newAlerts;
    } catch (error) {
      console.error('Error analyzing campaigns for alerts:', error);
      return [];
    }
  }

  private async analyzeCampaign(campaign: Campaign): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    try {
      // Get recent performance data
      const performance = await googleAdsService.fetchCampaignMetrics(campaign.id, 30);
      const performanceSnapshots = performance.map(p => ({
        id: `${campaign.id}-${p.date}`,
        campaign_id: campaign.id,
        date: p.date,
        spend: p.spend,
        clicks: p.clicks,
        impressions: p.impressions,
        conversions: p.conversions,
        ctr: p.ctr,
        cpc: p.cpc,
        cpa: p.cpa,
        roas: p.spend > 0 ? (p.conversions * 100) / p.spend : 0,
        created_at: new Date().toISOString()
      }));
      if (!performanceSnapshots || performanceSnapshots.length === 0) return alerts;

      // Calculate metrics and changes
      const metrics = this.calculateMetrics(campaign, performanceSnapshots);
      
      // Check each rule
      for (const rule of this.alertRules.filter(r => r.enabled)) {
        if (this.shouldSkipDueToCooldown(rule.id, campaign.id)) continue;
        
        if (this.evaluateRule(rule, metrics)) {
          const alert = this.createAlert(rule, campaign, metrics);
          alerts.push(alert);
          
          // Record this alert for cooldown tracking
          this.alertHistory.set(`${rule.id}-${campaign.id}`, new Date());
        }
      }
    } catch (error) {
      console.error(`Error analyzing campaign ${campaign.id}:`, error);
    }

    return alerts;
  }

  private calculateMetrics(campaign: Campaign, performance: PerformanceSnapshot[]): Record<string, number> {
    const latest = performance[performance.length - 1];
    const yesterday = performance[performance.length - 2];
    const weekAgo = performance[performance.length - 8];
    
    const metrics: Record<string, number> = {
      budget_utilization: campaign.budget ? campaign.spend / campaign.budget : 0,
      impressions: latest.impressions,
      clicks: latest.clicks,
      conversions: latest.conversions,
      ctr: latest.ctr || 0,
      cpc: latest.cpc || 0,
      cpa: latest.cpa || 0,
      roas: latest.roas || 0,
      conversion_rate: latest.conversions / Math.max(latest.clicks, 1),
      impression_share: 0.65, // Mock data - would come from Google Ads API
      impression_share_lost_budget: 0.15, // Mock data
    };

    // Calculate changes
    if (yesterday) {
      metrics.ctr_change_24h = ((latest.ctr || 0) - (yesterday.ctr || 0)) / Math.max(yesterday.ctr || 0.001, 0.001);
      metrics.cpc_change_24h = ((latest.cpc || 0) - (yesterday.cpc || 0)) / Math.max(yesterday.cpc || 0.001, 0.001);
      metrics.impressions_change_1h = latest.impressions / Math.max(yesterday.impressions, 1);
    }

    if (weekAgo) {
      const weekAgoConversionRate = weekAgo.conversions / Math.max(weekAgo.clicks, 1);
      metrics.conversion_rate_change_7d = (metrics.conversion_rate - weekAgoConversionRate) / Math.max(weekAgoConversionRate, 0.001);
    }

    return metrics;
  }

  private evaluateRule(rule: AlertRule, metrics: Record<string, number>): boolean {
    return rule.conditions.every(condition => {
      const value = metrics[condition.metric];
      if (value === undefined) return false;

      switch (condition.operator) {
        case 'gt': return value > condition.value;
        case 'lt': return value < condition.value;
        case 'gte': return value >= condition.value;
        case 'lte': return value <= condition.value;
        case 'eq': return Math.abs(value - condition.value) < 0.001;
        case 'change_gt': return value > condition.value;
        case 'change_lt': return value < condition.value;
        default: return false;
      }
    });
  }

  private createAlert(rule: AlertRule, campaign: Campaign, metrics: Record<string, number>): Alert {
    let suggestedActions: string[] = [];
    
    // Generate contextual suggestions based on alert type
    switch (rule.type) {
      case 'budget':
        if (rule.id.includes('90-percent')) {
          suggestedActions = [
            'Review campaign performance before budget exhaustion',
            'Consider increasing budget if ROAS is positive',
            'Pause underperforming ad groups'
          ];
        } else if (rule.id.includes('exhausted')) {
          suggestedActions = [
            'Increase daily budget immediately',
            'Reallocate budget from underperforming campaigns',
            'Review bid strategies'
          ];
        }
        break;
      case 'performance':
        if (rule.id.includes('ctr-drop')) {
          suggestedActions = [
            'Review ad copy relevance',
            'Check for new competitors',
            'Update ad creative',
            'Review keyword targeting'
          ];
        } else if (rule.id.includes('conversion-rate')) {
          suggestedActions = [
            'Audit landing page experience',
            'Review audience targeting',
            'Check for technical issues',
            'Analyze conversion funnel'
          ];
        }
        break;
      case 'opportunity':
        if (rule.id.includes('impression-share')) {
          suggestedActions = [
            'Increase bids for high-performing keywords',
            'Expand keyword targeting',
            'Increase campaign budget'
          ];
        } else if (rule.id.includes('high-performing')) {
          suggestedActions = [
            'Increase budget allocation',
            'Expand to similar audiences',
            'Scale successful ad groups'
          ];
        }
        break;
    }

    return {
      id: `${rule.id}-${campaign.id}-${Date.now()}`,
      type: rule.type,
      severity: rule.severity,
      title: rule.name,
      message: this.generateAlertMessage(rule, campaign, metrics),
      campaignId: campaign.id,
      campaignName: campaign.name,
      timestamp: new Date(),
      actionable: suggestedActions.length > 0,
      suggestedActions,
      metrics,
      dismissed: false
    };
  }

  private generateAlertMessage(rule: AlertRule, campaign: Campaign, metrics: Record<string, number>): string {
    switch (rule.id) {
      case 'budget-90-percent':
        return `Campaign "${campaign.name}" has used ${(metrics.budget_utilization * 100).toFixed(1)}% of its daily budget.`;
      case 'budget-exhausted':
        return `Campaign "${campaign.name}" has exhausted its daily budget and stopped serving ads.`;
      case 'ctr-drop-significant':
        return `Campaign "${campaign.name}" CTR dropped by ${Math.abs(metrics.ctr_change_24h * 100).toFixed(1)}% in the last 24 hours.`;
      case 'conversion-rate-drop':
        return `Campaign "${campaign.name}" conversion rate declined by ${Math.abs(metrics.conversion_rate_change_7d * 100).toFixed(1)}% over the past week.`;
      case 'cpc-spike':
        return `Campaign "${campaign.name}" cost per click increased by ${(metrics.cpc_change_24h * 100).toFixed(1)}% in the last 24 hours.`;
      case 'low-impression-share':
        return `Campaign "${campaign.name}" has low impression share (${(metrics.impression_share * 100).toFixed(1)}%) despite strong ROAS.`;
      case 'high-performing-low-budget':
        return `Campaign "${campaign.name}" is performing well (ROAS: ${metrics.roas.toFixed(2)}) but limited by budget.`;
      case 'anomaly-traffic-spike':
        return `Campaign "${campaign.name}" experiencing unusual traffic spike - impressions increased ${((metrics.impressions_change_1h - 1) * 100).toFixed(1)}%.`;
      default:
        return `Alert triggered for campaign "${campaign.name}".`;
    }
  }

  private shouldSkipDueToCooldown(ruleId: string, campaignId: string): boolean {
    const key = `${ruleId}-${campaignId}`;
    const lastAlert = this.alertHistory.get(key);
    
    if (!lastAlert) return false;
    
    const rule = this.alertRules.find(r => r.id === ruleId);
    if (!rule?.cooldown) return false;
    
    const cooldownMs = rule.cooldown * 60 * 1000;
    return Date.now() - lastAlert.getTime() < cooldownMs;
  }

  // Subscription methods for real-time notifications
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error notifying alert subscriber:', error);
      }
    });
  }

  // Public methods for managing alerts
  getAlerts(filters?: { 
    severity?: Alert['severity'][];
    type?: Alert['type'][];
    dismissed?: boolean;
    campaignId?: string;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (filters) {
      if (filters.severity) {
        filtered = filtered.filter(alert => filters.severity!.includes(alert.severity));
      }
      if (filters.type) {
        filtered = filtered.filter(alert => filters.type!.includes(alert.type));
      }
      if (filters.dismissed !== undefined) {
        filtered = filtered.filter(alert => alert.dismissed === filters.dismissed);
      }
      if (filters.campaignId) {
        filtered = filtered.filter(alert => alert.campaignId === filters.campaignId);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  dismissAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.dismissed = true;
    }
  }

  dismissAllAlerts(campaignId?: string): void {
    this.alerts.forEach(alert => {
      if (!campaignId || alert.campaignId === campaignId) {
        alert.dismissed = true;
      }
    });
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  updateAlertRule(ruleId: string, updates: Partial<AlertRule>): void {
    const ruleIndex = this.alertRules.findIndex(r => r.id === ruleId);
    if (ruleIndex > -1) {
      this.alertRules[ruleIndex] = { ...this.alertRules[ruleIndex], ...updates };
    }
  }

  // Predictive alerting methods
  async generatePredictiveAlerts(): Promise<Alert[]> {
    const predictiveAlerts: Alert[] = [];
    
    try {
      const campaigns = await googleAdsService.fetchCampaigns();
      
      for (const campaign of campaigns) {
        const performance = await googleAdsService.fetchCampaignMetrics(campaign.id, 14);
        const performanceSnapshots = performance.map(p => ({
          id: `${campaign.id}-${p.date}`,
          campaign_id: campaign.id,
          date: p.date,
          spend: p.spend,
          clicks: p.clicks,
          impressions: p.impressions,
          conversions: p.conversions,
          ctr: p.ctr,
          cpc: p.cpc,
          cpa: p.cpa,
          roas: p.spend > 0 ? (p.conversions * 100) / p.spend : 0,
          created_at: new Date().toISOString()
        }));
        
        if (performanceSnapshots.length >= 7) {
          // Predict budget exhaustion
          const budgetAlert = this.predictBudgetExhaustion(campaign, performanceSnapshots);
          if (budgetAlert) predictiveAlerts.push(budgetAlert);
          
          // Predict performance decline
          const performanceAlert = this.predictPerformanceDecline(campaign, performanceSnapshots);
          if (performanceAlert) predictiveAlerts.push(performanceAlert);
        }
      }
    } catch (error) {
      console.error('Error generating predictive alerts:', error);
    }

    return predictiveAlerts;
  }

  private predictBudgetExhaustion(campaign: Campaign, performance: PerformanceSnapshot[]): Alert | null {
    if (!campaign.budget) return null;

    const recentSpend = performance.slice(-7).reduce((sum, p) => sum + p.spend, 0);
    const avgDailySpend = recentSpend / 7;
    const remainingBudget = campaign.budget - campaign.spend;
    const daysUntilExhaustion = remainingBudget / avgDailySpend;

    if (daysUntilExhaustion <= 3 && daysUntilExhaustion > 0) {
      return {
        id: `prediction-budget-${campaign.id}-${Date.now()}`,
        type: 'prediction',
        severity: daysUntilExhaustion <= 1 ? 'high' : 'medium',
        title: 'Budget Exhaustion Predicted',
        message: `Campaign "${campaign.name}" will exhaust its budget in approximately ${daysUntilExhaustion.toFixed(1)} days based on current spending trends.`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        timestamp: new Date(),
        actionable: true,
        suggestedActions: [
          'Increase campaign budget',
          'Optimize bids to reduce spend',
          'Pause underperforming keywords'
        ],
        metrics: {
          days_until_exhaustion: daysUntilExhaustion,
          avg_daily_spend: avgDailySpend,
          remaining_budget: remainingBudget
        }
      };
    }

    return null;
  }

  private predictPerformanceDecline(campaign: Campaign, performance: PerformanceSnapshot[]): Alert | null {
    if (performance.length < 10) return null;

    const recent5Days = performance.slice(-5);
    const previous5Days = performance.slice(-10, -5);

    const recentAvgROAS = recent5Days.reduce((sum, p) => sum + (p.roas || 0), 0) / 5;
    const previousAvgROAS = previous5Days.reduce((sum, p) => sum + (p.roas || 0), 0) / 5;

    const roasDecline = (previousAvgROAS - recentAvgROAS) / previousAvgROAS;

    if (roasDecline > 0.15 && recentAvgROAS > 0) {
      return {
        id: `prediction-decline-${campaign.id}-${Date.now()}`,
        type: 'prediction',
        severity: roasDecline > 0.3 ? 'high' : 'medium',
        title: 'Performance Decline Trend',
        message: `Campaign "${campaign.name}" shows declining ROAS trend. Current 5-day average (${recentAvgROAS.toFixed(2)}) is ${(roasDecline * 100).toFixed(1)}% lower than previous 5-day average.`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        timestamp: new Date(),
        actionable: true,
        suggestedActions: [
          'Review recent changes to campaigns',
          'Analyze competitor activity',
          'Refresh ad creative',
          'Review audience targeting'
        ],
        metrics: {
          roas_decline_percent: roasDecline * 100,
          recent_avg_roas: recentAvgROAS,
          previous_avg_roas: previousAvgROAS
        }
      };
    }

    return null;
  }
}

export const smartAlertEngine = new SmartAlertEngine();