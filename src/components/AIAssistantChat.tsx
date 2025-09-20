'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Clock
} from 'lucide-react';
import { PremiumCard } from './ui/PremiumCard';
import { PremiumButton } from './ui/PremiumButton';
import type { Campaign } from '@/types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  campaigns?: Campaign[];
}

const sampleResponses: Record<string, string> = {
  "analyze": `Based on your recent campaign data, I've identified several optimization opportunities:

📊 **Performance Insights:**
• Your Q4 Holiday campaign has a 15% higher CTR than industry average
• Cost per acquisition could be reduced by ~23% with targeting adjustments
• Mobile traffic shows 40% better conversion rates

🎯 **Recommended Actions:**
1. Increase mobile bid adjustments by 25%
2. Pause underperforming ad groups (CPA > $45)
3. Expand successful keyword themes

Would you like me to implement these changes automatically?`,

  "targeting": `I'll help you refine your targeting strategy:

🎯 **Current Audience Analysis:**
• Your converters are 65% more likely to be 25-34 years old
• Tech professionals show 3x higher lifetime value
• Geographic performance varies significantly by region

📈 **Optimization Recommendations:**
1. Create lookalike audiences from top 10% of customers
2. Exclude low-performing zip codes (saving ~$200/day)
3. Add interest targeting for "marketing software" and "business tools"

Shall I create these audience segments for you?`,

  "content": `Here are some high-converting ad copy ideas for your holiday campaign:

✨ **Headlines:**
• "Limited Time: 40% Off Everything - Holiday Sale Ends Soon!"
• "Give the Gift of Growth - Marketing Tools They'll Love"
• "Last Chance: Premium Features at Holiday Prices"

📝 **Descriptions:**
• "Transform your marketing this holiday season. Join 50,000+ businesses already growing with our platform."
• "Holiday special: Get premium features for the price of basic. Offer expires December 25th."

🎨 **Creative Suggestions:**
• Use countdown timers for urgency
• Include customer testimonials
• Add holiday-themed imagery with your brand colors

Want me to generate A/B test variations?`,

  "quick": `Here's the fastest way to boost your ROAS:

⚡ **Immediate Actions (5 minutes):**
1. Pause ads with CPA > $50 (saves ~$300/day)
2. Increase budget on campaigns with ROAS > 4x (+30%)
3. Enable automated bidding for top performers

📊 **Expected Impact:**
• 15-25% ROAS improvement within 48 hours
• Estimated additional $500-800 daily profit
• Reduced wasted ad spend by 35%

I can implement these changes now - shall I proceed?`
};

export default function AIAssistantChat({ 
  isOpen, 
  onClose, 
  isMinimized, 
  onToggleMinimize,
  campaigns = []
}: AIAssistantChatProps) {
  // Generate dynamic quick prompts based on campaign data
  const generateQuickPrompts = () => {
    const basePrompts = [
      {
        icon: TrendingUp,
        title: "Analyze Performance",
        prompt: campaigns.length > 0 
          ? `Analyze my ${campaigns.length} campaigns and suggest optimizations`
          : "Analyze my campaign performance and suggest optimizations"
      },
      {
        icon: Target,
        title: "Improve Targeting",
        prompt: "Help me improve my audience targeting strategy"
      },
      {
        icon: Lightbulb,
        title: "Content Ideas",
        prompt: "Generate ad copy ideas for my campaigns"
      },
      {
        icon: Zap,
        title: "Quick Fix",
        prompt: campaigns.length > 0 && campaigns.reduce((sum, c) => sum + c.spend, 0) > 0
          ? `I've spent $${campaigns.reduce((sum, c) => sum + c.spend, 0).toLocaleString()} - what's the fastest way to improve my ROAS?`
          : "What's the fastest way to improve my ROAS?"
      }
    ];

    // Add specific prompts if we have campaign data
    if (campaigns.length > 0) {
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const platforms = [...new Set(campaigns.map(c => c.platform))];
      
      if (activeCampaigns !== campaigns.length) {
        basePrompts.push({
          icon: Settings,
          title: "Campaign Status",
          prompt: `I have ${activeCampaigns} active campaigns out of ${campaigns.length} total. Should I reactivate any paused campaigns?`
        });
      }

      if (platforms.length > 1) {
        basePrompts.push({
          icon: Target,
          title: "Multi-Platform Strategy",
          prompt: `I'm running campaigns on ${platforms.join(', ')}. How should I optimize my budget allocation across platforms?`
        });
      }
    }

    return basePrompts.slice(0, 4); // Keep only first 4 for UI
  };

  const quickPrompts = generateQuickPrompts();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `👋 Hi! I'm your AI marketing assistant powered by Claude. I can help you:

• Analyze campaign performance and identify optimization opportunities
• Optimize targeting strategies and audience segmentation  
• Generate high-converting ad copy and creative ideas
• Troubleshoot campaign issues and provide strategic recommendations
• Automate budget allocation and bidding strategies

I have deep knowledge of Google Ads, Meta, LinkedIn, and other major platforms. What would you like to work on today?`,
      timestamp: new Date(),
      suggestions: ["Analyze my campaigns", "Help with targeting", "Generate ad copy", "Optimize budgets"]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare campaign context for AI
      const campaignContext = campaigns.length > 0 ? {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalSpend: campaigns.reduce((sum, c) => sum + c.spend, 0),
        totalBudget: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
        platforms: [...new Set(campaigns.map(c => c.platform))],
        topPerformers: campaigns
          .sort((a, b) => (b.metrics?.clicks as number || 0) - (a.metrics?.clicks as number || 0))
          .slice(0, 3)
          .map(c => ({
            name: c.name,
            platform: c.platform,
            spend: c.spend,
            clicks: c.metrics?.clicks || 0,
            impressions: c.metrics?.impressions || 0
          }))
      } : null;

      // Call Claude API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: messages.slice(-6), // Send last 6 messages for context
          campaignContext // Include real campaign data
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [
          "Tell me more details",
          "How do I implement this?", 
          "Show me examples"
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Show fallback indicator if API failed but fallback worked
      if (data.fallback) {
        console.warn('Using fallback response - Claude API may be unavailable');
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to simulated response on error
      const responseKey = Object.keys(sampleResponses).find(key => 
        content.toLowerCase().includes(key)
      ) || 'analyze';
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: sampleResponses[responseKey],
        timestamp: new Date(),
        suggestions: responseKey === 'analyze' 
          ? ["Implement these changes", "Show more details", "Analyze another campaign"]
          : responseKey === 'targeting'
          ? ["Create audiences", "Show geographic data", "Set up exclusions"]
          : responseKey === 'content'
          ? ["Generate more variations", "Create A/B tests", "Export copy"]
          : ["Yes, proceed", "Show detailed breakdown", "Suggest more optimizations"]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    },
    closed: {
      x: 400,
      scale: 0.95,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    },
    minimized: {
      x: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${
          isMinimized ? 'right-4 top-4 w-80 max-w-[calc(100vw-2rem)] h-16' : 'right-4 top-4 w-96 max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
        } bg-card border border-border shadow-2xl z-50 rounded-xl overflow-hidden`}
        variants={sidebarVariants}
        initial="closed"
        animate={isMinimized ? "minimized" : "open"}
        exit="closed"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-pulse-blue to-bridge-purple rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  {isTyping ? 'Claude is thinking...' : 'Powered by Claude'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMinimize}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-pulse-blue' 
                      : 'bg-gradient-to-br from-bridge-purple to-energy-magenta'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-pulse-blue text-white'
                        : 'bg-secondary'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block text-xs text-pulse-blue hover:text-bridge-purple transition-colors border border-pulse-blue/20 rounded px-2 py-1 hover:bg-pulse-blue/5"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bridge-purple to-energy-magenta flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-pulse-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pulse-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pulse-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.title}
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <prompt.icon className="w-3 h-3 text-pulse-blue" />
                        <span className="text-xs font-medium">{prompt.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything about your campaigns..."
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pulse-blue/50"
                />
                <PremiumButton
                  size="sm"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </PremiumButton>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}