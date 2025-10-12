import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendWelcomeEmail, sendCampaignAlert, sendMonthlyReport } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, ...params } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Email recipient is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        if (!params.name) {
          return NextResponse.json(
            { success: false, error: 'Name is required for welcome email' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(to, params.name);
        break;

      case 'campaign-alert':
        if (!params.campaignName || !params.message) {
          return NextResponse.json(
            { success: false, error: 'Campaign name and message are required' },
            { status: 400 }
          );
        }
        result = await sendCampaignAlert(to, params.campaignName, params.message);
        break;

      case 'monthly-report':
        if (!params.reportData) {
          return NextResponse.json(
            { success: false, error: 'Report data is required' },
            { status: 400 }
          );
        }
        result = await sendMonthlyReport(to, params.reportData);
        break;

      case 'custom':
        if (!params.subject || (!params.html && !params.text)) {
          return NextResponse.json(
            { success: false, error: 'Subject and content (html or text) are required' },
            { status: 400 }
          );
        }
        result = await sendEmail({
          to,
          subject: params.subject,
          html: params.html,
          text: params.text,
          from: params.from
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type. Use: welcome, campaign-alert, monthly-report, or custom' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Email API is working',
    resendConfigured: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'Not configured',
    availableTypes: ['welcome', 'campaign-alert', 'monthly-report', 'custom']
  });
}