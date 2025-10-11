/**
 * Admin API: Invite User
 * Creates a new user with specific suite access and sends invitation email
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['super_admin', 'agency_owner'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      displayName,
      role,
      subscriptionTier,
      isTestUser,
      testUserExpiresAt,
      suiteAccess,
      adminNotes,
      accountStatus,
      emailVerified,
    } = body;

    // Validate required fields
    if (!email || !displayName || !role) {
      return NextResponse.json(
        { error: 'Email, display name, and role are required' },
        { status: 400 }
      );
    }

    // Generate a temporary password
    const tempPassword = generateSecurePassword();

    // Create auth user in Supabase
    const { data: authData, error: authCreateError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: emailVerified || true, // Auto-confirm invited users
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        invited_by: user.id,
        invited_at: new Date().toISOString(),
      },
    });

    if (authCreateError) {
      console.error('Error creating auth user:', authCreateError);
      return NextResponse.json(
        { error: `Failed to create user: ${authCreateError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed - no user returned' },
        { status: 500 }
      );
    }

    // Create user profile
    const { data: profileData, error: profileCreateError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email,
        username: email.split('@')[0],
        display_name: displayName,
        first_name: firstName || null,
        last_name: lastName || null,
        role: role || 'campaign_manager',
        account_status: accountStatus || 'active',
        subscription_tier: subscriptionTier || 'professional_agency',
        email_verified: emailVerified || true,
        is_test_user: isTestUser || false,
        test_user_expires_at: testUserExpiresAt || null,
        suite_access: suiteAccess || getDefaultSuiteAccess(),
        admin_notes: adminNotes || null,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (profileCreateError) {
      console.error('Error creating profile:', profileCreateError);

      // Cleanup: Delete the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: `Failed to create profile: ${profileCreateError.message}` },
        { status: 500 }
      );
    }

    // Grant suite-specific permissions
    if (suiteAccess) {
      const permissions: any[] = [];

      Object.entries(suiteAccess).forEach(([suiteId, access]: [string, any]) => {
        if (access.enabled) {
          // Add basic permissions for each enabled suite
          permissions.push({
            user_id: authData.user.id,
            resource: suiteId,
            action: 'read',
            is_active: true,
            granted_by: user.id,
            granted_at: new Date().toISOString(),
          });

          if (access.access_level === 'full') {
            permissions.push(
              {
                user_id: authData.user.id,
                resource: suiteId,
                action: 'create',
                is_active: true,
                granted_by: user.id,
                granted_at: new Date().toISOString(),
              },
              {
                user_id: authData.user.id,
                resource: suiteId,
                action: 'update',
                is_active: true,
                granted_by: user.id,
                granted_at: new Date().toISOString(),
              },
              {
                user_id: authData.user.id,
                resource: suiteId,
                action: 'delete',
                is_active: true,
                granted_by: user.id,
                granted_at: new Date().toISOString(),
              }
            );
          }
        }
      });

      if (permissions.length > 0) {
        const { error: permissionsError } = await supabase
          .from('user_permissions')
          .insert(permissions);

        if (permissionsError) {
          console.error('Error creating permissions:', permissionsError);
          // Don't fail the whole operation, just log the error
        }
      }
    }

    // Log the invitation in audit logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'user_invited',
      resource: 'users',
      resource_id: authData.user.id,
      metadata: {
        invited_email: email,
        role,
        is_test_user: isTestUser,
        enabled_suites: Object.keys(suiteAccess || {}).filter(
          (key) => suiteAccess[key].enabled
        ),
      },
      created_at: new Date().toISOString(),
    });

    // Send invitation email
    try {
      await sendInvitationEmail({
        email,
        firstName: firstName || displayName,
        tempPassword,
        invitedBy: user.email || 'Admin',
        suiteAccess,
        isTestUser,
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the operation if email fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email,
        displayName,
        role,
        isTestUser,
      },
      tempPassword, // Return temp password for admin to share if email fails
      message: 'User invited successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error inviting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate secure password
function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Helper function to get default suite access
function getDefaultSuiteAccess() {
  return {
    social_media: { enabled: true, access_level: 'full', can_publish: true, can_view_analytics: true },
    content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
    email_marketing: { enabled: true, access_level: 'full', can_send: true, can_view_analytics: true },
    analytics: { enabled: true, access_level: 'read_only', can_export: false },
    campaigns: { enabled: true, access_level: 'full', can_create: true, can_manage_budget: false },
    billing: { enabled: false, access_level: 'none', can_view: false, can_edit: false },
  };
}

// Helper function to send invitation email
async function sendInvitationEmail({
  email,
  firstName,
  tempPassword,
  invitedBy,
  suiteAccess,
  isTestUser,
}: {
  email: string;
  firstName: string;
  tempPassword: string;
  invitedBy: string;
  suiteAccess: any;
  isTestUser: boolean;
}) {
  // Get enabled suites
  const enabledSuites = Object.entries(suiteAccess)
    .filter(([_, access]: [string, any]) => access.enabled)
    .map(([suiteId]) => suiteId.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

  const subject = `You're invited to PulseBridge.ai${isTestUser ? ' (Test Access)' : ''}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
        .suites { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .suite-item { padding: 10px; margin: 5px 0; background: #f3f4f6; border-radius: 4px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        ${isTestUser ? '.test-badge { background: #fbbf24; color: #78350f; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 10px; }' : ''}
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
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
            <p><small style="color: #666;">Please change your password after your first login.</small></p>
          </div>

          <div class="suites">
            <h3>Your Enabled Features:</h3>
            ${enabledSuites.map(suite => `<div class="suite-item">✓ ${suite}</div>`).join('')}
          </div>

          ${isTestUser ? `
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>🧪 Test User Access</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px;">You have full access to all enabled features without payment. This is for testing and providing feedback.</p>
            </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="https://autopilot-web-rho.vercel.app/login" class="button">
              Login to Your Account
            </a>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Need help? Reply to this email or contact support@pulsebridge.ai
          </p>
        </div>
        <div class="footer">
          <p>© 2025 PulseBridge.ai. All rights reserved.</p>
          <p>This invitation was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // In production, integrate with email service (SendGrid, Resend, etc.)
  // For now, just log the email details
  console.log('Invitation email to send:', {
    to: email,
    subject,
    tempPassword,
  });

  // TODO: Integrate with actual email service
  // Example with Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'PulseBridge <noreply@pulsebridge.ai>',
  //     to: email,
  //     subject,
  //     html: htmlBody,
  //   }),
  // });

  return true;
}
