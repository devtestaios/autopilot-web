import { NextRequest, NextResponse } from 'next/server';

// OpenAI is optional - gracefully handle when not configured
let openai: any = null;
let openaiAvailable = false;

try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    openaiAvailable = true;
  }
} catch (error) {
  console.log('OpenAI not available:', error.message);
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, platform, audience } = await request.json();

    // Check if OpenAI is configured
    if (!openaiAvailable || !openai) {
      return NextResponse.json({
        error: 'OpenAI API is not configured',
        suggestion: 'Use Anthropic API endpoint at /api/ai/optimize instead',
        alternative: 'Consider setting up OpenAI API key or use Anthropic Claude for content generation',
        status: 'openai_not_configured'
      }, { status: 503 });
    }

    let systemPrompt = '';
    switch (type) {
      case 'ad_copy':
        systemPrompt = `You are an expert copywriter specializing in ${platform} advertising. Create compelling ad copy that converts for ${audience} audience.`;
        break;
      case 'campaign_optimization':
        systemPrompt = 'You are a marketing optimization expert. Analyze campaign data and provide actionable recommendations.';
        break;
      case 'content_strategy':
        systemPrompt = 'You are a content strategist. Create comprehensive content plans and strategies.';
        break;
      default:
        systemPrompt = 'You are a helpful marketing assistant.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content,
      usage: completion.usage,
      type,
      platform,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'OpenAI Content Generation',
    configured: openaiAvailable,
    status: openaiAvailable ? 'ready' : 'not_configured',
    message: openaiAvailable ? 'OpenAI API ready for content generation' : 'OpenAI API not configured. Set OPENAI_API_KEY environment variable.',
    alternative: 'Use Anthropic Claude API at /api/ai/optimize for content generation'
  });
}