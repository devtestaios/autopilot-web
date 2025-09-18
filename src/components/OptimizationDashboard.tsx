/**
 * AI Optimization Dashboard Component
 * 
 * Displays AI-powered campaign optimization insights and recommendations
 * using the CampaignOptimizationEngine.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Target,
  DollarSign,
  Eye
} from 'lucide-react';
import { googleAdsService } from '@/lib/services/googleAdsService';
import { campaignOptimizationEngine, type OptimizationInsight, type PerformanceAnalysis } from '@/lib/services/optimizationEngine';
import type { Campaign } from '@/types';

interface OptimizationDashboardProps {
  className?: string;
}

export function OptimizationDashboard({ className }: OptimizationDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [portfolioInsights, setPortfolioInsights] = useState<{
    totalInsights: number;
    highPriorityInsights: number;
    topRecommendations: OptimizationInsight[];
    portfolioScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaignData();
  }, []);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      
      // Load campaigns from Google Ads service
      const campaignData = await googleAdsService.fetchCampaigns();
      setCampaigns(campaignData);

      if (campaignData.length > 0) {
        // Select first campaign by default
        const firstCampaign = campaignData[0];
        setSelectedCampaign(firstCampaign);
        
        // Generate analysis for selected campaign
        const campaignAnalysis = await campaignOptimizationEngine.analyzeCampaign(firstCampaign);
        setAnalysis(campaignAnalysis);

        // Generate portfolio-level insights
        const portfolio = await campaignOptimizationEngine.analyzePortfolio(campaignData);
        setPortfolioInsights(portfolio);
      }
    } catch (error) {
      console.error('Failed to load campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setLoading(true);
    
    try {
      const campaignAnalysis = await campaignOptimizationEngine.analyzeCampaign(campaign);
      setAnalysis(campaignAnalysis);
    } catch (error) {
      console.error('Failed to analyze campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <DollarSign className="h-4 w-4" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'targeting':
        return <Target className="h-4 w-4" />;
      case 'creative':
        return <Brain className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (loading && !portfolioInsights) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-5 w-5 animate-pulse" />
            <span>AI is analyzing your campaigns...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Portfolio Overview */}
      {portfolioInsights && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Portfolio Analysis</span>
              </h3>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                Score: {portfolioInsights.portfolioScore}/100
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{portfolioInsights.totalInsights}</div>
                <div className="text-sm text-gray-600">Total Insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{portfolioInsights.highPriorityInsights}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{campaigns.length}</div>
                <div className="text-sm text-gray-600">Campaigns Analyzed</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Portfolio Health Score</span>
                <span>{portfolioInsights.portfolioScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${portfolioInsights.portfolioScore}%` }}
                ></div>
              </div>
            </div>

            {portfolioInsights.topRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Top Recommendations</h4>
                <div className="space-y-2">
                  {portfolioInsights.topRecommendations.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-center space-x-2 text-sm">
                      {getPriorityIcon(insight.priority)}
                      <span className="flex-1">{insight.title}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campaign Selection */}
      {campaigns.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Campaign Analysis</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => handleCampaignSelect(campaign)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedCampaign?.id === campaign.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-medium truncate">{campaign.name}</div>
                  <div className="text-xs text-gray-500">${campaign.spend} spent</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaign Analysis Details */}
      {analysis && selectedCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Score */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Performance Score</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analysis.overallScore}
                </div>
                <div className="text-sm text-gray-600">Overall Performance</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full" 
                  style={{ width: `${analysis.overallScore}%` }}
                ></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization</span>
                  <span>{analysis.budgetUtilization.current.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Optimal Range</span>
                  <span>{analysis.budgetUtilization.optimal}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Performance Trends</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Spending</span>
                  <div className="flex items-center space-x-1">
                    {analysis.trends.spending === 'increasing' ? 
                      <TrendingUp className="h-4 w-4 text-green-500" /> :
                      analysis.trends.spending === 'decreasing' ?
                      <TrendingDown className="h-4 w-4 text-red-500" /> :
                      <div className="h-4 w-4 bg-gray-300 rounded-full" />
                    }
                    <span className="text-sm capitalize">{analysis.trends.spending}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance</span>
                  <div className="flex items-center space-x-1">
                    {analysis.trends.performance === 'improving' ? 
                      <TrendingUp className="h-4 w-4 text-green-500" /> :
                      analysis.trends.performance === 'declining' ?
                      <TrendingDown className="h-4 w-4 text-red-500" /> :
                      <div className="h-4 w-4 bg-gray-300 rounded-full" />
                    }
                    <span className="text-sm capitalize">{analysis.trends.performance}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Efficiency</span>
                  <div className="flex items-center space-x-1">
                    {analysis.trends.efficiency === 'improving' ? 
                      <TrendingUp className="h-4 w-4 text-green-500" /> :
                      analysis.trends.efficiency === 'declining' ?
                      <TrendingDown className="h-4 w-4 text-red-500" /> :
                      <div className="h-4 w-4 bg-gray-300 rounded-full" />
                    }
                    <span className="text-sm capitalize">{analysis.trends.efficiency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Insights */}
      {analysis && analysis.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">AI Optimization Insights</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analysis.insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(insight.type)}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(insight.priority)}
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {Math.round(insight.confidence * 100)}% confident
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm font-medium text-blue-800 mb-1">Recommendation:</div>
                    <div className="text-sm text-blue-700">{insight.recommendation}</div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="text-sm font-medium text-green-800 mb-1">Estimated Impact:</div>
                    <div className="text-sm text-green-700">{insight.estimatedImpact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Utilization Recommendation */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Budget Optimization</h3>
          </div>
          <div className="p-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Budget Recommendation</span>
              </div>
              <p className="text-sm text-yellow-700">{analysis.budgetUtilization.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button 
          onClick={loadCampaignData} 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>
    </div>
  );
}