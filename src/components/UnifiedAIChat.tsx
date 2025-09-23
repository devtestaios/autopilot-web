'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Settings,
  Zap,
  ChevronDown,
  ChevronUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Shield,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  DollarSign,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Navigation,
  Cog,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { useToast } from '@/components/ui/Toast';
import GlassCard from '@/components/ui/GlassCard';

// ============================================================================
// UNIFIED CHAT TYPES - Consolidating from all 4 components
// ============================================================================

interface UnifiedChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  actions?: UnifiedChatAction[];
  context?: {
    page: string;
    data?: any;
  };
}

interface UnifiedChatAction {
  id: string;
  type: 'navigation' | 'campaign_action' | 'optimization' | 'analysis' | 'ui_control';
  function: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  parameters?: any;
  impact?: 'low' | 'medium' | 'high';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  requiresApproval?: boolean;
  status?: 'pending' | 'approved' | 'executed' | 'rejected';
  action: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  context?: string;
}

// ============================================================================
// UNIFIED CHAT COMPONENT PROPS
// ============================================================================

interface UnifiedAIChatProps {
  // Display Mode
  mode?: 'floating' | 'control' | 'analytics' | 'embedded' | 'sidebar' | 'assistant' | 'advanced';
  
  // Position (for floating mode)
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  
  // Features to enable
  features?: ('actions' | 'insights' | 'controls' | 'quickActions' | 'suggestions' | 'autonomousMode' | 'platformControl' | 'analytics' | 'approvals')[];
  
  // Specializations (for context-aware responses)
  specializations?: ('platformControl' | 'campaignManagement' | 'optimization' | 'analytics' | 'navigation' | 'budget' | 'targeting')[];
  
  // Behavior
  defaultMinimized?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  
  // Callbacks
  onToggle?: (isOpen: boolean) => void;
  onMessage?: (message: string) => void;
  
  // Context
  pageContext?: string;
  contextData?: any;
}

// ============================================================================
// UNIFIED AI CHAT COMPONENT
// ============================================================================

export default function UnifiedAIChat({
  mode = 'floating',
  position = 'bottom-right',
  features = ['actions', 'insights', 'suggestions'],
  defaultMinimized = true,
  defaultExpanded = false,
  className,
  onToggle,
  onMessage,
  pageContext,
  contextData
}: UnifiedAIChatProps) {
  
  // ========== CORE STATE ==========
  const [isOpen, setIsOpen] = useState(!defaultMinimized);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(pageContext || '');
  
  // ========== UNIFIED AI CONTEXT ==========
  const {
    messages: contextMessages,
    isTyping,
    sendMessage,
    executeAIAction,
    autonomousMode,
    humanApprovalRequired,
    aiStatus,
    insights,
    autoOptimization,
    capabilities
  } = useUnifiedAI();
  
  // ========== LOCAL MESSAGES (for component-specific chats) ==========
  const [localMessages, setLocalMessages] = useState<UnifiedChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: getWelcomeMessage(mode),
      timestamp: new Date(),
      suggestions: getInitialSuggestions(mode)
    }
  ]);
  
  // ========== REFS ==========
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // ========== PAGE DETECTION ==========
  useEffect(() => {
    if (!pageContext) {
      const path = window.location.pathname;
      const page = path.split('/')[1] || 'dashboard';
      setCurrentPage(page);
    }
  }, [pageContext]);
  
  // ========== AUTO SCROLL ==========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);
  
  // ========== TOGGLE HANDLERS ==========
  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
    
    if (newState && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, onToggle]);
  
  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setIsExpanded(false);
    }
  }, [isMinimized]);
  
  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setIsMinimized(false);
    }
  }, [isExpanded]);
  
  // ========== MESSAGE HANDLING ==========
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: UnifiedChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      context: {
        page: currentPage,
        data: contextData
      }
    };
    
    setLocalMessages(prev => [...prev, userMessage]);
    setInputValue('');
    onMessage?.(inputValue);
    
    try {
      // Use unified AI context to send message
      await sendMessage(inputValue, {
        page: currentPage,
        mode,
        features,
        data: contextData
      });
      
      // For now, we'll add a mock response since the context manages the real AI
      // In production, this would be handled by the unified context
      setTimeout(() => {
        const mockResponse: UnifiedChatMessage = {
          id: Date.now().toString(),
          content: generateMockResponse(inputValue, mode, currentPage),
          role: 'assistant',
          timestamp: new Date(),
          suggestions: generateSuggestions(currentPage),
          actions: generateActions(inputValue, currentPage)
        };
        setLocalMessages(prev => [...prev, mockResponse]);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      showToast({ type: 'error', title: 'Error sending message' });
    }
  }, [inputValue, currentPage, contextData, mode, features, sendMessage, onMessage, showToast]);
  
  // ========== ACTION HANDLING ==========
  const handleActionExecute = useCallback(async (action: UnifiedChatAction) => {
    try {
      if (humanApprovalRequired && action.requiresApproval && !autonomousMode) {
        showToast({ type: 'warning', title: `Action "${action.label}" requires approval` });
        return;
      }
      
      await executeAIAction({
        type: action.type,
        function: action.function,
        arguments: action.parameters || {}
      });
      
      showToast({ type: 'success', title: `Executed: ${action.label}` });
    } catch (error) {
      console.error('Error executing action:', error);
      showToast({ type: 'error', title: `Failed to execute: ${action.label}` });
    }
  }, [executeAIAction, humanApprovalRequired, autonomousMode, showToast]);
  
  // ========== QUICK ACTIONS ==========
  const getQuickActions = useCallback((): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'help',
        label: 'Get Help',
        icon: <HelpCircle className="w-4 h-4" />,
        description: 'Ask for assistance',
        action: () => setInputValue('How can you help me?')
      }
    ];
    
    switch (currentPage) {
      case 'campaigns':
        return [
          ...baseActions,
          {
            id: 'optimize',
            label: 'Optimize Campaigns',
            icon: <Zap className="w-4 h-4" />,
            description: 'AI-powered optimization',
            action: () => setInputValue('Optimize my campaigns')
          },
          {
            id: 'analyze',
            label: 'Analyze Performance',
            icon: <BarChart3 className="w-4 h-4" />,
            description: 'Performance insights',
            action: () => setInputValue('Analyze campaign performance')
          }
        ];
      
      case 'analytics':
        return [
          ...baseActions,
          {
            id: 'insights',
            label: 'Generate Insights',
            icon: <Lightbulb className="w-4 h-4" />,
            description: 'AI-powered insights',
            action: () => setInputValue('Generate insights from my data')
          },
          {
            id: 'forecast',
            label: 'Forecast Trends',
            icon: <TrendingUp className="w-4 h-4" />,
            description: 'Predict future performance',
            action: () => setInputValue('Forecast performance trends')
          }
        ];
      
      default:
        return baseActions;
    }
  }, [currentPage]);
  
  // ========== RENDER METHODS ==========
  const renderHeader = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h3>
          <div className="flex items-center space-x-1">
            <div className={cn(
              "w-2 h-2 rounded-full",
              aiStatus === 'active' ? 'bg-green-500' : 
              aiStatus === 'processing' ? 'bg-yellow-500 animate-pulse' : 
              'bg-gray-400'
            )} />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {aiStatus}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {mode === 'floating' && (
          <>
            <button
              onClick={handleMinimize}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExpand}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </>
        )}
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
  
  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {localMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex space-x-3",
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg self-start">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {/* Message Actions */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Suggested Actions:
                </div>
                <div className="space-y-1">
                  {message.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionExecute(action)}
                      className={cn(
                        "w-full flex items-center space-x-2 p-2 rounded text-xs transition-colors",
                        action.variant === 'primary' && 'bg-blue-100 hover:bg-blue-200 text-blue-700',
                        action.variant === 'success' && 'bg-green-100 hover:bg-green-200 text-green-700',
                        action.variant === 'warning' && 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
                        action.variant === 'danger' && 'bg-red-100 hover:bg-red-200 text-red-700',
                        !action.variant && 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      )}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                      {action.requiresApproval && (
                        <Shield className="w-3 h-3 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Try asking:
                </div>
                <div className="space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="block w-full text-left text-xs p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {message.role === 'user' && (
            <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg self-start">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex space-x-3">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
  
  const renderQuickActions = () => {
    if (!features.includes('quickActions')) return null;
    
    const quickActions = getQuickActions();
    
    return (
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.slice(0, 4).map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs transition-colors"
            >
              {action.icon}
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderInput = () => (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about your campaigns..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
  
  // ========== MODE-SPECIFIC RENDERING ==========
  if (mode === 'floating') {
    if (!isOpen) {
      return (
        <motion.button
          onClick={handleToggle}
          className={cn(
            "fixed z-50 p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg transition-all duration-200",
            position === 'bottom-right' && 'bottom-6 right-6',
            position === 'bottom-left' && 'bottom-6 left-6',
            position === 'top-right' && 'top-6 right-6',
            position === 'top-left' && 'top-6 left-6',
            className
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          "fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700",
          position === 'bottom-right' && 'bottom-6 right-6',
          position === 'bottom-left' && 'bottom-6 left-6',
          position === 'top-right' && 'top-6 right-6',
          position === 'top-left' && 'top-6 left-6',
          isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {renderHeader()}
          {!isMinimized && (
            <>
              {renderMessages()}
              {renderQuickActions()}
              {renderInput()}
            </>
          )}
        </div>
      </motion.div>
    );
  }
  
  // Embedded mode
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700",
      isExpanded ? 'h-[600px]' : 'h-96',
      className
    )}>
      <div className="flex flex-col h-full">
        {renderHeader()}
        {renderMessages()}
        {renderQuickActions()}
        {renderInput()}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWelcomeMessage(mode: string): string {
  switch (mode) {
    case 'control':
      return "🤖 **AI Control Assistant Active**\n\nI now have control capabilities for your marketing platform. I can:\n\n• **Navigate** between pages\n• **Create & modify** campaigns\n• **Optimize** performance automatically\n• **Manage** budgets and targeting\n• **Control** dashboard elements\n\nJust tell me what you'd like me to do! I'll ask for approval on major changes.";
    case 'analytics':
      return "Hi! I'm your AI analytics assistant. I can analyze your data, generate insights, and help you understand your marketing performance. How can I help?";
    case 'assistant':
      return "👋 Hi! I'm your AI Marketing Assistant. I can help you optimize campaigns, analyze performance, and provide strategic recommendations. What would you like to work on today?";
    case 'advanced':
      return "Hello! I'm your advanced AI marketing assistant. I can help you optimize campaigns, analyze performance, manage budgets, and navigate the platform. What would you like me to help you with today?";
    case 'floating':
      return "Hello! I'm your AI marketing assistant. I can help you with campaigns, analytics, optimization, and platform navigation. What can I do for you?";
    default:
      return "Hello! I'm your AI assistant. How can I help you today?";
  }
}

function getInitialSuggestions(mode: string): string[] {
  switch (mode) {
    case 'control':
      return [
        "Show me campaign performance",
        "Create a new campaign",
        "Optimize my top campaign",
        "Navigate to analytics"
      ];
    case 'analytics':
      return [
        "Analyze my performance",
        "Generate insights",
        "Show me trends",
        "Forecast future performance"
      ];
    case 'assistant':
      return [
        "Optimize my campaigns",
        "Analyze performance data",
        "Create a new campaign",
        "Budget recommendations"
      ];
    case 'advanced':
      return [
        "Optimize my campaigns",
        "Analyze performance data", 
        "Create a new campaign",
        "Navigate to dashboard"
      ];
    default:
      return [
        "How can you help me?",
        "Show me my campaign performance",
        "Optimize my campaigns",
        "What insights do you have?"
      ];
  }
}

function generateMockResponse(input: string, mode: string, page: string): string {
  const responses = {
    campaigns: "I've analyzed your campaigns and found several optimization opportunities. Would you like me to show you the details?",
    analytics: "Based on your data, I can see some interesting trends. Your conversion rates have improved by 15% this month.",
    optimization: "I've identified 3 campaigns that could benefit from budget reallocation. Shall I implement these changes?",
    default: "I understand you're asking about: \"" + input + "\". Let me help you with that based on your current " + page + " context."
  };
  
  if (input.toLowerCase().includes('campaign')) return responses.campaigns;
  if (input.toLowerCase().includes('analytic') || input.toLowerCase().includes('performance')) return responses.analytics;
  if (input.toLowerCase().includes('optimize')) return responses.optimization;
  
  return responses.default;
}

function generateSuggestions(page: string): string[] {
  switch (page) {
    case 'campaigns':
      return [
        "Optimize campaign budgets",
        "Analyze performance trends",
        "Create A/B tests"
      ];
    case 'analytics':
      return [
        "Generate performance report",
        "Compare period performance",
        "Forecast next month"
      ];
    default:
      return [
        "Show me insights",
        "Help with optimization",
        "Navigate to reports"
      ];
  }
}

function generateActions(input: string, page: string): UnifiedChatAction[] {
  const actions: UnifiedChatAction[] = [];
  
  if (input.toLowerCase().includes('campaign')) {
    actions.push({
      id: 'view-campaigns',
      type: 'navigation',
      function: 'navigate_to_page',
      label: 'View Campaigns',
      icon: <Target className="w-4 h-4" />,
      variant: 'primary',
      action: () => {
        const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
        if (router) router.push('/campaigns');
      }
    });
  }
  
  if (input.toLowerCase().includes('analytic') || input.toLowerCase().includes('performance')) {
    actions.push({
      id: 'view-analytics',
      type: 'navigation',
      function: 'navigate_to_page',
      label: 'View Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      variant: 'primary',
      action: () => {
        const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
        if (router) router.push('/analytics');
      }
    });
  }
  
  if (input.toLowerCase().includes('optimize')) {
    actions.push({
      id: 'optimize-campaigns',
      type: 'optimization',
      function: 'optimize_campaigns',
      label: 'Optimize Campaigns',
      icon: <Zap className="w-4 h-4" />,
      variant: 'success',
      requiresApproval: true,
      action: () => console.log('Optimizing campaigns')
    });
  }
  
  return actions;
}