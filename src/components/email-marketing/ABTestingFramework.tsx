'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MousePointer,
  Eye,
  Calendar,
  Filter,
  Plus,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Copy,
  Trash2,
  Edit,
  Flag,
  Star,
  ArrowRight,
  Percent,
  Globe,
  Timer,
  Activity,
  Brain,
  Sparkles,
  X,
  ExternalLink,
  LineChart,
  PieChart,
  BarChart,
  Hash,
  DollarSign,
  ShoppingCart,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  ThumbsUp,
  Award,
  Shield,
  Lightbulb,
  Database,
  Layers,
  Search,
  FileText,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';

interface ABTestingFrameworkProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTest: (testData: ABTestData) => void;
  existingCampaigns?: Campaign[];
  className?: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

interface ABTestData {
  name: string;
  description: string;
  testType: 'subject' | 'content' | 'sender' | 'timing' | 'multivariate';
  variants: TestVariant[];
  settings: {
    trafficSplit: number[];
    duration: number;
    sampleSize: number;
    significanceLevel: number;
    winningCriteria: 'open_rate' | 'click_rate' | 'conversion_rate' | 'revenue';
    autoPromoteWinner: boolean;
    minRunTime: number;
    maxRunTime: number;
  };
  targeting: {
    segments: string[];
    excludeSegments: string[];
    timezone: string;
    sendTimes: string[];
  };
  metrics: {
    primaryGoal: string;
    secondaryGoals: string[];
    customEvents: CustomEvent[];
  };
  automation: {
    enabled: boolean;
    stopOnSignificance: boolean;
    promotionThreshold: number;
    fallbackAction: 'promote_control' | 'manual_review' | 'extend_test';
  };
}

interface TestVariant {
  id: string;
  name: string;
  type: 'control' | 'variant';
  subject?: string;
  content?: string;
  senderName?: string;
  senderEmail?: string;
  sendTime?: string;
  preheader?: string;
  callToAction?: string;
  design?: {
    template: string;
    colors: string[];
    layout: string;
  };
  allocation: number;
}

interface CustomEvent {
  id: string;
  name: string;
  description: string;
  trackingCode: string;
  valueType: 'count' | 'revenue' | 'duration';
}

interface TestResult {
  variantId: string;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
    unsubscribed: number;
    bounced: number;
  };
  rates: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    unsubscribeRate: number;
    bounceRate: number;
  };
  confidence: number;
  significance: number;
  isWinner: boolean;
  improvement: number;
}

const defaultVariants: TestVariant[] = [
  {
    id: 'control',
    name: 'Control (Version A)',
    type: 'control',
    subject: 'Your Original Subject Line',
    content: 'Your original email content...',
    allocation: 50
  },
  {
    id: 'variant-1',
    name: 'Variant B',
    type: 'variant',
    subject: 'Alternative Subject Line',
    content: 'Alternative email content...',
    allocation: 50
  }
];

const testTypeOptions = [
  {
    id: 'subject',
    name: 'Subject Line',
    description: 'Test different subject lines to improve open rates',
    icon: Mail,
    color: 'bg-blue-500',
    metrics: ['open_rate', 'delivery_rate']
  },
  {
    id: 'content',
    name: 'Email Content',
    description: 'Test different email content and layouts',
    icon: FileText,
    color: 'bg-green-500',
    metrics: ['click_rate', 'conversion_rate', 'time_spent']
  },
  {
    id: 'sender',
    name: 'Sender Details',
    description: 'Test different sender names and email addresses',
    icon: Users,
    color: 'bg-purple-500',
    metrics: ['open_rate', 'trust_score']
  },
  {
    id: 'timing',
    name: 'Send Time',
    description: 'Test different send times and days',
    icon: Clock,
    color: 'bg-orange-500',
    metrics: ['open_rate', 'click_rate', 'engagement_time']
  },
  {
    id: 'multivariate',
    name: 'Multivariate',
    description: 'Test multiple elements simultaneously',
    icon: Layers,
    color: 'bg-red-500',
    metrics: ['overall_performance', 'interaction_effects']
  }
];

const winningCriteriaOptions = [
  { value: 'open_rate', label: 'Open Rate', icon: Eye, description: 'Highest email open rate' },
  { value: 'click_rate', label: 'Click Rate', icon: MousePointer, description: 'Highest click-through rate' },
  { value: 'conversion_rate', label: 'Conversion Rate', icon: Target, description: 'Highest conversion rate' },
  { value: 'revenue', label: 'Revenue', icon: DollarSign, description: 'Highest revenue generated' }
];

export default function ABTestingFramework({
  isOpen,
  onClose,
  onCreateTest,
  existingCampaigns = [],
  className = ''
}: ABTestingFrameworkProps) {
  const { generateResponse, isLoading: aiLoading } = useUnifiedAI();
  
  // Core state
  const [activeTab, setActiveTab] = useState<'setup' | 'variants' | 'targeting' | 'metrics' | 'automation'>('setup');
  const [testData, setTestData] = useState<ABTestData>({
    name: '',
    description: '',
    testType: 'subject',
    variants: defaultVariants,
    settings: {
      trafficSplit: [50, 50],
      duration: 7,
      sampleSize: 1000,
      significanceLevel: 95,
      winningCriteria: 'open_rate',
      autoPromoteWinner: true,
      minRunTime: 24,
      maxRunTime: 168
    },
    targeting: {
      segments: [],
      excludeSegments: [],
      timezone: 'UTC',
      sendTimes: ['09:00', '14:00']
    },
    metrics: {
      primaryGoal: 'open_rate',
      secondaryGoals: ['click_rate'],
      customEvents: []
    },
    automation: {
      enabled: true,
      stopOnSignificance: true,
      promotionThreshold: 95,
      fallbackAction: 'manual_review'
    }
  });
  
  // UI state
  const [selectedTestType, setSelectedTestType] = useState(testTypeOptions[0]);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Update test type
  const handleTestTypeChange = useCallback((testType: string) => {
    const selectedType = testTypeOptions.find(t => t.id === testType) || testTypeOptions[0];
    setSelectedTestType(selectedType);
    setTestData(prev => ({
      ...prev,
      testType: testType as any,
      settings: {
        ...prev.settings,
        winningCriteria: selectedType.metrics[0] as any
      }
    }));
  }, []);

  // Add variant
  const addVariant = useCallback(() => {
    const newVariant: TestVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${String.fromCharCode(65 + testData.variants.length)}`,
      type: 'variant',
      allocation: Math.floor(100 / (testData.variants.length + 1))
    };

    // Redistribute allocations
    const totalVariants = testData.variants.length + 1;
    const evenAllocation = Math.floor(100 / totalVariants);
    const remainder = 100 - (evenAllocation * totalVariants);

    const updatedVariants = testData.variants.map((variant, index) => ({
      ...variant,
      allocation: evenAllocation + (index < remainder ? 1 : 0)
    }));

    updatedVariants.push({
      ...newVariant,
      allocation: evenAllocation + (testData.variants.length < remainder ? 1 : 0)
    });

    setTestData(prev => ({
      ...prev,
      variants: updatedVariants,
      settings: {
        ...prev.settings,
        trafficSplit: updatedVariants.map(v => v.allocation)
      }
    }));
  }, [testData.variants]);

  // Update variant
  const updateVariant = useCallback((variantId: string, updates: Partial<TestVariant>) => {
    setTestData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      )
    }));
  }, []);

  // Remove variant
  const removeVariant = useCallback((variantId: string) => {
    if (testData.variants.length <= 2) {
      toast.error('A/B test requires at least 2 variants');
      return;
    }

    const remainingVariants = testData.variants.filter(v => v.id !== variantId);
    const evenAllocation = Math.floor(100 / remainingVariants.length);
    const remainder = 100 - (evenAllocation * remainingVariants.length);

    const redistributedVariants = remainingVariants.map((variant, index) => ({
      ...variant,
      allocation: evenAllocation + (index < remainder ? 1 : 0)
    }));

    setTestData(prev => ({
      ...prev,
      variants: redistributedVariants,
      settings: {
        ...prev.settings,
        trafficSplit: redistributedVariants.map(v => v.allocation)
      }
    }));
  }, [testData.variants]);

  // Generate AI variants
  const generateAIVariants = useCallback(async () => {
    setIsGeneratingVariants(true);
    
    try {
      const prompt = `
        Generate A/B test variants for ${testData.testType} testing:
        
        Test Type: ${selectedTestType.name}
        Campaign Goal: ${testData.settings.winningCriteria}
        Current Control: ${testData.variants[0]?.subject || testData.variants[0]?.content || 'Not specified'}
        
        Please generate 3-5 high-performing variants that test different approaches:
        1. For subject lines: test emotional vs rational, short vs long, personalized vs generic
        2. For content: test different value propositions, CTAs, layouts
        3. For sender: test company vs personal, different authority levels
        4. For timing: test different days/times based on audience behavior
        
        Return as JSON array with format:
        [{
          "name": "Variant Name",
          "subject": "Subject line (if applicable)",
          "content": "Content (if applicable)", 
          "rationale": "Why this variant should perform well"
        }]
      `;

      const response = await generateResponse(prompt, 'ab-test-variants');
      
      try {
        const aiVariants = JSON.parse(response);
        
        if (Array.isArray(aiVariants) && aiVariants.length > 0) {
          const newVariants = aiVariants.slice(0, 4).map((variant, index) => ({
            id: `ai-variant-${Date.now()}-${index}`,
            name: variant.name || `AI Variant ${index + 1}`,
            type: 'variant' as const,
            subject: variant.subject || undefined,
            content: variant.content || undefined,
            allocation: Math.floor(100 / (aiVariants.length + 1))
          }));

          // Keep control and add AI variants
          const control = testData.variants[0];
          const allVariants = [control, ...newVariants];
          const evenAllocation = Math.floor(100 / allVariants.length);
          const remainder = 100 - (evenAllocation * allVariants.length);

          const finalVariants = allVariants.map((variant, index) => ({
            ...variant,
            allocation: evenAllocation + (index < remainder ? 1 : 0)
          }));

          setTestData(prev => ({
            ...prev,
            variants: finalVariants,
            settings: {
              ...prev.settings,
              trafficSplit: finalVariants.map(v => v.allocation)
            }
          }));

          toast.success(`Generated ${newVariants.length} AI-powered variants`);
        }
      } catch (parseError) {
        console.error('Failed to parse AI variants:', parseError);
        toast.error('AI generation failed - invalid response format');
      }
    } catch (error) {
      console.error('AI variant generation error:', error);
      toast.error('Failed to generate AI variants');
    } finally {
      setIsGeneratingVariants(false);
    }
  }, [testData, selectedTestType, generateResponse]);

  // Calculate statistical power
  const calculateStatisticalPower = useCallback(() => {
    const { sampleSize, significanceLevel } = testData.settings;
    const variants = testData.variants.length;
    
    // Simplified power calculation
    const alpha = (100 - significanceLevel) / 100;
    const effectSize = 0.1; // Assume 10% relative improvement
    const powerEstimate = Math.min(95, 60 + (sampleSize / variants / 100) * 10);
    
    return {
      power: powerEstimate,
      recommendedSampleSize: Math.max(1000, variants * 500),
      minDetectableEffect: Math.max(5, 20 - (sampleSize / 1000) * 2)
    };
  }, [testData.settings, testData.variants.length]);

  // Handle save
  const handleSave = useCallback(() => {
    // Validation
    if (!testData.name.trim()) {
      toast.error('Please enter a test name');
      return;
    }

    if (testData.variants.length < 2) {
      toast.error('A/B test requires at least 2 variants');
      return;
    }

    if (testData.variants.some(v => !v.subject && !v.content)) {
      toast.error('All variants must have content');
      return;
    }

    onCreateTest(testData);
    toast.success('A/B test created successfully');
  }, [testData, onCreateTest]);

  if (!isOpen) return null;

  const statisticalPower = calculateStatisticalPower();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              A/B Testing Framework
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create sophisticated A/B tests to optimize email performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateAIVariants}
              disabled={isGeneratingVariants || aiLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingVariants ? 'Generating...' : 'AI Variants'}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-140px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
              <TabsList className="grid w-full grid-cols-5 p-2 m-4">
                <TabsTrigger value="setup" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Setup
                </TabsTrigger>
                <TabsTrigger value="variants" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  Variants
                </TabsTrigger>
                <TabsTrigger value="targeting" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Targeting
                </TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="automation" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Automation
                </TabsTrigger>
              </TabsList>

              {/* Setup Tab */}
              <TabsContent value="setup" className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Test Name
                      </label>
                      <Input
                        value={testData.name}
                        onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Subject Line Optimization Q4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={testData.description}
                        onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the goal and hypothesis of this test..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Test Type
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {testTypeOptions.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div
                              key={type.id}
                              onClick={() => handleTestTypeChange(type.id)}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                testData.testType === type.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {type.name}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Test Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sample Size
                          </label>
                          <Input
                            type="number"
                            value={testData.settings.sampleSize}
                            onChange={(e) => setTestData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, sampleSize: parseInt(e.target.value) || 1000 }
                            }))}
                            min="100"
                            max="100000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Test Duration (days)
                          </label>
                          <Input
                            type="number"
                            value={testData.settings.duration}
                            onChange={(e) => setTestData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, duration: parseInt(e.target.value) || 7 }
                            }))}
                            min="1"
                            max="30"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Significance Level: {testData.settings.significanceLevel}%
                          </label>
                          <Slider
                            value={[testData.settings.significanceLevel]}
                            onValueChange={([value]) => setTestData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, significanceLevel: value }
                            }))}
                            min={90}
                            max={99}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Winning Criteria
                          </label>
                          <select
                            value={testData.settings.winningCriteria}
                            onChange={(e) => setTestData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, winningCriteria: e.target.value as any }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          >
                            {winningCriteriaOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Statistical Power</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Power</span>
                            <span>{statisticalPower.power.toFixed(1)}%</span>
                          </div>
                          <Progress value={statisticalPower.power} className="w-full" />
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>Recommended sample size: {statisticalPower.recommendedSampleSize.toLocaleString()}</div>
                          <div>Min detectable effect: {statisticalPower.minDetectableEffect}%</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Test Variants ({testData.variants.length})
                  </h3>
                  <Button onClick={addVariant} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {testData.variants.map((variant, index) => (
                    <Card key={variant.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={variant.type === 'control' ? 'default' : 'secondary'}>
                              {variant.type === 'control' ? 'Control' : 'Variant'}
                            </Badge>
                            <span className="font-medium">{variant.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {variant.allocation}%
                            </span>
                            {variant.type !== 'control' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVariant(variant.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(testData.testType === 'subject' || testData.testType === 'multivariate') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Subject Line
                            </label>
                            <Input
                              value={variant.subject || ''}
                              onChange={(e) => updateVariant(variant.id, { subject: e.target.value })}
                              placeholder="Enter subject line..."
                            />
                          </div>
                        )}

                        {(testData.testType === 'content' || testData.testType === 'multivariate') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email Content
                            </label>
                            <Textarea
                              value={variant.content || ''}
                              onChange={(e) => updateVariant(variant.id, { content: e.target.value })}
                              placeholder="Enter email content..."
                              rows={4}
                            />
                          </div>
                        )}

                        {(testData.testType === 'sender' || testData.testType === 'multivariate') && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sender Name
                              </label>
                              <Input
                                value={variant.senderName || ''}
                                onChange={(e) => updateVariant(variant.id, { senderName: e.target.value })}
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sender Email
                              </label>
                              <Input
                                value={variant.senderEmail || ''}
                                onChange={(e) => updateVariant(variant.id, { senderEmail: e.target.value })}
                                placeholder="john@company.com"
                              />
                            </div>
                          </div>
                        )}

                        {(testData.testType === 'timing' || testData.testType === 'multivariate') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Send Time
                            </label>
                            <Input
                              type="time"
                              value={variant.sendTime || ''}
                              onChange={(e) => updateVariant(variant.id, { sendTime: e.target.value })}
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Traffic Allocation: {variant.allocation}%
                          </label>
                          <Slider
                            value={[variant.allocation]}
                            onValueChange={([value]) => {
                              // Simple allocation update - in real implementation, you'd redistribute properly
                              updateVariant(variant.id, { allocation: value });
                            }}
                            min={10}
                            max={80}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Targeting Tab */}
              <TabsContent value="targeting" className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience Segments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Include Segments
                        </label>
                        <div className="space-y-2">
                          {['New Subscribers', 'Active Users', 'High Value Customers', 'Engaged Readers'].map((segment) => (
                            <div key={segment} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={segment}
                                checked={testData.targeting.segments.includes(segment)}
                                onChange={(e) => {
                                  const segments = e.target.checked
                                    ? [...testData.targeting.segments, segment]
                                    : testData.targeting.segments.filter(s => s !== segment);
                                  setTestData(prev => ({
                                    ...prev,
                                    targeting: { ...prev.targeting, segments }
                                  }));
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={segment} className="text-sm text-gray-700 dark:text-gray-300">
                                {segment}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Exclude Segments
                        </label>
                        <div className="space-y-2">
                          {['Unsubscribed', 'Bounced Emails', 'Inactive Users'].map((segment) => (
                            <div key={segment} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`exclude-${segment}`}
                                checked={testData.targeting.excludeSegments.includes(segment)}
                                onChange={(e) => {
                                  const excludeSegments = e.target.checked
                                    ? [...testData.targeting.excludeSegments, segment]
                                    : testData.targeting.excludeSegments.filter(s => s !== segment);
                                  setTestData(prev => ({
                                    ...prev,
                                    targeting: { ...prev.targeting, excludeSegments }
                                  }));
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`exclude-${segment}`} className="text-sm text-gray-700 dark:text-gray-300">
                                {segment}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Timing & Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={testData.targeting.timezone}
                          onChange={(e) => setTestData(prev => ({
                            ...prev,
                            targeting: { ...prev.targeting, timezone: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Send Times
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {testData.targeting.sendTimes.map((time, index) => (
                            <Input
                              key={index}
                              type="time"
                              value={time}
                              onChange={(e) => {
                                const newTimes = [...testData.targeting.sendTimes];
                                newTimes[index] = e.target.value;
                                setTestData(prev => ({
                                  ...prev,
                                  targeting: { ...prev.targeting, sendTimes: newTimes }
                                }));
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Primary Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {winningCriteriaOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <div
                              key={option.value}
                              onClick={() => setTestData(prev => ({
                                ...prev,
                                metrics: { ...prev.metrics, primaryGoal: option.value }
                              }))}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                testData.metrics.primaryGoal === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium text-sm">{option.label}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Secondary Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {winningCriteriaOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`secondary-${option.value}`}
                              checked={testData.metrics.secondaryGoals.includes(option.value)}
                              onChange={(e) => {
                                const secondaryGoals = e.target.checked
                                  ? [...testData.metrics.secondaryGoals, option.value]
                                  : testData.metrics.secondaryGoals.filter(g => g !== option.value);
                                setTestData(prev => ({
                                  ...prev,
                                  metrics: { ...prev.metrics, secondaryGoals }
                                }));
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`secondary-${option.value}`} className="text-sm text-gray-700 dark:text-gray-300">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Automation Tab */}
              <TabsContent value="automation" className="p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Enable Automation
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically manage test execution and winner selection
                        </div>
                      </div>
                      <Switch
                        checked={testData.automation.enabled}
                        onCheckedChange={(checked) => setTestData(prev => ({
                          ...prev,
                          automation: { ...prev.automation, enabled: checked }
                        }))}
                      />
                    </div>

                    {testData.automation.enabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Auto-promote Winner
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Automatically send winning variant to remaining audience
                            </div>
                          </div>
                          <Switch
                            checked={testData.settings.autoPromoteWinner}
                            onCheckedChange={(checked) => setTestData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, autoPromoteWinner: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Stop on Significance
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Stop test when statistical significance is reached
                            </div>
                          </div>
                          <Switch
                            checked={testData.automation.stopOnSignificance}
                            onCheckedChange={(checked) => setTestData(prev => ({
                              ...prev,
                              automation: { ...prev.automation, stopOnSignificance: checked }
                            }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Promotion Threshold: {testData.automation.promotionThreshold}%
                          </label>
                          <Slider
                            value={[testData.automation.promotionThreshold]}
                            onValueChange={([value]) => setTestData(prev => ({
                              ...prev,
                              automation: { ...prev.automation, promotionThreshold: value }
                            }))}
                            min={90}
                            max={99}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fallback Action
                          </label>
                          <select
                            value={testData.automation.fallbackAction}
                            onChange={(e) => setTestData(prev => ({
                              ...prev,
                              automation: { ...prev.automation, fallbackAction: e.target.value as any }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          >
                            <option value="promote_control">Promote Control</option>
                            <option value="manual_review">Manual Review</option>
                            <option value="extend_test">Extend Test</option>
                          </select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {testData.variants.length} variants • {testData.settings.sampleSize.toLocaleString()} sample size • {testData.settings.duration} days
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Create A/B Test
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}