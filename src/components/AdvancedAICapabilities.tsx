'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Zap,
  BarChart3,
  FileText,
  Search,
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Copy,
  Download,
  RefreshCw,
  PlusCircle,
  Settings
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AIPrediction {
  id: string;
  campaign_id: string;
  prediction_type: string;
  prediction_data: any;
  confidence_score: number;
  prediction_period: string;
  expires_at: string;
  created_at: string;
}

interface ContentGeneration {
  id: string;
  campaign_id?: string;
  content_type: string;
  target_platform: string;
  generated_content: any;
  is_approved: boolean;
  created_at: string;
}

interface OptimizationRecommendation {
  id: string;
  campaign_id: string;
  recommendation_type: string;
  recommended_changes: any;
  expected_impact: any;
  confidence_score: number;
  priority: string;
  status: string;
  created_at: string;
}

interface CompetitorAnalysis {
  id: string;
  industry: string;
  competitor_name?: string;
  analysis_type: string;
  analysis_data: any;
  opportunities: any;
  threats: any;
  confidence_score: number;
  created_at: string;
}

interface AIDashboardData {
  predictions_last_7d: number;
  content_generated_last_7d: number;
  active_recommendations: number;
  implemented_recommendations: number;
  average_model_accuracy: number;
  ai_features_status: {
    predictions: string;
    content_generation: string;
    competitor_analysis: string;
    optimization: string;
  };
}

export default function AdvancedAICapabilities() {
  const [dashboardData, setDashboardData] = useState<AIDashboardData | null>(null);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [contentGeneration, setContentGeneration] = useState<ContentGeneration[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [generating, setGenerating] = useState(false);

  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://autopilot-api-1.onrender.com' 
    : 'http://localhost:8000';

  useEffect(() => {
    fetchDashboardData();
    fetchPredictions();
    fetchContentGeneration();
    fetchRecommendations();
    fetchCompetitorAnalysis();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching AI dashboard data:', error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/predictions?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentGeneration = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/content-generation?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setContentGeneration(data);
      }
    } catch (error) {
      console.error('Error fetching content generation:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/recommendations?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchCompetitorAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai/competitor-analysis?limit=5`);
      if (response.ok) {
        const data = await response.json();
        setCompetitorAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
    }
  };

  const generateContent = async (contentType: string, platform: string, prompt: string) => {
    setGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/ai/content-generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: contentType,
          target_platform: platform,
          input_prompt: prompt,
          variations_count: 3
        })
      });
      
      if (response.ok) {
        fetchContentGeneration();
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const updateRecommendationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/ai/recommendations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchRecommendations();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating recommendation status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'approved': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'implemented': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading AI capabilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Advanced AI Capabilities
          </h1>
          <p className="text-muted-foreground mt-2">
            Predictive analytics, content generation, and intelligent optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Competitor
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Predictions (7d)</p>
                      <p className="text-2xl font-bold">{dashboardData.predictions_last_7d}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Content Generated</p>
                      <p className="text-2xl font-bold">{dashboardData.content_generated_last_7d}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Recommendations</p>
                      <p className="text-2xl font-bold">{dashboardData.active_recommendations}</p>
                    </div>
                    <Lightbulb className="w-8 h-8 text-orange-600" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Model Accuracy</p>
                      <p className="text-2xl font-bold">{(dashboardData.average_model_accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <Brain className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
              </div>

              {/* AI Features Status */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Features Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(dashboardData.ai_features_status).map(([feature, status]) => (
                    <div key={feature} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="capitalize font-medium">{feature.replace('_', ' ')}</span>
                      <Badge className={status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Predictions</h3>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Generate Prediction
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-500/10 text-blue-600">
                    {prediction.prediction_type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {prediction.prediction_period} forecast
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm">{(prediction.confidence_score * 100).toFixed(1)}%</span>
                  </div>

                  {prediction.prediction_data && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Predicted CTR</span>
                        <span className="text-sm">{(prediction.prediction_data.predicted_ctr * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Predicted CPA</span>
                        <span className="text-sm">${prediction.prediction_data.predicted_cpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Expected Conversions</span>
                        <span className="text-sm">{prediction.prediction_data.predicted_conversions}</span>
                      </div>
                    </>
                  )}

                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Expires: {new Date(prediction.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Generation Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Content Generation</h3>
            <Button onClick={() => generateContent('ad_copy', 'google_ads', 'Generate compelling ad copy for digital marketing services')} disabled={generating}>
              {generating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {contentGeneration.map((content) => (
              <Card key={content.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/10 text-purple-600">
                      {content.content_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {content.target_platform}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {content.generated_content && content.generated_content.variations && (
                  <div className="space-y-3">
                    {content.generated_content.variations.slice(0, 3).map((variation: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Headline:</span>
                            <p className="font-medium">{variation.headline}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Description:</span>
                            <p className="text-sm">{variation.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {variation.cta}
                            </Badge>
                            {variation.keywords && (
                              <span className="text-xs text-muted-foreground">
                                Keywords: {variation.keywords.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Optimization Recommendations</h3>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(rec.status)}>
                      {rec.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(rec.confidence_score * 100).toFixed(1)}% confidence
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">{rec.recommendation_type.replace('_', ' ')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {rec.recommended_changes.rationale || 'AI-generated optimization recommendation'}
                    </p>
                  </div>

                  {rec.expected_impact && (
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                      {Object.entries(rec.expected_impact).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs font-medium text-muted-foreground">{key.replace('_', ' ')}</p>
                          <p className="text-sm font-bold">
                            {typeof value === 'number' ? 
                              (key.includes('percentage') || key.includes('increase') ? 
                                `+${(value * 100).toFixed(1)}%` : 
                                value.toFixed(2)) : 
                              String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {rec.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        onClick={() => updateRecommendationStatus(rec.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateRecommendationStatus(rec.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitor" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Competitor Intelligence</h3>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <div className="space-y-4">
            {competitorAnalysis.map((analysis) => (
              <Card key={analysis.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{analysis.competitor_name || 'Industry Analysis'}</h4>
                    <p className="text-sm text-muted-foreground">{analysis.industry}</p>
                  </div>
                  <Badge className="bg-cyan-500/10 text-cyan-600">
                    {analysis.analysis_type.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-green-600 mb-2">Opportunities</h5>
                    <div className="space-y-2">
                      {analysis.opportunities && Object.entries(analysis.opportunities).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key.replace('_', ' ')}:</span>
                          <span className="ml-1 text-muted-foreground">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-red-600 mb-2">Threats</h5>
                    <div className="space-y-2">
                      {analysis.threats && Object.entries(analysis.threats).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key.replace('_', ' ')}:</span>
                          <span className="ml-1 text-muted-foreground">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t mt-4">
                  <span className="text-xs text-muted-foreground">
                    Confidence: {(analysis.confidence_score * 100).toFixed(1)}% | 
                    Generated: {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}