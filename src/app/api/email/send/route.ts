import { NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/resend';

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
        if (!params.firstName) {
          return NextResponse.json(
            { success: false, error: 'firstName is required for welcome email' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail({ 
          to, 
          firstName: params.firstName,
          loginUrl: params.loginUrl || 'https://pulsebridge.ai/login'
        });
        break;

      case 'invitation':
        if (!params.firstName || !params.tempPassword || !params.invitedBy || !params.suiteAccess) {
          return NextResponse.json(
            { success: false, error: 'firstName, tempPassword, invitedBy, and suiteAccess are required for invitation email' },
            { status: 400 }
          );
        }
        result = await sendInvitationEmail({
          to,
          firstName: params.firstName,
          tempPassword: params.tempPassword,
          invitedBy: params.invitedBy,
          suiteAccess: params.suiteAccess,
          isTestUser: params.isTestUser || false
        });
        break;

      case 'password-reset':
        if (!params.resetToken || !params.resetUrl) {
          return NextResponse.json(
            { success: false, error: 'resetToken and resetUrl are required for password reset email' },
            { status: 400 }
          );
        }
        result = await sendPasswordResetEmail({
          to,
          resetToken: params.resetToken,
          resetUrl: params.resetUrl
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type. Supported types: welcome, invitation, password-reset' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.emailId
    });

  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email API is ready',
    supportedTypes: ['welcome', 'invitation', 'password-reset'],
    endpoint: '/api/email/send',
    resendConfigured: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'Not configured'
  });
}