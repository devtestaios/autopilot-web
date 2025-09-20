'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Shield,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Cog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIControl } from '@/contexts/AIControlContext';
import { useToast } from '@/components/ui/Toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  actions?: ChatAction[];
}

interface ChatAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  requiresApproval?: boolean;
}

interface AIControlChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const controlActions = [
  {
    icon: <Navigation className="w-4 h-4" />,
    text: "Navigate to campaigns page",
    category: "navigation",
    action: "navigate_to_page",
    args: { page: "campaigns" }
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    text: "Create a new campaign",
    category: "campaign",
    action: "create_campaign",
    args: { requiresApproval: true }
  },
  {
    icon: <Zap className="w-4 h-4" />,
    text: "Optimize all active campaigns",
    category: "optimization",
    action: "optimize_campaigns",
    args: { type: "all" }
  },
  {
    icon: <Cog className="w-4 h-4" />,
    text: "Open AI control settings",
    category: "settings",
    action: "show_ai_settings",
    args: {}
  }
];

export default function AIControlChat({ 
  className, 
  defaultMinimized = false,
  onToggle
}: AIControlChatProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `🤖 **AI Control Assistant Active**\n\nI now have control capabilities for your marketing platform. I can:\n\n• **Navigate** between pages\n• **Create & modify** campaigns\n• **Optimize** performance automatically\n• **Manage** budgets and targeting\n• **Control** dashboard elements\n\nJust tell me what you'd like me to do! I'll ask for approval on major changes.`,
      role: 'assistant',
      timestamp: new Date(),
      suggestions: [
        "Show me campaign performance",
        "Create a new campaign",
        "Optimize my top campaign",
        "Navigate to analytics"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    aiStatus,
    autonomousMode,
    pendingActions,
    actionHistory,
    executeAIAction,
    navigateToPage,
    manageCampaigns,
    toggleAutonomousMode
  } = useAIControl();
  
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Process AI command and get response
      const aiResponse = await processAICommand(inputMessage);
      
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "I encountered an error processing your request. Please try again or check my permissions.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const processAICommand = async (command: string): Promise<{
    content: string;
    suggestions?: string[];
    actions?: ChatAction[];
  }> => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('navigate') || lowerCommand.includes('go to')) {
      if (lowerCommand.includes('campaign')) {
        await executeAIAction({
          type: 'navigation',
          function: 'navigate_to_page',
          arguments: { page: 'campaigns' },
          human_approval_required: false
        });
        return {
          content: "🧭 Navigating to campaigns page...",
          suggestions: ["Create new campaign", "Optimize campaigns", "View performance"]
        };
      } else if (lowerCommand.includes('analytic')) {
        navigateToPage('analytics');
        return {
          content: "📊 Navigating to analytics page...",
          suggestions: ["Show performance trends", "Generate report", "Compare campaigns"]
        };
      } else if (lowerCommand.includes('dashboard')) {
        navigateToPage('dashboard');
        return {
          content: "🏠 Navigating to dashboard...",
          suggestions: ["Show overview", "Check alerts", "View insights"]
        };
      }
    }
    
    // Campaign management commands
    if (lowerCommand.includes('create campaign') || lowerCommand.includes('new campaign')) {
      return {
        content: "🎯 I can create a new campaign for you. What platform would you like to use?\n\n**Available Options:**\n• Google Ads\n• Meta (Facebook/Instagram)\n• LinkedIn\n\nI'll guide you through the setup process.",
        actions: [
          {
            id: 'create_google_campaign',
            label: 'Create Google Ads Campaign',
            icon: <Sparkles className="w-4 h-4" />,
            action: () => handleCreateCampaign('google_ads'),
            variant: 'primary',
            requiresApproval: true
          },
          {
            id: 'create_meta_campaign',
            label: 'Create Meta Campaign',
            icon: <Sparkles className="w-4 h-4" />,
            action: () => handleCreateCampaign('meta'),
            variant: 'primary',
            requiresApproval: true
          }
        ]
      };
    }
    
    // Optimization commands
    if (lowerCommand.includes('optimize')) {
      return {
        content: "⚡ I can optimize your campaigns in several ways:\n\n• **Budget Optimization** - Reallocate budget to top performers\n• **Bid Optimization** - Adjust bids for better ROI\n• **Targeting Optimization** - Refine audience targeting\n• **Creative Optimization** - Test new ad variations\n\nWhich type of optimization would you like me to perform?",
        actions: [
          {
            id: 'optimize_budget',
            label: 'Optimize Budgets',
            icon: <Zap className="w-4 h-4" />,
            action: () => handleOptimization('budget'),
            variant: 'success'
          },
          {
            id: 'optimize_bids',
            label: 'Optimize Bids',
            icon: <Zap className="w-4 h-4" />,
            action: () => handleOptimization('bids'),
            variant: 'success'
          }
        ]
      };
    }

    // Performance analysis commands
    if (lowerCommand.includes('performance') || lowerCommand.includes('analytics')) {
      return {
        content: "📈 **Performance Analysis**\n\nI'm analyzing your campaign data...\n\n**Key Insights:**\n• Google Ads: +23% ROAS improvement potential\n• Meta Campaigns: Targeting optimization recommended\n• LinkedIn: Budget reallocation suggested\n\n**Immediate Actions Available:**\n• Pause underperforming campaigns\n• Increase budget on top performers\n• Update targeting parameters",
        suggestions: ["Show detailed metrics", "Apply recommendations", "Export report"]
      };
    }

    // Settings and control commands
    if (lowerCommand.includes('settings') || lowerCommand.includes('autonomous') || lowerCommand.includes('control')) {
      return {
        content: `🛡️ **AI Control Settings**\n\n**Current Status:**\n• Autonomous Mode: ${autonomousMode ? 'Enabled' : 'Disabled'}\n• AI Status: ${aiStatus}\n• Pending Actions: ${pendingActions.length}\n• Actions Completed: ${actionHistory.filter(a => a.status === 'completed').length}\n\n**Available Controls:**\n• Toggle autonomous mode\n• View action history\n• Manage permissions`,
        actions: [
          {
            id: 'toggle_autonomous',
            label: autonomousMode ? 'Disable Autonomous Mode' : 'Enable Autonomous Mode',
            icon: autonomousMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />,
            action: () => toggleAutonomousMode(),
            variant: autonomousMode ? 'warning' : 'success'
          }
        ]
      };
    }

    // Default response
    return {
      content: "I'm ready to help control your marketing platform! Here's what I can do:\n\n🧭 **Navigate** - Move between different pages\n🎯 **Campaign Management** - Create, edit, optimize campaigns\n⚡ **Optimization** - Improve performance automatically\n📊 **Analytics** - Analyze and report on performance\n🛡️ **Settings** - Manage AI permissions and control\n\nWhat would you like me to help you with?",
      suggestions: ["Navigate to campaigns", "Create new campaign", "Optimize performance", "Show analytics"]
    };
  };

  const handleCreateCampaign = async (platform: string) => {
    try {
      await executeAIAction({
        type: 'campaign_action',
        function: 'create_campaign',
        arguments: {
          platform,
          name: `AI Generated ${platform} Campaign`,
          budget: 1000,
          target_audience: 'AI recommended targeting'
        },
        human_approval_required: true
      });
      
      showToast({
        title: "Campaign Creation Initiated",
        description: `Creating ${platform} campaign with AI recommendations`,
        type: "info"
      });
    } catch (error) {
      showToast({
        title: "Campaign Creation Failed",
        description: "Unable to create campaign",
        type: "error"
      });
    }
  };

  const handleOptimization = async (type: string) => {
    try {
      await executeAIAction({
        type: 'optimization',
        function: `optimize_${type}`,
        arguments: { optimization_type: type },
        human_approval_required: false
      });
      
      showToast({
        title: "Optimization Started",
        description: `AI is optimizing ${type} across your campaigns`,
        type: "success"
      });
    } catch (error) {
      showToast({
        title: "Optimization Failed", 
        description: "Unable to run optimization",
        type: "error"
      });
    }
  };

  const handleQuickAction = (actionData: any) => {
    setInputMessage(actionData.text);
    handleSendMessage();
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    onToggle?.(!isMinimized);
  };

  return (
    <motion.div
      className={cn(
        "fixed bottom-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50",
        isMinimized ? "w-16 h-16" : "w-96 h-[600px]",
        className
      )}
      initial={false}
      animate={{
        width: isMinimized ? 64 : 384,
        height: isMinimized ? 64 : 600
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {isMinimized ? (
        // Minimized state - floating action button
        <motion.button
          onClick={toggleMinimized}
          className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 rounded-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            {pendingActions.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{pendingActions.length}</span>
              </div>
            )}
            {aiStatus === 'processing' && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </motion.button>
      ) : (
        // Expanded state - full chat interface
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                  aiStatus === 'active' ? 'bg-green-400' :
                  aiStatus === 'processing' ? 'bg-yellow-400 animate-pulse' :
                  aiStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Control Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {autonomousMode ? '🤖 Autonomous Mode' : '👤 Human Approval Mode'} • {aiStatus}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {pendingActions.length > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs text-yellow-700 dark:text-yellow-300">{pendingActions.length}</span>
                </div>
              )}
              <button
                onClick={toggleMinimized}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex space-x-2 overflow-x-auto">
              {controlActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  {action.icon}
                  <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={cn(
                            "w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            action.variant === 'primary' ? "bg-blue-500 hover:bg-blue-600 text-white" :
                            action.variant === 'success' ? "bg-green-500 hover:bg-green-600 text-white" :
                            action.variant === 'warning' ? "bg-yellow-500 hover:bg-yellow-600 text-white" :
                            action.variant === 'danger' ? "bg-red-500 hover:bg-red-600 text-white" :
                            "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          )}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                          {action.requiresApproval && (
                            <Shield className="w-3 h-3 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
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

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tell me what to do..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}