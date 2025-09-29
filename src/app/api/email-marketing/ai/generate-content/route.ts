/**
 * Email Marketing AI - Content Generation API
 * Generates email content using AI based on prompts and templates
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, templateType, tone, length, audience, includePersonalization } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Content prompt is required' },
        { status: 400 }
      );
    }
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate content based on prompt and parameters
    const generatedContent = generateEmailContent(prompt, templateType, tone, length, audience, includePersonalization);
    
    return NextResponse.json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: generatedContent.htmlContent.replace(/<[^>]*>/g, '').split(' ').length,
        estimatedReadTime: Math.ceil(generatedContent.htmlContent.replace(/<[^>]*>/g, '').split(' ').length / 200), // minutes
        tone: tone || 'professional',
        audience: audience || 'general',
        templateType: templateType || 'general'
      },
      suggestions: {
        improvements: [
          'Consider adding a clear call-to-action button',
          'Personalization tokens can improve engagement',
          'A/B testing different content versions is recommended'
        ],
        nextSteps: [
          'Review and edit the generated content',
          'Add your brand colors and styling',
          'Test on mobile devices before sending'
        ]
      }
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

// Generate email content based on parameters
function generateEmailContent(
  prompt: string, 
  templateType?: string, 
  tone?: string, 
  length?: string, 
  audience?: string, 
  includePersonalization?: boolean
) {
  const templates = getTemplateByType(templateType || 'general');
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Customize content based on prompt
  let htmlContent = selectedTemplate.html;
  let textContent = selectedTemplate.text;
  
  // Replace placeholders with prompt-based content
  const contentVariations = generateContentVariations(prompt, tone, audience);
  
  htmlContent = htmlContent
    .replace('{HEADLINE}', contentVariations.headline)
    .replace('{INTRO}', contentVariations.intro)
    .replace('{MAIN_CONTENT}', contentVariations.mainContent)
    .replace('{CTA_TEXT}', contentVariations.ctaText)
    .replace('{CLOSING}', contentVariations.closing);
  
  textContent = textContent
    .replace('{HEADLINE}', contentVariations.headline)
    .replace('{INTRO}', contentVariations.intro)
    .replace('{MAIN_CONTENT}', contentVariations.mainContentText)
    .replace('{CTA_TEXT}', contentVariations.ctaText)
    .replace('{CLOSING}', contentVariations.closing);
  
  // Add personalization if requested
  if (includePersonalization) {
    htmlContent = htmlContent.replace(/Hi there/g, 'Hi {{firstName}}');
    textContent = textContent.replace(/Hi there/g, 'Hi {{firstName}}');
  }
  
  // Adjust length if specified
  if (length === 'short') {
    htmlContent = shortenContent(htmlContent);
    textContent = shortenContent(textContent);
  } else if (length === 'long') {
    htmlContent = expandContent(htmlContent, contentVariations);
    textContent = expandContent(textContent, contentVariations, false);
  }
  
  return {
    htmlContent,
    textContent,
    subject: generateSubjectFromContent(contentVariations.headline, tone),
    preheader: contentVariations.intro.substring(0, 100) + '...'
  };
}

// Get email template by type
function getTemplateByType(templateType: string) {
  const templates = {
    welcome: [
      {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">{HEADLINE}</h1>
            </div>
            <div style="padding: 40px 20px; background: #f8f9fa;">
              <p style="font-size: 16px; margin-bottom: 20px;">{INTRO}</p>
              <div style="margin: 30px 0;">
                {MAIN_CONTENT}
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">{CTA_TEXT}</a>
              </div>
              <p style="margin-top: 30px;">{CLOSING}</p>
              <p style="margin-top: 20px; color: #666;">Best regards,<br>The PulseBridge Team</p>
            </div>
          </div>
        `,
        text: `{HEADLINE}\n\n{INTRO}\n\n{MAIN_CONTENT}\n\n{CTA_TEXT}: [LINK]\n\n{CLOSING}\n\nBest regards,\nThe PulseBridge Team`
      }
    ],
    promotional: [
      {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: #ff6b6b; padding: 30px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">{HEADLINE}</h1>
            </div>
            <div style="padding: 40px 20px; background: white;">
              <p style="font-size: 18px; margin-bottom: 25px; text-align: center;">{INTRO}</p>
              <div style="background: #f8f9fa; padding: 30px; border-left: 4px solid #ff6b6b; margin: 30px 0;">
                {MAIN_CONTENT}
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background: #ff6b6b; color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">{CTA_TEXT}</a>
              </div>
              <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">{CLOSING}</p>
            </div>
          </div>
        `,
        text: `{HEADLINE}\n\n{INTRO}\n\n{MAIN_CONTENT}\n\n{CTA_TEXT}: [LINK]\n\n{CLOSING}`
      }
    ],
    newsletter: [
      {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: #2c3e50; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">{HEADLINE}</h1>
            </div>
            <div style="padding: 40px 20px; background: white;">
              <p style="font-size: 16px; margin-bottom: 25px;">{INTRO}</p>
              <div style="margin: 30px 0;">
                {MAIN_CONTENT}
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background: #2c3e50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">{CTA_TEXT}</a>
              </div>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">{CLOSING}</p>
            </div>
          </div>
        `,
        text: `{HEADLINE}\n\n{INTRO}\n\n{MAIN_CONTENT}\n\n{CTA_TEXT}: [LINK]\n\n{CLOSING}`
      }
    ],
    general: [
      {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="padding: 40px 20px; background: white;">
              <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">{HEADLINE}</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">{INTRO}</p>
              <div style="margin: 30px 0;">
                {MAIN_CONTENT}
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">{CTA_TEXT}</a>
              </div>
              <p style="margin-top: 30px;">{CLOSING}</p>
            </div>
          </div>
        `,
        text: `{HEADLINE}\n\n{INTRO}\n\n{MAIN_CONTENT}\n\n{CTA_TEXT}: [LINK]\n\n{CLOSING}`
      }
    ]
  };
  
  return templates[templateType as keyof typeof templates] || templates.general;
}

// Generate content variations based on prompt and tone
function generateContentVariations(prompt: string, tone?: string, audience?: string) {
  const promptLower = prompt.toLowerCase();
  
  // Analyze prompt for content type
  const isProductAnnouncement = promptLower.includes('announce') || promptLower.includes('launch') || promptLower.includes('new');
  const isUpdate = promptLower.includes('update') || promptLower.includes('change') || promptLower.includes('improve');
  const isOffer = promptLower.includes('offer') || promptLower.includes('discount') || promptLower.includes('deal');
  
  let variations = {
    headline: 'Exciting News!',
    intro: 'Hi there! We have something important to share with you.',
    mainContent: '<p>We\'re excited to bring you the latest updates and improvements to enhance your experience.</p>',
    mainContentText: 'We\'re excited to bring you the latest updates and improvements to enhance your experience.',
    ctaText: 'Learn More',
    closing: 'Thank you for being part of our community.'
  };
  
  if (isProductAnnouncement) {
    variations = {
      headline: 'Introducing Something Amazing!',
      intro: 'We\'ve been working hard behind the scenes, and we\'re thrilled to share what\'s new.',
      mainContent: `
        <h3 style="color: #333; margin-bottom: 15px;">What\'s New:</h3>
        <ul style="margin: 20px 0; padding-left: 20px;">
          <li style="margin-bottom: 10px;">Enhanced AI-powered features for better performance</li>
          <li style="margin-bottom: 10px;">Improved user interface for easier navigation</li>
          <li style="margin-bottom: 10px;">New integrations to streamline your workflow</li>
        </ul>
      `,
      mainContentText: 'What\'s New:\n\n• Enhanced AI-powered features for better performance\n• Improved user interface for easier navigation\n• New integrations to streamline your workflow',
      ctaText: 'Explore New Features',
      closing: 'We can\'t wait for you to try these new features!'
    };
  } else if (isUpdate) {
    variations = {
      headline: 'Important Update',
      intro: 'We\'ve made some improvements that we think you\'ll love.',
      mainContent: '<p style="margin-bottom: 20px;">Based on your feedback, we\'ve updated our platform to provide you with a better experience. These changes are designed to make your workflow more efficient and enjoyable.</p>',
      mainContentText: 'Based on your feedback, we\'ve updated our platform to provide you with a better experience. These changes are designed to make your workflow more efficient and enjoyable.',
      ctaText: 'See What\'s Changed',
      closing: 'As always, we appreciate your feedback and support.'
    };
  } else if (isOffer) {
    variations = {
      headline: 'Special Offer Just for You!',
      intro: 'We\'re excited to offer you an exclusive deal that we know you\'ll appreciate.',
      mainContent: `
        <div style="background: #f0f8ff; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 24px;">Limited Time Offer</h3>
          <p style="font-size: 18px; margin-bottom: 15px;">Get 30% off your next upgrade</p>
          <p style="font-size: 14px; color: #666;">Valid until end of month</p>
        </div>
      `,
      mainContentText: 'Limited Time Offer\n\nGet 30% off your next upgrade\nValid until end of month',
      ctaText: 'Claim Your Discount',
      closing: 'Don\'t miss out on this exclusive opportunity!'
    };
  }
  
  // Adjust tone
  if (tone === 'casual') {
    variations.intro = variations.intro.replace('Hi there!', 'Hey!');
    variations.closing = variations.closing.replace('Thank you', 'Thanks so much');
  } else if (tone === 'formal') {
    variations.intro = variations.intro.replace('Hi there!', 'Dear Valued Customer,');
    variations.closing = 'We appreciate your continued trust in our services.';
  }
  
  return variations;
}

// Generate subject line from content
function generateSubjectFromContent(headline: string, tone?: string) {
  let subject = headline;
  
  if (tone === 'casual') {
    subject = subject.replace('Important Update', 'Quick update for you');
    subject = subject.replace('Exciting News!', 'You\'ll love this!');
  } else if (tone === 'urgent') {
    subject = `⚠️ ${subject}`;
  }
  
  // Keep it under 50 characters for mobile
  if (subject.length > 50) {
    subject = subject.substring(0, 47) + '...';
  }
  
  return subject;
}

// Shorten content for brief emails
function shortenContent(content: string) {
  // Remove extra paragraphs and lists, keep main message
  return content
    .replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, '<p>Key improvements and new features included.</p>')
    .replace(/<h3[^>]*>[\s\S]*?<\/h3>/gi, '')
    .replace(/\n\n•[\s\S]*?(?=\n\n|$)/g, '\n\nKey improvements and new features included.');
}

// Expand content for detailed emails
function expandContent(content: string, variations: any, isHtml: boolean = true) {
  if (isHtml) {
    const additionalContent = `
      <h3 style="color: #333; margin: 30px 0 15px 0;">Why This Matters to You:</h3>
      <p style="margin-bottom: 20px;">These improvements are designed to save you time and help you achieve better results. We\'ve listened to your feedback and focused on the features that matter most to you.</p>
      <h3 style="color: #333; margin: 30px 0 15px 0;">What\'s Next:</h3>
      <p style="margin-bottom: 20px;">Over the coming weeks, you\'ll see even more improvements as we continue to enhance your experience. Stay tuned for more updates!</p>
    `;
    return content.replace(variations.mainContent, variations.mainContent + additionalContent);
  } else {
    const additionalContent = `\n\nWhy This Matters to You:\n\nThese improvements are designed to save you time and help you achieve better results. We\'ve listened to your feedback and focused on the features that matter most to you.\n\nWhat\'s Next:\n\nOver the coming weeks, you\'ll see even more improvements as we continue to enhance your experience. Stay tuned for more updates!`;
    return content + additionalContent;
  }
}