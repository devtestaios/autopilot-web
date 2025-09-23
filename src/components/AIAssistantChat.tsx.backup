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
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Settings,
  Zap,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

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
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface AIAssistantChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const predefinedQuestions = [
  {
    icon: <TrendingUp className="w-4 h-4" />,
    text: "How can I optimize my campaign performance?",
    category: "optimization"
  },
  {
    icon: <DollarSign className="w-4 h-4" />,
    text: "What's the best budget allocation strategy?",
    category: "budget"
  },
  {
    icon: <Target className="w-4 h-4" />,
    text: "Help me improve my targeting settings",
    category: "targeting"
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    text: "Analyze my campaign metrics",
    category: "analytics"
  }
];

const quickActions = [
  {
    id: 'create-campaign',
    label: 'Create Campaign',
    icon: <Sparkles className="w-4 h-4" />,
    action: () => window.location.href = '/campaigns/new',
    variant: 'primary' as const
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    action: () => window.location.href = '/analytics',
    variant: 'secondary' as const
  },
  {
    id: 'optimize-budget',
    label: 'Optimize Budget',
    icon: <DollarSign className="w-4 h-4" />,
    action: () => console.log('Optimizing budget...'),
    variant: 'success' as const
  }
];

export default function AIAssistantChat({ 
  className, 
  defaultMinimized = false,
  onToggle 
}: AIAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(!defaultMinimized);
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi! I'm your AI Marketing Assistant. I can help you optimize campaigns, analyze performance, and provide strategic recommendations. What would you like to work on today?",
      role: 'assistant',
      timestamp: new Date(),
      suggestions: [
        "Optimize my campaigns",
        "Analyze performance data",
        "Create a new campaign",
        "Budget recommendations"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onToggle?.(isOpen && !isMinimized);
  }, [isOpen, isMinimized, onToggle]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate AI response with strategic marketing insights
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let suggestions: string[] = [];
    let actions: ChatAction[] = [];

    if (input.includes('optimize') || input.includes('performance')) {
      response = "🎯 **Campaign Optimization Analysis**\n\nBased on your current campaigns, here are my recommendations:\n\n• **Bid Strategy**: Consider switching to Target CPA for better cost efficiency\n• **Keywords**: Add 15+ high-intent long-tail keywords\n• **Ad Schedule**: Peak performance detected on Tue-Thu 2-6PM\n• **Audience**: Expand lookalike audiences by 2-3%\n\nWould you like me to implement any of these optimizations automatically?";
      suggestions = ["Implement bid strategy", "Add keyword suggestions", "Optimize ad schedule", "View detailed analysis"];
      actions = [
        {
          id: 'auto-optimize',
          label: 'Auto-Optimize',
          icon: <Zap className="w-4 h-4" />,
          action: () => console.log('Auto-optimizing...'),
          variant: 'primary'
        }
      ];
    } else if (input.includes('budget') || input.includes('spend')) {
      response = "💰 **Budget Allocation Strategy**\n\nCurrent spend analysis shows:\n\n• **Top Performers**: Search campaigns (65% ROAS)\n• **Underperformers**: Display network (2.1% CTR)\n• **Recommendation**: Reallocate 30% budget from display to search\n• **Projected Impact**: +25% conversions, -15% CPA\n\nShall I create a budget reallocation plan?";
      suggestions = ["Create budget plan", "View spending breakdown", "Set budget alerts", "Forecast performance"];
      actions = [
        {
          id: 'reallocate-budget',
          label: 'Reallocate Budget',
          icon: <DollarSign className="w-4 h-4" />,
          action: () => console.log('Reallocating budget...'),
          variant: 'success'
        }
      ];
    } else if (input.includes('create') || input.includes('campaign')) {
      response = "🚀 **Campaign Creation Assistant**\n\nI'll help you create a high-performing campaign. Based on your business profile:\n\n• **Campaign Type**: Search + Performance Max\n• **Budget Recommendation**: $150/day starting budget\n• **Target Audience**: Lookalike + Custom Intent\n• **Ad Copy**: 5 headline variants + 3 descriptions\n\nWould you like me to start building this campaign for you?";
      suggestions = ["Start campaign builder", "Choose campaign type", "Set targeting options", "Create ad copy"];
      actions = [
        {
          id: 'launch-builder',
          label: 'Launch Builder',
          icon: <Sparkles className="w-4 h-4" />,
          action: () => window.location.href = '/campaigns/new',
          variant: 'primary'
        }
      ];
    } else if (input.includes('analytics') || input.includes('data')) {
      response = "📊 **Performance Analytics Insights**\n\nKey metrics analysis for last 30 days:\n\n• **CTR Improvement**: +18% vs previous period\n• **Conversion Rate**: 3.2% (above industry avg)\n• **CPA Trend**: Decreasing (-12%)\n• **Quality Score**: 8.2/10 average\n\n**Alert**: Display campaign #3 needs attention - declining performance detected.";
      suggestions = ["View full report", "Set up alerts", "Compare periods", "Export data"];
      actions = [
        {
          id: 'view-report',
          label: 'Full Report',
          icon: <BarChart3 className="w-4 h-4" />,
          action: () => window.location.href = '/analytics',
          variant: 'secondary'
        }
      ];
    } else {
      response = "🤖 I'm here to help with your marketing campaigns! I can assist with:\n\n• **Campaign Optimization** - Improve performance and ROI\n• **Budget Management** - Smart allocation strategies\n• **Analytics & Insights** - Data-driven recommendations\n• **Strategy Planning** - Long-term growth tactics\n\nWhat specific area would you like to focus on?";
      suggestions = ["Optimize my campaigns", "Budget recommendations", "View analytics", "Strategic planning"];
    }

    return {
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date(),
      suggestions,
      actions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
    sendMessage();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!isOpen) {
    return (
      <GlassCard
        className={cn(
          'fixed right-4 top-1/2 -translate-y-1/2 z-50 md:right-4 right-2',
          'w-14 h-14 shadow-lg hover:shadow-xl cursor-pointer',
          'flex items-center justify-center',
          'bg-gradient-to-r from-pulse-cyan to-pulse-purple',
          'hover:scale-110 transition-all duration-300',
          className
        )}
        onClick={toggleChat}
        intensity="light"
        animated={true}
        hover={true}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </GlassCard>
    );
  }

  if (isMinimized) {
    return (
      <GlassCard
        className={cn(
          'fixed right-4 top-1/2 -translate-y-1/2 z-50 md:right-4 right-2',
          'w-80 h-16 sm:w-80 w-72 shadow-xl',
          className
        )}
        intensity="medium"
        animated={true}
        hover={true}
      >
        <div className="flex items-center justify-between p-4 h-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              AI Assistant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={maximizeChat}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-50 md:right-4 right-2',
        'w-96 h-[600px] flex flex-col sm:w-96 w-80 sm:h-[600px] h-[500px]',
        'overflow-hidden shadow-2xl',
        className
      )}
      intensity="strong"
      animated={true}
      hover={false}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pulse-cyan/10 to-pulse-purple/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Marketing Assistant
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              Online • Ready to help
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={minimizeChat}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-gray-700 dark:text-gray-500" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-700 dark:text-gray-500" />
          </button>
        </div>
      </div>

      {/* Quick Questions (show at start) */}
      {showQuickActions && messages.length === 1 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Popular questions:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question.text)}
                className="flex items-center gap-2 p-2 text-left text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {question.icon}
                <span className="text-gray-700 dark:text-gray-300">
                  {question.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={cn(
                'max-w-[80%] rounded-xl p-3',
                message.role === 'user'
                  ? 'bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              )}
            >
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className={cn(
                    "mb-1 last:mb-0",
                    message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}>
                    {line.startsWith('•') ? (
                      <span className="pl-2">{line}</span>
                    ) : line.startsWith('**') && line.endsWith('**') ? (
                      <strong>{line.slice(2, -2)}</strong>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>

              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-gray-800 dark:text-gray-300" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="space-y-3">
            {messages[messages.length - 1].suggestions && (
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1.5 bg-pulse-cyan/10 text-pulse-cyan border border-pulse-cyan/20 rounded-full hover:bg-pulse-cyan/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages[messages.length - 1].actions && (
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].actions!.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      action.variant === 'primary' && 'bg-pulse-cyan text-white hover:bg-pulse-cyan/90',
                      action.variant === 'secondary' && 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                      action.variant === 'success' && 'bg-green-500 text-white hover:bg-green-600',
                      action.variant === 'warning' && 'bg-yellow-500 text-white hover:bg-yellow-600'
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me about campaigns, optimization, or strategy..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-cyan/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
