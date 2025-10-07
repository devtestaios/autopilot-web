/**
 * Social Media Templates API
 * Handles CRUD operations for content templates
 */

import { NextRequest, NextResponse } from 'next/server';

const mockTemplates = [
  {
    id: 'template-001',
    name: 'Product Launch',
    category: 'Marketing',
    content: '🚀 Excited to announce {product_name}! {description} Learn more: {link} #ProductLaunch #{brand}',
    mediaPlaceholders: 1,
    variables: ['product_name', 'description', 'link', 'brand'],
    recommendedPlatforms: ['facebook', 'twitter', 'linkedin'],
    tags: ['product', 'launch', 'announcement'],
    usage: 156,
    rating: 4.8,
    createdAt: new Date('2025-01-20T10:00:00Z')
  },
  {
    id: 'template-002',
    name: 'Monday Motivation',
    category: 'Engagement',
    content: '💡 Monday Motivation: {quote} What\'s motivating you this week? #MondayMotivation #{brand}',
    mediaPlaceholders: 0,
    variables: ['quote', 'brand'],
    recommendedPlatforms: ['facebook', 'twitter', 'instagram'],
    tags: ['motivation', 'engagement', 'weekly'],
    usage: 89,
    rating: 4.5,
    createdAt: new Date('2025-01-18T09:00:00Z')
  },
  {
    id: 'template-003',
    name: 'Behind the Scenes',
    category: 'Engagement',
    content: '🎬 Behind the scenes at {company_name}! {description} #{BehindTheScenes} #{brand}',
    mediaPlaceholders: 2,
    variables: ['company_name', 'description', 'brand'],
    recommendedPlatforms: ['instagram', 'facebook', 'tiktok'],
    tags: ['behind-the-scenes', 'company-culture', 'engagement'],
    usage: 67,
    rating: 4.6,
    createdAt: new Date('2025-01-15T14:00:00Z')
  },
  {
    id: 'template-004',
    name: 'Customer Spotlight',
    category: 'Social Proof',
    content: '⭐ Customer Spotlight: {customer_name} says "{testimonial}" Thank you for choosing us! #{CustomerLove} #{brand}',
    mediaPlaceholders: 1,
    variables: ['customer_name', 'testimonial', 'brand'],
    recommendedPlatforms: ['facebook', 'linkedin', 'twitter'],
    tags: ['testimonial', 'customer', 'social-proof'],
    usage: 134,
    rating: 4.9,
    createdAt: new Date('2025-01-12T11:00:00Z')
  }
];

// GET /api/social-media/templates - Fetch all templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let filteredTemplates = [...mockTemplates];
    
    // Filter by category if provided
    if (category) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by recommended platform if provided
    if (platform) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.recommendedPlatforms.includes(platform.toLowerCase())
      );
    }
    
    // Apply limit
    filteredTemplates = filteredTemplates.slice(0, limit);
    
    // Sort by rating (highest first) then by usage
    filteredTemplates.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.usage - a.usage;
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json(filteredTemplates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/social-media/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json();
    
    // Validate required fields
    if (!templateData.name || !templateData.content || !templateData.category) {
      return NextResponse.json(
        { error: 'Name, content, and category are required' },
        { status: 400 }
      );
    }
    
    // Extract variables from content
    const variables = extractVariables(templateData.content);
    
    // Create new template
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: templateData.name,
      category: templateData.category,
      content: templateData.content,
      mediaPlaceholders: templateData.mediaPlaceholders || 0,
      variables,
      recommendedPlatforms: templateData.recommendedPlatforms || [],
      tags: templateData.tags || [],
      usage: 0,
      rating: 0,
      createdAt: new Date()
    };
    
    // In production, this would save to database
    mockTemplates.push(newTemplate);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// Helper function to extract variables from template content
function extractVariables(content: string): string[] {
  const variableRegex = /{(\w+)}/g;
  const variables = [];
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}