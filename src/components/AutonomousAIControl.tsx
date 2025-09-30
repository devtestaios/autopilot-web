'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Minimize2, 
  Maximize2, 
  X,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Settings,
  Navigation,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Shield,
  Brain,
  ChevronUp,
  ChevronDown,
  Cog
} from 'lucide-react';

interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  actions?: AIAction[];
  status?: 'thinking' | 'executing' | 'complete' | 'error';
}

interface AIAction {
  id: string;
  type: 'navigation' | 'platform_control' | 'data_analysis' | 'automation' | 'optimization';
  function: string;
  label: string;
  description?: string;
  status: 'pending' | 'executing' | 'complete' | 'error';
  requiresApproval?: boolean;
  execute: () => Promise<void>;
}

interface AutonomousAIControlProps {
  position?: 'bottom-right' | 'bottom-left' | 'floating';
  defaultMinimized?: boolean;
}

export default function AutonomousAIControl({ 
  position = 'bottom-right',
  defaultMinimized = true 
}: AutonomousAIControlProps) {
  const [isOpen, setIsOpen] = useState(!defaultMinimized);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        content: "👋 **PulseBridge AI Agent** ready for duty!\n\nI can autonomously control your entire business ecosystem. Just tell me what you need:\n\n• Navigate to any platform or dashboard\n• Analyze campaign performance and optimize\n• Create automations and workflows\n• Generate reports and insights\n• Execute complex multi-platform operations\n\n**Example prompts:**\n- \"Show me Instagram campaign performance\"\n- \"Navigate to email marketing and create a new automation\"\n- \"Analyze all social media metrics from last week\"\n- \"Set up a new project with team assignments\"\n\nWhat would you like me to help you accomplish?",
        role: 'assistant',
        timestamp: new Date(),
        status: 'complete'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        role: 'assistant',
        timestamp: new Date(),
        actions: generateAIActions(inputValue),
        status: 'complete'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('navigate') || lowerPrompt.includes('go to')) {
      return "🎯 **Navigation Command Recognized**\n\nI'll take you to the requested platform. Analyzing your request and preparing navigation actions.";
    }
    
    if (lowerPrompt.includes('campaign') || lowerPrompt.includes('marketing')) {
      return "📊 **Marketing Analysis Initiated**\n\nAccessing campaign data and performance metrics. I'll analyze the results and provide optimization recommendations.";
    }
    
    if (lowerPrompt.includes('create') || lowerPrompt.includes('new')) {
      return "🚀 **Creation Task Accepted**\n\nPreparing to create the requested resource. I'll guide you through the process and handle the technical execution.";
    }
    
    if (lowerPrompt.includes('analyze') || lowerPrompt.includes('report')) {
      return "🔍 **Data Analysis Starting**\n\nGathering data from relevant platforms and generating comprehensive insights. This may take a moment.";
    }
    
    return "🤖 **AI Agent Processing**\n\nI understand your request and am preparing the appropriate actions. Let me handle this for you autonomously.";
  };

  const generateAIActions = (prompt: string): AIAction[] => {
    const lowerPrompt = prompt.toLowerCase();
    const actions: AIAction[] = [];
    
    if (lowerPrompt.includes('navigate') || lowerPrompt.includes('dashboard')) {
      actions.push({
        id: 'nav_action',
        type: 'navigation',
        function: 'navigateTo',
        label: 'Navigate to Platform',
        description: 'Take you to the requested dashboard or platform',
        status: 'pending',
        execute: async () => {
          // Implementation would go here
          console.log('Executing navigation...');
        }
      });
    }
    
    if (lowerPrompt.includes('analyze') || lowerPrompt.includes('performance')) {
      actions.push({
        id: 'analyze_action',
        type: 'data_analysis',
        function: 'analyzeData',
        label: 'Analyze Performance',
        description: 'Generate comprehensive performance analysis',
        status: 'pending',
        execute: async () => {
          console.log('Executing analysis...');
        }
      });
    }
    
    if (lowerPrompt.includes('optimize') || lowerPrompt.includes('improve')) {
      actions.push({
        id: 'optimize_action',
        type: 'optimization',
        function: 'optimizeSystem',
        label: 'Apply Optimizations',
        description: 'Implement AI-recommended improvements',
        status: 'pending',
        requiresApproval: true,
        execute: async () => {
          console.log('Executing optimizations...');
        }
      });
    }
    
    return actions;
  };

  const executeAction = async (action: AIAction) => {
    setIsExecuting(true);
    
    // Update action status to executing
    setMessages(prev => prev.map(msg => ({
      ...msg,
      actions: msg.actions?.map(a => 
        a.id === action.id ? { ...a, status: 'executing' as const } : a
      )
    })));

    try {
      await action.execute();
      
      // Update to complete
      setMessages(prev => prev.map(msg => ({
        ...msg,
        actions: msg.actions?.map(a => 
          a.id === action.id ? { ...a, status: 'complete' as const } : a
        )
      })));
      
      // Add confirmation message
      const confirmationMessage: AIMessage = {
        id: Date.now().toString(),
        content: `✅ **Action Completed Successfully**\n\n${action.description} has been executed. Is there anything else you'd like me to help you with?`,
        role: 'assistant',
        timestamp: new Date(),
        status: 'complete'
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      // Update to error
      setMessages(prev => prev.map(msg => ({
        ...msg,
        actions: msg.actions?.map(a => 
          a.id === action.id ? { ...a, status: 'error' as const } : a
        )
      })));
    }
    
    setIsExecuting(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'floating': 'bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2'
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300`}
      >
        <Bot className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed ${positionClasses[position]} z-50 w-96 ${isMinimized ? 'h-14' : 'h-96'} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">PulseBridge AI Agent</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {autonomousMode ? '🤖 Autonomous Mode' : '👤 Interactive Mode'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutonomousMode(!autonomousMode)}
            className={`p-1 rounded-md transition-colors ${autonomousMode ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
            title={autonomousMode ? 'Disable Autonomous Mode' : 'Enable Autonomous Mode'}
          >
            {autonomousMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {/* AI Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => executeAction(action)}
                          disabled={action.status === 'executing' || isExecuting}
                          className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors ${
                            action.status === 'complete' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : action.status === 'executing'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : action.status === 'error'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span>{action.label}</span>
                          {action.status === 'complete' && <CheckCircle className="w-3 h-3" />}
                          {action.status === 'executing' && <Cog className="w-3 h-3 animate-spin" />}
                          {action.status === 'error' && <AlertTriangle className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me to control any part of PulseBridge..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}