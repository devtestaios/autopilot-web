/**
 * Email Marketing Contacts Import API
 * Specialized endpoint for bulk contact import operations
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contacts } = body;
    
    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        { error: 'Contacts array is required' },
        { status: 400 }
      );
    }
    
    const imported = [];
    const errors = [];
    
    // Process each contact
    for (let i = 0; i < contacts.length; i++) {
      const contactData = contacts[i];
      
      try {
        // Validate email
        if (!contactData.email || !isValidEmail(contactData.email)) {
          errors.push({
            row: i + 1,
            email: contactData.email || 'N/A',
            error: 'Invalid or missing email address'
          });
          continue;
        }
        
        // Create contact with validation
        const newContact = {
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: contactData.email.toLowerCase().trim(),
          firstName: contactData.firstName?.trim() || '',
          lastName: contactData.lastName?.trim() || '',
          company: contactData.company?.trim() || '',
          tags: Array.isArray(contactData.tags) ? contactData.tags : [],
          segments: Array.isArray(contactData.segments) ? contactData.segments : [],
          status: ['subscribed', 'unsubscribed', 'bounced', 'complained'].includes(contactData.status) 
            ? contactData.status 
            : 'subscribed',
          source: 'import',
          customFields: typeof contactData.customFields === 'object' ? contactData.customFields : {},
          engagementScore: Math.max(0, Math.min(100, parseInt(contactData.engagementScore) || 50)),
          lastEngaged: contactData.lastEngaged ? new Date(contactData.lastEngaged) : null,
          subscribeDate: new Date(),
          unsubscribeDate: contactData.status === 'unsubscribed' ? new Date() : null
        };
        
        imported.push(newContact);
        
      } catch (contactError) {
        errors.push({
          row: i + 1,
          email: contactData.email || 'N/A',
          error: 'Failed to process contact data'
        });
      }
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      imported,
      errors,
      summary: {
        totalProcessed: contacts.length,
        successfulImports: imported.length,
        failedImports: errors.length,
        importRate: ((imported.length / contacts.length) * 100).toFixed(1) + '%'
      },
      recommendations: generateImportRecommendations(imported, errors)
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import contacts' },
      { status: 500 }
    );
  }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate recommendations based on import results
function generateImportRecommendations(imported: any[], errors: any[]) {
  const recommendations = [];
  
  if (errors.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `${errors.length} contacts failed to import. Review the errors and fix data issues.`,
      action: 'Review failed imports'
    });
  }
  
  if (imported.length > 0) {
    recommendations.push({
      type: 'success',
      message: `${imported.length} contacts imported successfully. Consider creating segments for better targeting.`,
      action: 'Create segments'
    });
  }
  
  const contactsWithoutNames = imported.filter(c => !c.firstName && !c.lastName).length;
  if (contactsWithoutNames > 0) {
    recommendations.push({
      type: 'info',
      message: `${contactsWithoutNames} contacts are missing names. Personalized emails perform better.`,
      action: 'Enrich contact data'
    });
  }
  
  const contactsWithoutCompany = imported.filter(c => !c.company).length;
  if (contactsWithoutCompany > 0) {
    recommendations.push({
      type: 'info',
      message: `${contactsWithoutCompany} contacts are missing company information for B2B targeting.`,
      action: 'Add company data'
    });
  }
  
  return recommendations;
}