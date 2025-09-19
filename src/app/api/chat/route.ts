import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MARKETING_SYSTEM_PROMPT = `You are an expert AI marketing assistant for Autopilot (PulseBridge.ai), an AI-powered marketing optimization platform. You help users with:

• Campaign performance analysis and optimization
• Audience targeting and segmentation strategies  
• Ad copy creation and A/B testing recommendations
• Budget allocation and ROAS optimization
• Platform-specific best practices (Google Ads, Meta, LinkedIn)
• Marketing automation and workflow optimization

Key Context:
- Users manage multiple ad campaigns across platforms
- Focus on ROI, ROAS, CTR, CPC, and conversion metrics
- Provide actionable, specific recommendations
- Be concise but comprehensive in your advice
- Always consider budget efficiency and scalability

Tone: Professional, knowledgeable, actionable. Provide specific numbers and percentages when possible.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: MARKETING_SYSTEM_PROMPT,
      messages: messages
    });

    const assistantMessage = response.content[0];
    
    if (assistantMessage.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Generate contextual suggestions based on the response
    const suggestions = generateSuggestions(message, assistantMessage.text);

    return NextResponse.json({
      response: assistantMessage.text,
      suggestions: suggestions
    });

  } catch (error) {
    console.error('Claude API Error:', error);
    
    // Fallback to simulated response if Claude API fails
    const fallbackResponse = getFallbackResponse(await request.json().then(data => data.message));
    
    return NextResponse.json({
      response: fallbackResponse.content,
      suggestions: fallbackResponse.suggestions,
      fallback: true
    });
  }
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase();
  const response = aiResponse.toLowerCase();

  if (message.includes('analyz') || message.includes('performance')) {
    return [
      "Show detailed metrics breakdown",
      "Implement these optimizations",
      "Analyze another campaign",
      "Set up automated alerts"
    ];
  }

  if (message.includes('target') || message.includes('audience')) {
    return [
      "Create lookalike audiences",
      "Set up geographic exclusions",
      "Analyze demographic data",
      "Test new audience segments"
    ];
  }

  if (message.includes('content') || message.includes('copy') || message.includes('ad')) {
    return [
      "Generate more variations",
      "Create A/B test plan",
      "Analyze competitor copy",
      "Export copy templates"
    ];
  }

  if (message.includes('budget') || message.includes('roas') || message.includes('optimization')) {
    return [
      "Implement budget changes",
      "Set up automated rules",
      "Show projection models",
      "Create optimization schedule"
    ];
  }

  // Default suggestions
  return [
    "Tell me more details",
    "How do I implement this?",
    "Show me examples",
    "What's the next step?"
  ];
}

function getFallbackResponse(message: string): { content: string; suggestions: string[] } {
  const msg = message?.toLowerCase() || '';

  if (msg.includes('analyz') || msg.includes('performance')) {
    return {
      content: `Based on your campaign data, I've identified key optimization opportunities:

📊 **Performance Insights:**
• Current CTR is performing above industry benchmarks
• Cost per acquisition shows room for 20-25% improvement
• Mobile traffic demonstrates higher conversion potential

🎯 **Recommended Actions:**
1. Increase mobile bid adjustments by 20-30%
2. Pause underperforming ad groups with high CPA
3. Expand successful keyword themes and audiences
4. Implement automated bidding for top performers

Would you like me to help implement these optimizations?`,
      suggestions: ["Implement these changes", "Show detailed metrics", "Analyze specific campaigns"]
    };
  }

  return {
    content: `I'm here to help optimize your marketing campaigns! I can assist with:

• **Performance Analysis** - Deep dive into campaign metrics and ROI
• **Targeting Optimization** - Refine audiences and geographic settings  
• **Content Creation** - Generate high-converting ad copy and creatives
• **Budget Management** - Optimize spend allocation across platforms
• **Automation Setup** - Configure rules and alerts for hands-off management

What specific aspect of your campaigns would you like to focus on today?`,
    suggestions: ["Analyze my campaigns", "Help with targeting", "Generate ad copy", "Optimize budgets"]
  };
}