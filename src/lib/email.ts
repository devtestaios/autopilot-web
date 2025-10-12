// Email utility using Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.RESEND_FROM_EMAIL || 'PulseBridge <noreply@pulsebridge.ai>'
}: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Predefined email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to PulseBridge.ai',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to PulseBridge.ai, ${name}!</h1>
        <p>Thank you for joining our AI-powered marketing automation platform.</p>
        <p>Get started by connecting your advertising platforms and creating your first campaign.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pulsebridge.ai'}/dashboard" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>Best regards,<br>The PulseBridge.ai Team</p>
      </div>
    `,
    text: `Welcome to PulseBridge.ai, ${name}! Thank you for joining our AI-powered marketing automation platform. Get started by connecting your advertising platforms and creating your first campaign.`
  }),

  campaignAlert: (campaignName: string, message: string) => ({
    subject: `Campaign Alert: ${campaignName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Campaign Alert</h1>
        <h2 style="color: #374151;">${campaignName}</h2>
        <p>${message}</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pulsebridge.ai'}/campaigns" 
           style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Campaign
        </a>
        <p>Best regards,<br>The PulseBridge.ai Team</p>
      </div>
    `,
    text: `Campaign Alert for ${campaignName}: ${message}`
  }),

  monthlyReport: (reportData: any) => ({
    subject: 'Your Monthly Marketing Report',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Monthly Marketing Report</h1>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Performance Summary</h3>
          <p><strong>Total Spend:</strong> $${reportData.totalSpend || 0}</p>
          <p><strong>Total Impressions:</strong> ${reportData.totalImpressions || 0}</p>
          <p><strong>Total Clicks:</strong> ${reportData.totalClicks || 0}</p>
          <p><strong>Conversions:</strong> ${reportData.conversions || 0}</p>
          <p><strong>ROAS:</strong> ${reportData.roas || 0}x</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pulsebridge.ai'}/analytics" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          View Full Report
        </a>
        <p>Best regards,<br>The PulseBridge.ai Team</p>
      </div>
    `,
    text: `Your Monthly Marketing Report: Total Spend: $${reportData.totalSpend || 0}, Impressions: ${reportData.totalImpressions || 0}, Clicks: ${reportData.totalClicks || 0}, Conversions: ${reportData.conversions || 0}, ROAS: ${reportData.roas || 0}x`
  })
};

// Helper function to send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const template = emailTemplates.welcome(name);
  return sendEmail({
    to: email,
    ...template
  });
}

// Helper function to send campaign alert
export async function sendCampaignAlert(email: string, campaignName: string, message: string) {
  const template = emailTemplates.campaignAlert(campaignName, message);
  return sendEmail({
    to: email,
    ...template
  });
}

// Helper function to send monthly report
export async function sendMonthlyReport(email: string, reportData: any) {
  const template = emailTemplates.monthlyReport(reportData);
  return sendEmail({
    to: email,
    ...template
  });
}