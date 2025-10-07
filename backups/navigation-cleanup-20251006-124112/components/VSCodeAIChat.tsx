'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Settings,
  Zap,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Play,
  Pause,
  Brain,
  Target,
  BarChart3,
  Navigation,
  HelpCircle,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';

// ============================================================================
// VS CODE STYLE AI CHAT TYPES
// ============================================================================

interface VSCodeChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  actions?: VSCodeChatAction[];
  context?: {
    page: string;
    data?: any;
  };
}

interface VSCodeChatAction {
  id: string;
  type: 'navigation' | 'campaign_action' | 'optimization' | 'analysis';
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

interface VSCodeAIChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

// ============================================================================
// VS CODE STYLE AI CHAT COMPONENT
// ============================================================================

export default function VSCodeAIChat({
  className,
  defaultMinimized = true,
  onToggle
}: VSCodeAIChatProps) {
  
  // ========== CORE STATE ==========
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(!defaultMinimized);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  
  // ========== LOCAL MESSAGES ==========
  const [messages, setMessages] = useState<VSCodeChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI assistant. I can help you navigate, optimize campaigns, analyze data, and control platform features. What would you like to do?",
      timestamp: new Date(),
      actions: [
        {
          id: 'view-dashboard',
          type: 'navigation',
          label: 'View Dashboard',
          icon: <Target className="w-3 h-3" />,
          action: () => window.location.href = '/dashboard'
        },
        {
          id: 'optimize-campaigns',
          type: 'optimization',
          label: 'Optimize Campaigns',
          icon: <Zap className="w-3 h-3" />,
          variant: 'success',
          action: () => window.location.href = '/campaigns'
        }
      ]
    }
  ]);
  
  // ========== UNIFIED AI CONTEXT ==========
  const {
    isTyping,
    sendMessage,
    autonomousMode,
    aiStatus
  } = useUnifiedAI();
  
  // ========== REFS ==========
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // ========== HYDRATION SAFETY ==========
  useEffect(() => {
    setIsMounted(true);
    // Detect current page
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const page = path.split('/')[1] || 'dashboard';
      setCurrentPage(page);
    }
  }, []);
  
  // ========== AUTO SCROLL TO BOTTOM ==========
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  // ========== HANDLERS ==========
  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
    
    if (newState && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, onToggle]);
  
  const handleMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
  }, [isMaximized]);
  
  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);
  
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: VSCodeChatMessage = {
      id: generateId(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      context: {
        page: currentPage
      }
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    
    try {
      // Send to unified AI context
      await sendMessage(currentInput, {
        page: currentPage,
        mode: 'control'
      });
      
      // Generate mock response with actions
      setTimeout(() => {
        const assistantMessage: VSCodeChatMessage = {
          id: generateId(),
          content: generateResponse(currentInput, currentPage),
          role: 'assistant',
          timestamp: new Date(),
          actions: generateActions(currentInput, currentPage)
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [inputValue, currentPage, generateId, sendMessage]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  const handleActionExecute = useCallback((action: VSCodeChatAction) => {
    try {
      action.action();
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }, []);
  
  // ========== PREVENT SSR MISMATCH ==========
  if (!isMounted) {
    return null;
  }
  
  // ========== MINIMIZED STATE (Floating Button) ==========
  if (!isOpen) {
    return (
      <motion.button
        onClick={handleToggle}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-200",
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          {autonomousMode && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </motion.button>
    );
  }
  
  // ========== VS CODE STYLE CHAT INTERFACE ==========
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        "fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl",
        "flex flex-col",
        // VS Code style positioning - bottom right with input at bottom
        "bottom-6 right-6",
        // Dynamic sizing like VS Code
        isMaximized 
          ? "w-[500px] h-[700px]" // Maximized like VS Code chat
          : "w-[400px] h-[500px]", // Default VS Code chat size
        // Rounded corners
        "rounded-lg overflow-hidden",
        className
      )}
    >
      {/* ========== HEADER (VS Code Style) ========== */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              AI Assistant
            </span>
            {autonomousMode && (
              <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Autonomous</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMaximize}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* ========== MESSAGES AREA (Scrollable from bottom like VS Code) ========== */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          scrollBehavior: 'smooth',
          // Start scrolled to bottom like VS Code
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex space-x-3",
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              message.role === 'assistant' 
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </div>
            
            {/* Message Content */}
            <div className={cn(
              "flex-1 max-w-[85%]",
              message.role === 'user' ? 'text-right' : 'text-left'
            )}>
              <div className={cn(
                "rounded-lg p-3 text-sm",
                message.role === 'user'
                  ? 'bg-teal-600 text-white ml-auto inline-block'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              )}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {/* Actions (VS Code style buttons) */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionExecute(action)}
                      className={cn(
                        "inline-flex items-center space-x-2 px-3 py-1.5 rounded text-xs transition-all",
                        "border border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400",
                        "bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/20",
                        "text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-300",
                        "mr-2 mb-1"
                      )}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center">
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
      
      {/* ========== INPUT AREA (Fixed at bottom like VS Code) ========== */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me anything about ${currentPage}...`}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all",
              inputValue.trim()
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Current page: {currentPage}</span>
          {autonomousMode && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>Autonomous mode active</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateResponse(input: string, page: string): string {
  const responses = {
    campaign: "I can help you optimize your campaigns. I've analyzed your current performance and found several opportunities for improvement. Would you like me to show you specific recommendations?",
    analytics: "Based on your current analytics data, I can see some interesting trends. Your conversion rates have improved by 12% this month. Let me show you the key insights.",
    dashboard: "I can help you navigate and optimize your dashboard. I have access to all platform controls and can execute actions on your behalf. What would you like me to help you with?",
    optimization: "I've identified several optimization opportunities across your platforms. Would you like me to implement these improvements automatically?",
    default: `I understand you're asking about: "${input}". I'm here to help you with anything related to ${page}. I can navigate, optimize, analyze data, and control platform features.`
  };
  
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('campaign')) return responses.campaign;
  if (lowerInput.includes('analytic') || lowerInput.includes('performance')) return responses.analytics;
  if (lowerInput.includes('dashboard') || lowerInput.includes('navigate')) return responses.dashboard;
  if (lowerInput.includes('optimize') || lowerInput.includes('improve')) return responses.optimization;
  
  return responses.default;
}

function generateActions(input: string, page: string): VSCodeChatAction[] {
  const actions: VSCodeChatAction[] = [];
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('campaign')) {
    actions.push({
      id: 'view-campaigns',
      type: 'navigation',
      label: 'View Campaigns',
      icon: <Target className="w-3 h-3" />,
      action: () => window.location.href = '/campaigns'
    });
    actions.push({
      id: 'optimize-campaigns',
      type: 'optimization',
      label: 'Optimize Now',
      icon: <Zap className="w-3 h-3" />,
      variant: 'success',
      action: () => console.log('Optimizing campaigns...')
    });
  }
  
  if (lowerInput.includes('analytic') || lowerInput.includes('performance')) {
    actions.push({
      id: 'view-analytics',
      type: 'navigation',
      label: 'View Analytics',
      icon: <BarChart3 className="w-3 h-3" />,
      action: () => window.location.href = '/analytics'
    });
    actions.push({
      id: 'generate-report',
      type: 'analysis',
      label: 'Generate Report',
      icon: <BarChart3 className="w-3 h-3" />,
      action: () => console.log('Generating report...')
    });
  }
  
  if (lowerInput.includes('dashboard') || lowerInput.includes('navigate')) {
    actions.push({
      id: 'go-dashboard',
      type: 'navigation',
      label: 'Go to Dashboard',
      icon: <Navigation className="w-3 h-3" />,
      action: () => window.location.href = '/dashboard'
    });
  }
  
  return actions;
}