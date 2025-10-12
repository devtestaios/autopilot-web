'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Brain,
  TrendingUp,
  Target,
  Zap,
  Clock,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Play,
  Calendar,
  Filter,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Sparkles,
  Timer,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// =============================================================================
// TYPES
// =============================================================================

interface OptimizationRecommendation {
  id: string;
  type: 'bid_adjustment' | 'budget_reallocation' | 'audience_expansion' | 'keyword_optimization' | 'creative_refresh';
  priority: 'high' | 'medium' | 'low';
  platform: string;
  campaignId: string;
  campaignName: string;
  title: string;
  description: string;
  expectedImpact: {
    metric: 'ctr' | 'cpc' | 'cpa' | 'roas' | 'impressions' | 'clicks';
    improvement: number;
    confidence: number;
  };
  currentValue: number;
  recommendedValue: number;
  reasoning: string;
  actionUrl?: string;
  estimatedTimeToImplement: string;
  createdAt: string;
}

interface OptimizationSummary {
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  totalPotentialImpact: number;
  avgConfidence: number;
}

// =============================================================================
// OPTIMIZATION DASHBOARD COMPONENT
// =============================================================================

export default function OptimizationDashboard() {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [summary, setSummary] = useState<OptimizationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadRecommendations();
    
    // Set up real-time updates
    const interval = setInterval(loadRecommendations, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [selectedPlatform, selectedPriority]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      
      const response = await fetch(`/api/optimization/recommendations?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setSummary(data.summary);
        setError(null);
      } else {
        setError('Failed to load optimization recommendations');
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load optimization recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyRecommendation = async (recommendationId: string, action: 'apply' | 'dismiss' | 'schedule') => {
    setIsApplying(recommendationId);
    
    try {
      const response = await fetch('/api/optimization/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          recommendationId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: action === 'apply' ? 'Optimization Applied' : action === 'schedule' ? 'Optimization Scheduled' : 'Recommendation Dismissed',
          description: data.message,
        });
        
        // Remove the recommendation from the list
        setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
        
        // Update summary
        if (summary) {
          setSummary(prev => prev ? { ...prev, total: prev.total - 1 } : null);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'Failed to process recommendation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bid_adjustment': return <DollarSign className="h-4 w-4" />;
      case 'budget_reallocation': return <BarChart3 className="h-4 w-4" />;
      case 'audience_expansion': return <Target className="h-4 w-4" />;
      case 'keyword_optimization': return <Lightbulb className="h-4 w-4" />;
      case 'creative_refresh': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'google-ads': return '🎯';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      default: return '🔗';
    }
  };

  const formatMetric = (metric: string, value: number) => {
    switch (metric) {
      case 'ctr':
      case 'roas':
        return `${value.toFixed(2)}`;
      case 'cpc':
      case 'cpa':
        return `$${value.toFixed(2)}`;
      case 'impressions':
      case 'clicks':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              Campaign Optimization Engine
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered recommendations to improve your campaign performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook Ads</option>
              <option value="google-ads">Google Ads</option>
              <option value="linkedin">LinkedIn Ads</option>
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <Button
              onClick={loadRecommendations}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Recommendations</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-red-600">{summary.highPriority} high</span>
                  <span className="text-gray-500 mx-1">•</span>
                  <span className="text-yellow-600">{summary.mediumPriority} medium</span>
                  <span className="text-gray-500 mx-1">•</span>
                  <span className="text-green-600">{summary.lowPriority} low</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Potential Impact</p>
                    <p className="text-2xl font-bold text-gray-900">+{summary.totalPotentialImpact.toFixed(0)}%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-green-600">Combined improvement</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.avgConfidence}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={summary.avgConfidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Auto-Optimization Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Auto-Optimization</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Automatically apply high-confidence recommendations (95%+ confidence) without manual review
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimizationEnabled}
                  onChange={(e) => setAutoOptimizationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Optimization Recommendations</h2>
          
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
                <p className="text-gray-600">
                  Great! Your campaigns are already well-optimized. Check back later for new recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getTypeIcon(recommendation.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getPlatformEmoji(recommendation.platform)}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Campaign: {recommendation.campaignName}
                        </p>
                        
                        <p className="text-gray-700 mb-4">
                          {recommendation.description}
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-900 mb-2">Expected Impact</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-blue-600">Current Value</p>
                              <p className="font-semibold text-blue-900">
                                {formatMetric(recommendation.expectedImpact.metric, recommendation.currentValue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600">Recommended Value</p>
                              <p className="font-semibold text-blue-900">
                                {formatMetric(recommendation.expectedImpact.metric, recommendation.recommendedValue)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                +{recommendation.expectedImpact.improvement}% improvement
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600">
                                {recommendation.expectedImpact.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <details className="mb-4">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                            View AI Analysis
                          </summary>
                          <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                            {recommendation.reasoning}
                          </div>
                        </details>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Timer className="h-4 w-4" />
                          <span>Estimated time: {recommendation.estimatedTimeToImplement}</span>
                          <span className="text-gray-400">•</span>
                          <Clock className="h-4 w-4" />
                          <span>{new Date(recommendation.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      {recommendation.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(recommendation.actionUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View in Platform
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyRecommendation(recommendation.id, 'dismiss')}
                        disabled={isApplying === recommendation.id}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyRecommendation(recommendation.id, 'schedule')}
                        disabled={isApplying === recommendation.id}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      
                      <Button
                        onClick={() => handleApplyRecommendation(recommendation.id, 'apply')}
                        disabled={isApplying === recommendation.id}
                        className="flex items-center gap-2"
                      >
                        {isApplying === recommendation.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}