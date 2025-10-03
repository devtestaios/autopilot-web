'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap,
  Play,
  Pause,
  Square,
  Settings,
  Clock,
  Target,
  Filter,
  Mail,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Timer,
  Repeat,
  Split,
  Merge,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Save,
  Upload,
  Download,
  X,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Brain,
  Globe,
  Smartphone,
  Monitor,
  MessageSquare,
  Heart,
  Star,
  Flag,
  Send,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Percent,
  Hash,
  AtSign,
  MapPin,
  Link2,
  FileText,
  Image as ImageIcon,
  Video,
  Award,
  Shield,
  Lightbulb,
  Database,
  Code,
  Layers,
  Search,
  Activity,
  Workflow,
  GitBranch,
  Shuffle,
  RotateCw,
  FlaskConical,
  Gauge,
  Bot,
  Webhook,
  Bell,
  PieChart,
  LineChart
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

interface AdvancedAutomationWorkflowsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkflow: (workflowData: WorkflowData) => void;
  existingWorkflows?: WorkflowData[];
  className?: string;
}

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'welcome' | 'nurture' | 'reactivation' | 'abandoned_cart' | 'upsell' | 'custom';
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  settings: {
    timezone: string;
    respectQuietHours: boolean;
    quietHours: { start: string; end: string; };
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
    maxEmailsPerDay: number;
    stopOnUnsubscribe: boolean;
    trackGoals: boolean;
  };
  targeting: {
    segments: string[];
    conditions: WorkflowCondition[];
    exclusions: string[];
  };
  analytics: {
    totalEntered: number;
    activeSubscribers: number;
    completed: number;
    conversionRate: number;
    revenue: number;
    goalCompletions: number;
  };
  aiOptimization: {
    enabled: boolean;
    sendTimeOptimization: boolean;
    contentPersonalization: boolean;
    smartSegmentation: boolean;
    predictiveAnalytics: boolean;
  };
}

interface WorkflowTrigger {
  type: 'signup' | 'tag_added' | 'date_based' | 'behavior' | 'form_submit' | 'purchase' | 'api_call';
  conditions: {
    event?: string;
    tag?: string;
    date?: string;
    behavior?: string;
    formId?: string;
    productId?: string;
    customField?: string;
    operator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
    value?: string;
  };
  delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
}

interface WorkflowStep {
  id: string;
  type: 'email' | 'delay' | 'condition' | 'action' | 'split_test' | 'goal';
  name: string;
  position: { x: number; y: number; };
  config: {
    // Email step
    emailTemplate?: string;
    subject?: string;
    content?: string;
    personalizations?: Record<string, string>;
    
    // Delay step
    delay?: {
      amount: number;
      unit: 'minutes' | 'hours' | 'days' | 'weeks';
    };
    
    // Condition step
    condition?: {
      field: string;
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
      value: string;
    };
    
    // Action step
    action?: {
      type: 'add_tag' | 'remove_tag' | 'update_field' | 'send_webhook' | 'assign_score';
      target: string;
      value: string;
    };
    
    // Split test step
    splitTest?: {
      variants: Array<{
        id: string;
        name: string;
        allocation: number;
        config: any;
      }>;
      metric: 'open_rate' | 'click_rate' | 'conversion_rate';
      duration: number;
    };
    
    // Goal step
    goal?: {
      type: 'email_open' | 'email_click' | 'form_submit' | 'purchase' | 'custom_event';
      target?: string;
      value?: number;
    };
  };
  connections: {
    success?: string[];
    failure?: string[];
    default?: string[];
  };
  analytics: {
    entered: number;
    completed: number;
    bounced: number;
    conversionRate: number;
  };
}

interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'in_segment';
  value: string;
}

const workflowTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Series',
    description: 'Onboard new subscribers with a series of welcome emails',
    icon: Users,
    color: 'bg-blue-500',
    steps: 5,
    estimatedTime: '7 days'
  },
  {
    id: 'nurture',
    name: 'Lead Nurturing',
    description: 'Nurture leads with educational content and offers',
    icon: TrendingUp,
    color: 'bg-green-500',
    steps: 8,
    estimatedTime: '30 days'
  },
  {
    id: 'reactivation',
    name: 'Re-engagement',
    description: 'Win back inactive subscribers',
    icon: Repeat,
    color: 'bg-orange-500',
    steps: 3,
    estimatedTime: '14 days'
  },
  {
    id: 'abandoned_cart',
    name: 'Abandoned Cart',
    description: 'Recover abandoned shopping carts',
    icon: ShoppingCart,
    color: 'bg-red-500',
    steps: 4,
    estimatedTime: '3 days'
  },
  {
    id: 'upsell',
    name: 'Post-Purchase Upsell',
    description: 'Upsell customers after purchase',
    icon: DollarSign,
    color: 'bg-purple-500',
    steps: 6,
    estimatedTime: '21 days'
  },
  {
    id: 'custom',
    name: 'Custom Workflow',
    description: 'Build a custom workflow from scratch',
    icon: Settings,
    color: 'bg-gray-500',
    steps: 0,
    estimatedTime: 'Variable'
  }
];

const triggerTypes = [
  { id: 'signup', name: 'New Signup', icon: Users, description: 'When someone subscribes to your list' },
  { id: 'tag_added', name: 'Tag Added', icon: Flag, description: 'When a specific tag is added to a contact' },
  { id: 'date_based', name: 'Date Based', icon: Calendar, description: 'On a specific date or anniversary' },
  { id: 'behavior', name: 'Behavior', icon: Activity, description: 'Based on user behavior or actions' },
  { id: 'form_submit', name: 'Form Submit', icon: FileText, description: 'When a form is submitted' },
  { id: 'purchase', name: 'Purchase', icon: ShoppingCart, description: 'When a purchase is made' },
  { id: 'api_call', name: 'API Call', icon: Code, description: 'Via API webhook or integration' }
];

const stepTypes = [
  { id: 'email', name: 'Send Email', icon: Mail, color: 'bg-blue-500', description: 'Send an email to the subscriber' },
  { id: 'delay', name: 'Wait/Delay', icon: Clock, color: 'bg-yellow-500', description: 'Wait for a specified time' },
  { id: 'condition', name: 'Condition', icon: Split, color: 'bg-purple-500', description: 'Branch based on conditions' },
  { id: 'action', name: 'Action', icon: Zap, color: 'bg-green-500', description: 'Perform an action' },
  { id: 'split_test', name: 'A/B Test', icon: FlaskConical, color: 'bg-orange-500', description: 'Split test different approaches' },
  { id: 'goal', name: 'Goal', icon: Target, color: 'bg-red-500', description: 'Track goal completion' }
];

export default function AdvancedAutomationWorkflows({
  isOpen,
  onClose,
  onSaveWorkflow,
  existingWorkflows = [],
  className = ''
}: AdvancedAutomationWorkflowsProps) {
  const { generateResponse, isLoading: aiLoading } = useUnifiedAI();
  
  // Core state
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'settings' | 'analytics'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    id: '',
    name: '',
    description: '',
    status: 'draft',
    type: 'custom',
    trigger: {
      type: 'signup',
      conditions: {}
    },
    steps: [],
    settings: {
      timezone: 'UTC',
      respectQuietHours: true,
      quietHours: { start: '22:00', end: '08:00' },
      frequency: 'immediate',
      maxEmailsPerDay: 3,
      stopOnUnsubscribe: true,
      trackGoals: true
    },
    targeting: {
      segments: [],
      conditions: [],
      exclusions: []
    },
    analytics: {
      totalEntered: 0,
      activeSubscribers: 0,
      completed: 0,
      conversionRate: 0,
      revenue: 0,
      goalCompletions: 0
    },
    aiOptimization: {
      enabled: true,
      sendTimeOptimization: true,
      contentPersonalization: true,
      smartSegmentation: true,
      predictiveAnalytics: true
    }
  });
  
  // Builder state
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);
  
  // Canvas reference
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load template
  const loadTemplate = useCallback((templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setWorkflowData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      type: templateId as any,
      steps: generateTemplateSteps(templateId)
    }));
    
    setActiveTab('builder');
    toast.success(`Loaded ${template.name} template`);
  }, []);

  // Generate template steps
  const generateTemplateSteps = useCallback((templateId: string): WorkflowStep[] => {
    const baseSteps: WorkflowStep[] = [];
    
    switch (templateId) {
      case 'welcome':
        return [
          {
            id: 'welcome-1',
            type: 'email',
            name: 'Welcome Email',
            position: { x: 100, y: 100 },
            config: {
              subject: 'Welcome to our community!',
              content: 'Welcome email content...'
            },
            connections: { default: ['delay-1'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'delay-1',
            type: 'delay',
            name: 'Wait 1 Day',
            position: { x: 100, y: 200 },
            config: {
              delay: { amount: 1, unit: 'days' }
            },
            connections: { default: ['welcome-2'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'welcome-2',
            type: 'email',
            name: 'Getting Started Guide',
            position: { x: 100, y: 300 },
            config: {
              subject: 'Here\'s how to get started',
              content: 'Getting started email content...'
            },
            connections: { default: ['delay-2'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'delay-2',
            type: 'delay',
            name: 'Wait 3 Days',
            position: { x: 100, y: 400 },
            config: {
              delay: { amount: 3, unit: 'days' }
            },
            connections: { default: ['welcome-3'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'welcome-3',
            type: 'email',
            name: 'Special Offer',
            position: { x: 100, y: 500 },
            config: {
              subject: 'Special offer just for you!',
              content: 'Special offer email content...'
            },
            connections: { default: [] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          }
        ];
        
      case 'abandoned_cart':
        return [
          {
            id: 'cart-1',
            type: 'email',
            name: 'Cart Reminder',
            position: { x: 100, y: 100 },
            config: {
              subject: 'You left something in your cart',
              content: 'Cart reminder email content...'
            },
            connections: { default: ['delay-1'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'delay-1',
            type: 'delay',
            name: 'Wait 4 Hours',
            position: { x: 100, y: 200 },
            config: {
              delay: { amount: 4, unit: 'hours' }
            },
            connections: { default: ['cart-2'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'cart-2',
            type: 'email',
            name: 'Discount Offer',
            position: { x: 100, y: 300 },
            config: {
              subject: '10% off your cart',
              content: 'Discount offer email content...'
            },
            connections: { default: ['delay-2'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'delay-2',
            type: 'delay',
            name: 'Wait 1 Day',
            position: { x: 100, y: 400 },
            config: {
              delay: { amount: 1, unit: 'days' }
            },
            connections: { default: ['cart-3'] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          },
          {
            id: 'cart-3',
            type: 'email',
            name: 'Final Notice',
            position: { x: 100, y: 500 },
            config: {
              subject: 'Last chance - your cart expires soon',
              content: 'Final notice email content...'
            },
            connections: { default: [] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          }
        ];
        
      default:
        return [];
    }
  }, []);

  // Add new step
  const addStep = useCallback((stepType: string, position: { x: number; y: number }) => {
    const stepTemplate = stepTypes.find(s => s.id === stepType);
    if (!stepTemplate) return;

    const newStep: WorkflowStep = {
      id: `${stepType}-${Date.now()}`,
      type: stepType as any,
      name: stepTemplate.name,
      position,
      config: getDefaultStepConfig(stepType),
      connections: { default: [] },
      analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
    };

    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));

    setSelectedStep(newStep.id);
  }, []);

  // Get default step config
  const getDefaultStepConfig = useCallback((stepType: string) => {
    switch (stepType) {
      case 'email':
        return {
          subject: 'Email Subject',
          content: 'Email content...',
          personalizations: {}
        };
      case 'delay':
        return {
          delay: { amount: 1, unit: 'days' as const }
        };
      case 'condition':
        return {
          condition: {
            field: 'email_opened',
            operator: 'equals' as const,
            value: 'true'
          }
        };
      case 'action':
        return {
          action: {
            type: 'add_tag' as const,
            target: 'tag_name',
            value: 'engaged'
          }
        };
      case 'split_test':
        return {
          splitTest: {
            variants: [
              { id: 'variant-a', name: 'Variant A', allocation: 50, config: {} },
              { id: 'variant-b', name: 'Variant B', allocation: 50, config: {} }
            ],
            metric: 'open_rate' as const,
            duration: 7
          }
        };
      case 'goal':
        return {
          goal: {
            type: 'email_click' as const,
            target: 'button_click',
            value: 1
          }
        };
      default:
        return {};
    }
  }, []);

  // Update step
  const updateStep = useCallback((stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  }, []);

  // Delete step
  const deleteStep = useCallback((stepId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
    
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  }, [selectedStep]);

  // Connect steps
  const connectSteps = useCallback((fromStepId: string, toStepId: string, connectionType: 'success' | 'failure' | 'default' = 'default') => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === fromStepId) {
          const connections = { ...step.connections };
          if (!connections[connectionType]) {
            connections[connectionType] = [];
          }
          if (!connections[connectionType]!.includes(toStepId)) {
            connections[connectionType]!.push(toStepId);
          }
          return { ...step, connections };
        }
        return step;
      })
    }));
  }, []);

  // Generate AI workflow
  const generateAIWorkflow = useCallback(async () => {
    setIsGeneratingWorkflow(true);
    
    try {
      const prompt = `
        Generate an advanced email automation workflow:
        
        Type: ${workflowData.type}
        Goal: ${workflowData.description || 'Improve engagement and conversions'}
        Trigger: ${workflowData.trigger.type}
        
        Create a sophisticated workflow with:
        1. Multiple email touchpoints with different messaging strategies
        2. Conditional branching based on user behavior
        3. A/B testing opportunities
        4. Goal tracking and optimization points
        5. Delays optimized for engagement
        
        Return as JSON with format:
        {
          "name": "Workflow Name",
          "description": "Workflow description",
          "steps": [
            {
              "type": "email|delay|condition|action|split_test|goal",
              "name": "Step Name",
              "config": {...},
              "rationale": "Why this step is important"
            }
          ],
          "optimizations": ["Optimization suggestions"]
        }
      `;

      const response = await generateResponse(prompt, 'workflow-generation');
      
      try {
        const aiWorkflow = JSON.parse(response);
        
        if (aiWorkflow.steps && Array.isArray(aiWorkflow.steps)) {
          const generatedSteps: WorkflowStep[] = aiWorkflow.steps.map((step: any, index: number) => ({
            id: `ai-${step.type}-${Date.now()}-${index}`,
            type: step.type,
            name: step.name || `AI ${step.type} ${index + 1}`,
            position: { x: 100, y: 100 + (index * 100) },
            config: step.config || getDefaultStepConfig(step.type),
            connections: { default: index < aiWorkflow.steps.length - 1 ? [`ai-${aiWorkflow.steps[index + 1].type}-${Date.now()}-${index + 1}`] : [] },
            analytics: { entered: 0, completed: 0, bounced: 0, conversionRate: 0 }
          }));

          setWorkflowData(prev => ({
            ...prev,
            name: aiWorkflow.name || prev.name || 'AI Generated Workflow',
            description: aiWorkflow.description || prev.description,
            steps: generatedSteps
          }));

          toast.success(`Generated AI workflow with ${generatedSteps.length} steps`);
        }
      } catch (parseError) {
        console.error('Failed to parse AI workflow:', parseError);
        toast.error('AI generation failed - invalid response format');
      }
    } catch (error) {
      console.error('AI workflow generation error:', error);
      toast.error('Failed to generate AI workflow');
    } finally {
      setIsGeneratingWorkflow(false);
    }
  }, [workflowData, generateResponse, getDefaultStepConfig]);

  // Handle save
  const handleSave = useCallback(() => {
    // Validation
    if (!workflowData.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    if (workflowData.steps.length === 0) {
      toast.error('Workflow must have at least one step');
      return;
    }

    const finalWorkflowData = {
      ...workflowData,
      id: workflowData.id || `workflow-${Date.now()}`
    };

    onSaveWorkflow(finalWorkflowData);
    toast.success('Workflow saved successfully');
  }, [workflowData, onSaveWorkflow]);

  if (!isOpen) return null;

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
        className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Automation Workflows
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create sophisticated email automation workflows with AI optimization
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateAIWorkflow}
              disabled={isGeneratingWorkflow || aiLoading}
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGeneratingWorkflow ? 'Generating...' : 'AI Generate'}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(95vh-140px)]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
            <TabsList className="grid w-full grid-cols-4 p-2 m-4">
              <TabsTrigger value="templates" className="text-xs">
                <Layers className="w-3 h-3 mr-1" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="builder" className="text-xs">
                <Workflow className="w-3 h-3 mr-1" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="p-6 space-y-6 overflow-y-auto h-full">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose a Workflow Template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => loadTemplate(template.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {template.steps} steps • {template.estimatedTime}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {template.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {selectedTemplate && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Template Selected
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Click "Builder" tab to customize your workflow or continue with the default template.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder" className="h-full">
              <div className="flex h-full">
                {/* Left Sidebar - Steps & Properties */}
                <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Workflow Info</h3>
                      <div className="space-y-2">
                        <Input
                          value={workflowData.name}
                          onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Workflow name..."
                        />
                        <Textarea
                          value={workflowData.description}
                          onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Workflow description..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add Steps</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {stepTypes.map((stepType) => {
                          const Icon = stepType.icon;
                          return (
                            <Button
                              key={stepType.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addStep(stepType.id, { x: 200, y: 200 + (workflowData.steps.length * 100) })}
                              className="flex flex-col items-center gap-1 h-16 p-2"
                            >
                              <div className={`w-6 h-6 rounded ${stepType.color} flex items-center justify-center`}>
                                <Icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs">{stepType.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step Properties */}
                    {selectedStep && (
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Step Properties</h3>
                        {(() => {
                          const step = workflowData.steps.find(s => s.id === selectedStep);
                          if (!step) return null;

                          return (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Step Name
                                </label>
                                <Input
                                  value={step.name}
                                  onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                />
                              </div>

                              {step.type === 'email' && (
                                <>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Subject Line
                                    </label>
                                    <Input
                                      value={step.config.subject || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, subject: e.target.value }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Email Content
                                    </label>
                                    <Textarea
                                      value={step.config.content || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, content: e.target.value }
                                      })}
                                      rows={4}
                                    />
                                  </div>
                                </>
                              )}

                              {step.type === 'delay' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Amount
                                    </label>
                                    <Input
                                      type="number"
                                      value={step.config.delay?.amount || 1}
                                      onChange={(e) => updateStep(step.id, {
                                        config: {
                                          ...step.config,
                                          delay: {
                                            ...step.config.delay,
                                            amount: parseInt(e.target.value) || 1,
                                            unit: step.config.delay?.unit || 'days'
                                          }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Unit
                                    </label>
                                    <select
                                      value={step.config.delay?.unit || 'days'}
                                      onChange={(e) => updateStep(step.id, {
                                        config: {
                                          ...step.config,
                                          delay: {
                                            ...step.config.delay,
                                            amount: step.config.delay?.amount || 1,
                                            unit: e.target.value as any
                                          }
                                        }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    >
                                      <option value="minutes">Minutes</option>
                                      <option value="hours">Hours</option>
                                      <option value="days">Days</option>
                                      <option value="weeks">Weeks</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteStep(step.id)}
                                className="w-full"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete Step
                              </Button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 relative overflow-auto">
                  <div 
                    ref={canvasRef}
                    className="w-full h-full min-h-[800px] relative"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                  >
                    {/* Grid background */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />

                    {/* Workflow Steps */}
                    {workflowData.steps.map((step) => {
                      const stepType = stepTypes.find(st => st.id === step.type);
                      const Icon = stepType?.icon || Settings;
                      
                      return (
                        <div
                          key={step.id}
                          className={`absolute w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all cursor-pointer ${
                            selectedStep === step.id 
                              ? 'border-blue-500 shadow-xl z-10' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                          style={{
                            left: step.position.x,
                            top: step.position.y
                          }}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          {/* Step Header */}
                          <div className={`flex items-center gap-2 p-3 rounded-t-lg ${stepType?.color || 'bg-gray-500'}`}>
                            <Icon className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white truncate">
                              {step.name}
                            </span>
                          </div>

                          {/* Step Content */}
                          <div className="p-3">
                            {step.type === 'email' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Subject: {step.config.subject || 'No subject'}
                              </div>
                            )}
                            {step.type === 'delay' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Wait: {step.config.delay?.amount || 1} {step.config.delay?.unit || 'days'}
                              </div>
                            )}
                            {step.type === 'condition' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                If: {step.config.condition?.field || 'condition'}
                              </div>
                            )}
                            
                            {/* Step Analytics */}
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                              <span>Entered: {step.analytics.entered}</span>
                              <span>Rate: {step.analytics.conversionRate.toFixed(1)}%</span>
                            </div>
                          </div>

                          {/* Connection Points */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer" />
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-pointer" />
                        </div>
                      );
                    })}

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                      {workflowData.steps.map((step) => 
                        step.connections.default?.map((connectionId) => {
                          const targetStep = workflowData.steps.find(s => s.id === connectionId);
                          if (!targetStep) return null;

                          const startX = step.position.x + 96; // Half of step width (192/2)
                          const startY = step.position.y + 80; // Approximate step height
                          const endX = targetStep.position.x + 96;
                          const endY = targetStep.position.y;

                          return (
                            <line
                              key={`${step.id}-${connectionId}`}
                              x1={startX}
                              y1={startY}
                              x2={endX}
                              y2={endY}
                              stroke="#3b82f6"
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                          );
                        }) || []
                      )}
                      
                      {/* Arrow marker definition */}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#3b82f6"
                          />
                        </marker>
                      </defs>
                    </svg>

                    {/* Empty state */}
                    {workflowData.steps.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Workflow className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Start Building Your Workflow
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Add steps from the sidebar to create your automation workflow
                          </p>
                          <Button onClick={() => addStep('email', { x: 200, y: 200 })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Step
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Canvas Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(zoom => Math.min(zoom + 0.1, 2))}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(zoom => Math.max(zoom - 0.1, 0.5))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(1)}
                    >
                      {Math.round(zoom * 100)}%
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={workflowData.settings.timezone}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, timezone: e.target.value }
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

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Respect Quiet Hours
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Don't send emails during quiet hours
                        </div>
                      </div>
                      <Switch
                        checked={workflowData.settings.respectQuietHours}
                        onCheckedChange={(checked) => setWorkflowData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, respectQuietHours: checked }
                        }))}
                      />
                    </div>

                    {workflowData.settings.respectQuietHours && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quiet Start
                          </label>
                          <Input
                            type="time"
                            value={workflowData.settings.quietHours.start}
                            onChange={(e) => setWorkflowData(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                quietHours: { ...prev.settings.quietHours, start: e.target.value }
                              }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quiet End
                          </label>
                          <Input
                            type="time"
                            value={workflowData.settings.quietHours.end}
                            onChange={(e) => setWorkflowData(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                quietHours: { ...prev.settings.quietHours, end: e.target.value }
                              }
                            }))}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Emails Per Day: {workflowData.settings.maxEmailsPerDay}
                      </label>
                      <Slider
                        value={[workflowData.settings.maxEmailsPerDay]}
                        onValueChange={([value]) => setWorkflowData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, maxEmailsPerDay: value }
                        }))}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Enable AI Optimization
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Use AI to optimize workflow performance
                        </div>
                      </div>
                      <Switch
                        checked={workflowData.aiOptimization.enabled}
                        onCheckedChange={(checked) => setWorkflowData(prev => ({
                          ...prev,
                          aiOptimization: { ...prev.aiOptimization, enabled: checked }
                        }))}
                      />
                    </div>

                    {workflowData.aiOptimization.enabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Send Time Optimization
                          </span>
                          <Switch
                            checked={workflowData.aiOptimization.sendTimeOptimization}
                            onCheckedChange={(checked) => setWorkflowData(prev => ({
                              ...prev,
                              aiOptimization: { ...prev.aiOptimization, sendTimeOptimization: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content Personalization
                          </span>
                          <Switch
                            checked={workflowData.aiOptimization.contentPersonalization}
                            onCheckedChange={(checked) => setWorkflowData(prev => ({
                              ...prev,
                              aiOptimization: { ...prev.aiOptimization, contentPersonalization: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Smart Segmentation
                          </span>
                          <Switch
                            checked={workflowData.aiOptimization.smartSegmentation}
                            onCheckedChange={(checked) => setWorkflowData(prev => ({
                              ...prev,
                              aiOptimization: { ...prev.aiOptimization, smartSegmentation: checked }
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Predictive Analytics
                          </span>
                          <Switch
                            checked={workflowData.aiOptimization.predictiveAnalytics}
                            onCheckedChange={(checked) => setWorkflowData(prev => ({
                              ...prev,
                              aiOptimization: { ...prev.aiOptimization, predictiveAnalytics: checked }
                            }))}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Entered</span>
                      <span className="font-medium">{workflowData.analytics.totalEntered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</span>
                      <span className="font-medium">{workflowData.analytics.activeSubscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="font-medium">{workflowData.analytics.completed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                      <span className="font-medium">{workflowData.analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                      <span className="font-medium">${workflowData.analytics.revenue.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Step Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflowData.steps.slice(0, 5).map((step) => (
                        <div key={step.id} className="flex justify-between items-center">
                          <span className="text-sm truncate">{step.name}</span>
                          <span className="text-sm font-medium">
                            {step.analytics.conversionRate.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                      
                      {workflowData.steps.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No steps to analyze yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimization Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Send times optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Content personalized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Segmentation pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">AI optimization active</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {workflowData.steps.length} steps • {workflowData.status} • {workflowData.analytics.totalEntered} subscribers
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}