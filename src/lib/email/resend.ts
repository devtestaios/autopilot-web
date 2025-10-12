/**
 * Resend Email Service
 * Handles all email delivery through Resend API
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'PulseBridge <noreply@pulsebridge.ai>';

export interface SendInvitationEmailParams {
  to: string;
  firstName: string;
  tempPassword: string;
  invitedBy: string;
  suiteAccess: Record<string, any>;
  isTestUser: boolean;
  loginUrl?: string;
}

export interface SendPasswordResetEmailParams {
  to: string;
  resetToken: string;
  resetUrl?: string;
}

export interface SendWelcomeEmailParams {
  to: string;
  firstName: string;
  loginUrl?: string;
}

/**
 * Send invitation email to new user
 */
export async function sendInvitationEmail({
  to,
  firstName,
  tempPassword,
  invitedBy,
  suiteAccess,
  isTestUser,
  loginUrl = 'https://pulsebridge.ai/login',
}: SendInvitationEmailParams) {
  try {
    // Get enabled suites
    const enabledSuites = Object.entries(suiteAccess)
      .filter(([_, access]: [string, any]) => access.enabled)
      .map(([suiteId]) =>
        suiteId
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())
      );

    const subject = `You're invited to PulseBridge.ai${isTestUser ? ' (Test Access)' : ''}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .credentials {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
          }
          .credentials h3 {
            margin-top: 0;
            color: #1f2937;
          }
          .credential-row {
            margin: 12px 0;
          }
          .credential-label {
            font-weight: 600;
            color: #4b5563;
          }
          .credential-value {
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            display: inline-block;
            margin-top: 4px;
          }
          .suites {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin: 20px 0;
          }
          .suites h3 {
            margin-top: 0;
            color: #1f2937;
          }
          .suite-item {
            padding: 10px;
            margin: 8px 0;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 3px solid #10b981;
          }
          .suite-item::before {
            content: "✓ ";
            color: #10b981;
            font-weight: bold;
            margin-right: 8px;
          }
          .button {
            display: inline-block;
            padding: 14px 28px;
            background: #667eea;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .button:hover {
            background: #5568d3;
          }
          .test-badge {
            background: #fbbf24;
            color: #78350f;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
          }
          .test-notice {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .test-notice strong {
            color: #92400e;
            display: block;
            margin-bottom: 8px;
          }
          .test-notice p {
            margin: 4px 0;
            color: #92400e;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to PulseBridge.ai!</h1>
            ${isTestUser ? '<div class="test-badge">TEST ACCESS</div>' : ''}
          </div>

          <div class="content">
            <p>Hi ${firstName},</p>
            <p>${invitedBy} has invited you to join PulseBridge.ai - the AI-powered marketing automation platform.</p>

            <div class="credentials">
              <h3>Your Login Credentials</h3>
              <div class="credential-row">
                <div class="credential-label">Email:</div>
                <div class="credential-value">${to}</div>
              </div>
              <div class="credential-row">
                <div class="credential-label">Temporary Password:</div>
                <div class="credential-value">${tempPassword}</div>
              </div>
              <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
                <strong>Important:</strong> Please change your password after your first login.
              </p>
            </div>

            <div class="suites">
              <h3>Your Enabled Features</h3>
              ${enabledSuites.map(suite => `<div class="suite-item">${suite}</div>`).join('')}
            </div>

            ${isTestUser ? `
              <div class="test-notice">
                <strong>🧪 Test User Access</strong>
                <p>• No payment required</p>
                <p>• Full access to all enabled features</p>
                <p>• Populate with your own test data</p>
                <p>• Help us improve by providing feedback</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">
                Login to Your Account →
              </a>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Need help? Reply to this email or contact <a href="mailto:support@pulsebridge.ai" style="color: #667eea;">support@pulsebridge.ai</a>
            </p>
          </div>

          <div class="footer">
            <p><strong>PulseBridge.ai</strong></p>
            <p>AI-Powered Marketing Automation</p>
            <p style="margin-top: 16px;">© 2025 PulseBridge.ai. All rights reserved.</p>
            <p>This invitation was sent to ${to}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('✅ Invitation email sent successfully:', { to, emailId: data?.id });
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  resetToken,
  resetUrl = 'https://pulsebridge.ai/auth/reset-password',
}: SendPasswordResetEmailParams) {
  try {
    const resetLink = `${resetUrl}?token=${resetToken}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your PulseBridge.ai account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>© 2025 PulseBridge.ai</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset Your Password - PulseBridge.ai',
      html: htmlBody,
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log('✅ Password reset email sent:', { to, emailId: data?.id });
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail({
  to,
  firstName,
  loginUrl = 'https://pulsebridge.ai/login',
}: SendWelcomeEmailParams) {
  try {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to PulseBridge.ai! 🚀</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for joining PulseBridge.ai. We're excited to have you on board!</p>
          <p>Get started by exploring your dashboard:</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="button">Go to Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to PulseBridge.ai! 🚀',
      html: htmlBody,
    });

    if (error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }

    console.log('✅ Welcome email sent:', { to, emailId: data?.id });
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}
