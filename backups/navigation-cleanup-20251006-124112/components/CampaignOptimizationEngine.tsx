'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, DollarSign, Target, Zap } from 'lucide-react';

interface OptimizationRecommendation {
  id: string;
  type: 'budget' | 'bid' | 'targeting' | 'creative' | 'keyword';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
  campaignId?: string;
  campaignName?: string;
  estimatedImprovement: {
    metric: string;
    value: string;
  };
}

interface CampaignOptimizationEngineProps {
  campaigns?: any[];
}

export default function CampaignOptimizationEngine({ campaigns = [] }: CampaignOptimizationEngineProps) {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Generate AI-powered recommendations based on campaign data
  const generateRecommendations = () => {
    const newRecommendations: OptimizationRecommendation[] = [];

    campaigns.filter(c => c.platform === 'google_ads').forEach(campaign => {
      // Budget optimization recommendations
      if (campaign.spend && campaign.budget) {
        const spendRatio = campaign.spend / campaign.budget;
        
        if (spendRatio > 0.9) {
          newRecommendations.push({
            id: `budget-${campaign.id}`,
            type: 'budget',
            priority: 'high',
            title: 'Increase Campaign Budget',
            description: `${campaign.name} is spending ${(spendRatio * 100).toFixed(0)}% of its budget. Consider increasing budget to capture more opportunities.`,
            impact: 'Could increase conversions by 15-25%',
            action: 'Increase budget by $500-1000',
            campaignId: campaign.id,
            campaignName: campaign.name,
            estimatedImprovement: {
              metric: 'Conversions',
              value: '+15-25%'
            }
          });
        }

        if (spendRatio < 0.5) {
          newRecommendations.push({
            id: `budget-low-${campaign.id}`,
            type: 'budget',
            priority: 'medium',
            title: 'Optimize Budget Allocation',
            description: `${campaign.name} is only spending ${(spendRatio * 100).toFixed(0)}% of its budget. Review targeting or bid strategy.`,
            impact: 'Reallocate budget to higher-performing campaigns',
            action: 'Review targeting settings and bid strategy',
            campaignId: campaign.id,
            campaignName: campaign.name,
            estimatedImprovement: {
              metric: 'ROAS',
              value: '+10-20%'
            }
          });
        }
      }

      // Performance-based recommendations
      const metrics = campaign.metrics || {};
      
      if (metrics.ctr && metrics.ctr < 2.0) {
        newRecommendations.push({
          id: `ctr-${campaign.id}`,
          type: 'creative',
          priority: 'high',
          title: 'Improve Ad Copy Performance',
          description: `${campaign.name} has a low CTR of ${metrics.ctr}%. Test new ad copy and extensions.`,
          impact: 'Improved CTR reduces costs and increases Quality Score',
          action: 'A/B test ad headlines and descriptions',
          campaignId: campaign.id,
          campaignName: campaign.name,
          estimatedImprovement: {
            metric: 'CTR',
            value: '+50-100%'
          }
        });
      }

      if (metrics.conversions && metrics.conversions < 10) {
        newRecommendations.push({
          id: `conversions-${campaign.id}`,
          type: 'targeting',
          priority: 'medium',
          title: 'Expand Targeting Options',
          description: `${campaign.name} has low conversion volume. Consider expanding audience targeting.`,
          impact: 'Increase conversion volume and reach',
          action: 'Add similar audiences and lookalike segments',
          campaignId: campaign.id,
          campaignName: campaign.name,
          estimatedImprovement: {
            metric: 'Conversions',
            value: '+30-50%'
          }
        });
      }
    });

    // General platform recommendations
    newRecommendations.push({
      id: 'general-automation',
      type: 'bid',
      priority: 'medium',
      title: 'Enable Smart Bidding',
      description: 'Implement automated bidding strategies to optimize for conversions and maximize ROI.',
      impact: 'Reduce manual bid management time by 80%',
      action: 'Switch to Target CPA or Target ROAS bidding',
      estimatedImprovement: {
        metric: 'Efficiency',
        value: '+80%'
      }
    });

    newRecommendations.push({
      id: 'general-extensions',
      type: 'creative',
      priority: 'low',
      title: 'Add Ad Extensions',
      description: 'Implement sitelinks, callouts, and structured snippets to improve ad visibility.',
      impact: 'Increase ad real estate and CTR',
      action: 'Set up comprehensive ad extensions',
      estimatedImprovement: {
        metric: 'CTR',
        value: '+10-15%'
      }
    });

    return newRecommendations;
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      setLoading(true);
      // Simulate AI analysis delay
      setTimeout(() => {
        setRecommendations(generateRecommendations());
        setLoading(false);
      }, 1500);
    }
  }, [campaigns]);

  const filteredRecommendations = selectedPriority === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.priority === selectedPriority);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'bid':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'targeting':
        return <Target className="w-4 h-4 text-purple-600" />;
      case 'creative':
        return <Lightbulb className="w-4 h-4 text-orange-600" />;
      case 'keyword':
        return <Zap className="w-4 h-4 text-indigo-600" />;
      default:
        return <Brain className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (campaigns.filter(c => c.platform === 'google_ads').length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Optimization Ready</h3>
          <p className="text-gray-600">
            Connect your Google Ads campaigns to receive AI-powered optimization recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Campaign Optimization</h3>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              Analyzing campaigns...
            </div>
          )}
        </div>
        
        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Recommendations Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-red-900">
            {recommendations.filter(r => r.priority === 'high').length}
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Medium Priority</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {recommendations.filter(r => r.priority === 'medium').length}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Low Priority</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {recommendations.filter(r => r.priority === 'low').length}
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            AI is analyzing your campaigns and generating personalized recommendations...
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recommendations found for the selected priority level.
          </div>
        ) : (
          filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`border rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(recommendation.priority)}
                    {getTypeIcon(recommendation.type)}
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                      {recommendation.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{recommendation.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span><strong>Impact:</strong> {recommendation.impact}</span>
                    <span><strong>Action:</strong> {recommendation.action}</span>
                  </div>
                  
                  {recommendation.campaignName && (
                    <div className="mt-2 text-xs text-gray-500">
                      Campaign: {recommendation.campaignName}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {recommendation.estimatedImprovement.metric}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {recommendation.estimatedImprovement.value}
                  </div>
                  <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>AI recommendations update every 24 hours</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View All Optimization History →
          </button>
        </div>
      </div>
    </div>
  );
}