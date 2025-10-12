/**
 * Admin API: Invite User
 * Creates a new user with specific suite access and sends invitation email
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendInvitationEmail } from '@/lib/email/resend';

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

    // Send invitation email via Resend
    try {
      await sendInvitationEmail({
        to: email,
        firstName: firstName || displayName,
        tempPassword,
        invitedBy: user.email || 'Admin',
        suiteAccess,
        isTestUser,
        loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pulsebridge.ai'}/login`,
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

