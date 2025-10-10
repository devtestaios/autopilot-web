import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!anthropic) {
      return NextResponse.json(
        { error: 'Anthropic API is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    // Handle different types of AI requests
    if (body.type === 'content_generation') {
      return await handleContentGeneration(body);
    } else {
      return await handleCampaignOptimization(body);
    }

  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

async function handleContentGeneration(body: any) {
  const { prompt, type, platform, audience } = body;
  
  let systemPrompt = '';
  switch (type) {
    case 'ad_copy':
      systemPrompt = `You are an expert copywriter specializing in ${platform} advertising. Create compelling ad copy that converts for ${audience} audience. Be concise and action-oriented.`;
      break;
    case 'campaign_strategy':
      systemPrompt = 'You are a marketing strategist. Create comprehensive campaign strategies with clear objectives and tactics.';
      break;
    case 'content_plan':
      systemPrompt = 'You are a content strategist. Create detailed content plans with topics, formats, and scheduling recommendations.';
      break;
    default:
      systemPrompt = 'You are a helpful marketing assistant. Provide clear, actionable advice.';
  }

  const message = await anthropic!.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1500,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return NextResponse.json({
    content: message.content[0].type === 'text' ? message.content[0].text : 'Content generated',
    type: 'content_generation',
    platform,
    model: 'claude-3-sonnet',
    timestamp: new Date().toISOString(),
    usage: message.usage
  });
}

async function handleCampaignOptimization(body: any) {
  const { campaigns, metrics, goals } = body;

  const prompt = `
  Analyze these campaign performance metrics and provide optimization recommendations:
  
  Campaigns: ${JSON.stringify(campaigns, null, 2)}
  Current Metrics: ${JSON.stringify(metrics, null, 2)}
  Business Goals: ${JSON.stringify(goals, null, 2)}
  
  Please provide:
  1. Performance analysis
  2. Specific optimization recommendations
  3. Budget reallocation suggestions
  4. A/B testing opportunities
  5. Risk assessment
  
  Format as JSON with clear action items.
  `;

  const message = await anthropic!.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 2000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return NextResponse.json({
    analysis: message.content[0].type === 'text' ? message.content[0].text : 'Analysis completed',
    type: 'campaign_optimization',
    model: 'claude-3-sonnet',
    timestamp: new Date().toISOString(),
    usage: message.usage
  });
}

export async function GET() {
  return NextResponse.json({
    service: 'Anthropic Claude AI',
    configured: !!anthropic,
    status: anthropic ? 'ready' : 'not_configured',
    capabilities: anthropic ? [
      'Campaign optimization analysis',
      'Content generation',
      'Ad copy creation', 
      'Marketing strategy',
      'Performance analysis'
    ] : [],
    message: anthropic ? 'Anthropic Claude API ready for AI tasks' : 'Anthropic API not configured'
  });
}