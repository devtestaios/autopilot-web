/**
 * Email Marketing AI - Subject Line Generation API
 * Generates optimized email subject lines using AI
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, audience, tone, goals } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Email content is required' },
        { status: 400 }
      );
    }
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate subject lines based on content analysis and best practices
    const subjectLines = generateSubjectLines(content, audience, tone, goals);
    
    return NextResponse.json({
      success: true,
      subjectLines,
      analysis: {
        contentType: analyzeContentType(content),
        recommendedTone: tone || 'professional',
        targetAudience: audience || 'general',
        estimatedPerformance: subjectLines.map(subject => ({
          subject: subject.text,
          openRatePrediction: subject.estimatedOpenRate,
          spamRisk: subject.spamRisk,
          mobileOptimized: subject.mobileOptimized
        }))
      },
      tips: [
        'Keep subject lines under 50 characters for mobile optimization',
        'Use action words to create urgency and engagement',
        'Personalization can increase open rates by 26%',
        'A/B test different subject lines to find what works best for your audience'
      ]
    });
    
  } catch (error) {
    console.error('Error generating subject lines:', error);
    return NextResponse.json(
      { error: 'Failed to generate subject lines' },
      { status: 500 }
    );
  }
}

// Generate subject lines based on content and parameters
function generateSubjectLines(content: string, audience?: string, tone?: string, goals?: string[]) {
  const contentLower = content.toLowerCase();
  const isProductUpdate = contentLower.includes('feature') || contentLower.includes('update') || contentLower.includes('new');
  const isPromotional = contentLower.includes('offer') || contentLower.includes('discount') || contentLower.includes('sale');
  const isNewsletter = contentLower.includes('newsletter') || contentLower.includes('insights') || contentLower.includes('trends');
  const isWelcome = contentLower.includes('welcome') || contentLower.includes('getting started');
  
  let templates = [];
  
  if (isWelcome) {
    templates = [
      'Welcome to {brand}! Let\'s get started 🚀',
      'Your journey begins here - Welcome!',
      'Thanks for joining us! Here\'s what\'s next',
      'Welcome aboard! Your exclusive guide inside',
      '🎉 Welcome! Here\'s your getting started guide'
    ];
  } else if (isProductUpdate) {
    templates = [
      'New features are here! 🆕',
      'Product update: {feature} is now live',
      'You asked, we delivered: New {feature}',
      'Exciting updates inside! Check them out',
      '⚡ Power up with our latest features'
    ];
  } else if (isPromotional) {
    templates = [
      'Limited time: {discount}% off everything',
      'Don\'t miss out: {offer} ends soon!',
      'Exclusive offer just for you 🎁',
      'Last chance: {discount}% off expires tonight',
      'Special deal alert: {offer} inside'
    ];
  } else if (isNewsletter) {
    templates = [
      '{Month} insights: What you need to know',
      'This week in {industry}: Key trends',
      'Your weekly dose of {topic} insights',
      '{Month} roundup: Top stories & tips',
      'Industry insights: {topic} trends to watch'
    ];
  } else {
    // General templates
    templates = [
      'Important update from {brand}',
      'You don\'t want to miss this...',
      'Quick question for you',
      'This might interest you',
      'Your {topic} update is here'
    ];
  }
  
  // Customize based on tone
  if (tone === 'casual') {
    templates = templates.map(t => t.replace('Important update', 'Hey! Quick update')
                                 .replace('You don\'t want to miss', 'You\'ll love')
                                 .replace('This might interest', 'Check this out'));
  } else if (tone === 'urgent') {
    templates = templates.map(t => t.includes('⚠') ? t : `⚠ ${t}`);
  }
  
  // Generate subject lines with performance predictions
  return templates.slice(0, 5).map((template, index) => {
    const text = template.replace(/{\w+}/g, (match) => {
      switch (match) {
        case '{brand}': return 'PulseBridge';
        case '{feature}': return 'AI Optimization';
        case '{discount}': return '30';
        case '{offer}': return 'Premium upgrade';
        case '{Month}': return new Date().toLocaleDateString('en-US', { month: 'long' });
        case '{industry}': return 'Marketing';
        case '{topic}': return 'Marketing';
        default: return match.replace(/[{}]/g, '');
      }
    });
    
    // Calculate performance estimates based on subject line characteristics
    const length = text.length;
    const hasEmoji = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u.test(text);
    const hasNumbers = /\d/.test(text);
    const hasUrgency = /(limited|last|don't miss|expires|ends|hurry)/i.test(text);
    const isQuestion = text.includes('?');
    
    let baseOpenRate = 22; // Industry average
    
    // Adjust based on characteristics
    if (length <= 30) baseOpenRate += 5; // Short subjects perform better
    if (length > 60) baseOpenRate -= 8; // Long subjects perform worse
    if (hasEmoji) baseOpenRate += 3; // Emojis can increase open rates
    if (hasNumbers) baseOpenRate += 2; // Numbers add specificity
    if (hasUrgency) baseOpenRate += 4; // Urgency drives action
    if (isQuestion) baseOpenRate += 1; // Questions create curiosity
    
    // Add some randomness for realistic variation
    const estimatedOpenRate = Math.max(10, Math.min(45, baseOpenRate + (Math.random() * 6 - 3)));
    
    // Calculate spam risk
    let spamRisk = 0.1; // Base risk
    if (text.toUpperCase() === text) spamRisk += 0.3; // All caps
    if ((text.match(/!/g) || []).length > 2) spamRisk += 0.2; // Too many exclamations
    if (/(free|urgent|act now|limited time)/i.test(text)) spamRisk += 0.1; // Spam triggers
    
    return {
      id: `subject-${index + 1}`,
      text,
      estimatedOpenRate: Math.round(estimatedOpenRate * 10) / 10,
      spamRisk: Math.min(0.9, Math.round(spamRisk * 10) / 10),
      mobileOptimized: length <= 40,
      characteristics: {
        length,
        hasEmoji,
        hasNumbers,
        hasUrgency,
        isQuestion
      },
      recommendations: generateRecommendations(text, length, hasEmoji, hasUrgency)
    };
  });
}

// Analyze content type for better subject line generation
function analyzeContentType(content: string) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('welcome') || contentLower.includes('getting started')) {
    return 'welcome';
  } else if (contentLower.includes('feature') || contentLower.includes('update')) {
    return 'product_update';
  } else if (contentLower.includes('offer') || contentLower.includes('discount')) {
    return 'promotional';
  } else if (contentLower.includes('newsletter') || contentLower.includes('insights')) {
    return 'newsletter';
  } else {
    return 'informational';
  }
}

// Generate recommendations for subject line improvement
function generateRecommendations(text: string, length: number, hasEmoji: boolean, hasUrgency: boolean) {
  const recommendations = [];
  
  if (length > 50) {
    recommendations.push('Consider shortening for better mobile display');
  }
  
  if (!hasEmoji && Math.random() > 0.5) {
    recommendations.push('Adding an emoji could increase visual appeal');
  }
  
  if (!hasUrgency && Math.random() > 0.7) {
    recommendations.push('Consider adding urgency to drive immediate action');
  }
  
  if (!text.includes('you') && !text.includes('your')) {
    recommendations.push('Personalization with "you" or "your" can improve engagement');
  }
  
  return recommendations;
}