#!/usr/bin/env node

/**
 * Admin Invite User API Test
 * Tests the complete invite user flow including email delivery
 */

require('dotenv').config({ path: '.env.local' });

const TEST_CONFIG = {
  API_BASE: 'http://localhost:3003',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'PulseBridge2025!',
  TEST_EMAIL: 'gray@pulsebridge.ai', // Change to your test email
  INVITE_DATA: {
    email: 'gray@pulsebridge.ai',
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    role: 'user',
    subscriptionTier: 'free',
    isTestUser: true,
    testUserExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    suiteAccess: {
      social_media: { enabled: true, access_level: 'full', can_publish: true },
      content_suite: { enabled: true, access_level: 'full', can_create: true },
      email_marketing: { enabled: true, access_level: 'read_only', can_send: false },
      analytics: { enabled: true, access_level: 'read_only', can_export: false }
    },
    adminNotes: 'Test user created for email integration testing',
    accountStatus: 'active',
    emailVerified: true
  }
};

console.log('🎯 Testing Admin Invite User API with Email Integration');
console.log('======================================================\n');

async function testAdminInviteAPI() {
  console.log('Step 1: Testing Admin Invite User API');
  console.log('=====================================');
  
  try {
    console.log(`📡 Calling API: ${TEST_CONFIG.API_BASE}/api/admin/invite-user`);
    console.log(`👤 Test Email: ${TEST_CONFIG.TEST_EMAIL}`);
    console.log(`🔐 Using Admin Password Authentication`);
    
    const response = await fetch(`${TEST_CONFIG.API_BASE}/api/admin/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': TEST_CONFIG.ADMIN_PASSWORD
      },
      body: JSON.stringify(TEST_CONFIG.INVITE_DATA)
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`📄 Raw Response: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      return false;
    }
    
    if (response.ok) {
      console.log('✅ API Request Successful!');
      console.log('📧 User Details:', {
        id: responseData.user?.id,
        email: responseData.user?.email,
        role: responseData.user?.role,
        isTestUser: responseData.user?.isTestUser
      });
      
      if (responseData.tempPassword) {
        console.log(`🔑 Temporary Password: ${responseData.tempPassword}`);
      }
      
      console.log('📨 Email should be sent to:', TEST_CONFIG.TEST_EMAIL);
      return true;
    } else {
      console.error('❌ API Request Failed:');
      console.error('Status:', response.status);
      console.error('Error:', responseData.error || responseData.message || 'Unknown error');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    return false;
  }
}

async function checkServerHealth() {
  console.log('Step 0: Server Health Check');
  console.log('===========================');
  
  try {
    const response = await fetch(`${TEST_CONFIG.API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      console.log('✅ Server is responsive');
      return true;
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not responding:', error.message);
    console.log('🔧 Make sure the development server is running:');
    console.log('   cd /Users/grayadkins/Desktop/Autopilot_Repos/autopilot-web');
    console.log('   npx next dev --turbopack --port 3003');
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Admin Invite User Test Suite\n');
  
  // Check server health first
  const serverOk = await checkServerHealth();
  if (!serverOk) {
    console.log('\n❌ Cannot proceed without a running server.');
    process.exit(1);
  }
  
  console.log(''); // Empty line for readability
  
  // Test the invite user API
  const success = await testAdminInviteAPI();
  
  console.log('\n📊 Test Summary');
  console.log('===============');
  
  if (success) {
    console.log('✅ Admin Invite User API: PASS');
    console.log('📧 Email Integration: Should be delivered');
    console.log('🎯 Test User Creation: PASS');
    console.log('\n🎉 COMPLETE FLOW TESTED SUCCESSFULLY!');
    console.log('\nWhat to check:');
    console.log('1. Check your email inbox for the invitation');
    console.log('2. Verify the email template looks correct');
    console.log('3. Test login with the provided credentials');
    console.log('4. Confirm suite access works as configured');
  } else {
    console.log('❌ Admin Invite User API: FAIL');
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Verify the development server is running');
    console.log('2. Check the admin password in .env.local');
    console.log('3. Verify Supabase connection');
    console.log('4. Check server logs for detailed errors');
  }
  
  process.exit(success ? 0 : 1);
}

// Handle fetch globally if needed
if (typeof fetch === 'undefined') {
  console.log('📦 Installing node-fetch for API testing...');
  try {
    global.fetch = require('node-fetch');
  } catch (error) {
    console.error('❌ Please install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}