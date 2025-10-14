#!/usr/bin/env node

/**
 * Comprehensive Navigation Test
 * Tests all navigation links and reports broken ones
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Base URL for testing
const BASE_URL = 'http://localhost:3000';

// List of critical navigation routes to test
const ROUTES_TO_TEST = [
  // Public routes
  '/',
  '/login',
  '/register',
  '/pricing',
  '/enterprise-contact',
  
  // Dashboard routes
  '/dashboard',
  
  // Marketing routes
  '/campaigns',
  '/social-media',
  '/email-marketing', 
  '/content-suite',
  '/lead-management',
  
  // AI routes
  '/ai',
  '/ai-automation',
  '/ai-optimization',
  '/workflow-automation',
  
  // Business routes
  '/business-suite',
  '/project-management',
  '/business-intelligence',
  '/financial-management',
  
  // Collaboration routes
  '/teams',
  '/projects',
  '/real-time',
  
  // Platform routes
  '/analytics',
  '/integrations',
  '/settings',
  
  // Social Media sub-routes (from screenshot)
  '/social-media/overview',
  '/social-media/content-composer',
  '/social-media/content-calendar'
];

// Test each route
async function testRoutes() {
  console.log('🧪 Testing Navigation Routes...\n');
  
  const results = {
    working: [],
    broken: [],
    errors: []
  };
  
  for (const route of ROUTES_TO_TEST) {
    try {
      console.log(`Testing: ${route}`);
      
      // Use curl to test the route
      const response = execSync(
        `curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}"`,
        { encoding: 'utf8', timeout: 5000 }
      ).trim();
      
      const statusCode = parseInt(response);
      
      if (statusCode >= 200 && statusCode < 400) {
        console.log(`✅ ${route} - ${statusCode}`);
        results.working.push({ route, status: statusCode });
      } else {
        console.log(`❌ ${route} - ${statusCode}`);
        results.broken.push({ route, status: statusCode });
      }
      
    } catch (error) {
      console.log(`💥 ${route} - ERROR: ${error.message}`);
      results.errors.push({ route, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 NAVIGATION TEST RESULTS');
  console.log('='.repeat(50));
  
  console.log(`\n✅ Working Routes (${results.working.length}):`);
  results.working.forEach(({ route, status }) => {
    console.log(`  ${route} (${status})`);
  });
  
  console.log(`\n❌ Broken Routes (${results.broken.length}):`);
  results.broken.forEach(({ route, status }) => {
    console.log(`  ${route} (${status})`);
  });
  
  console.log(`\n💥 Error Routes (${results.errors.length}):`);
  results.errors.forEach(({ route, error }) => {
    console.log(`  ${route} - ${error}`);
  });
  
  console.log(`\n📈 Success Rate: ${Math.round((results.working.length / ROUTES_TO_TEST.length) * 100)}%`);
  
  return results;
}

// Check if server is running
function checkServer() {
  try {
    execSync(`curl -s ${BASE_URL} > /dev/null`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

// Main execution
if (!checkServer()) {
  console.log('❌ Server not running at', BASE_URL);
  console.log('Please start the development server with: npm run dev');
  process.exit(1);
}

testRoutes().then((results) => {
  if (results.broken.length > 0 || results.errors.length > 0) {
    process.exit(1);
  }
}).catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});