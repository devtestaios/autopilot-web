import { test, expect } from '@playwright/test';

test.describe('Autopilot Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard title and navigation', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Autopilot/);
    
    // Check if navbar is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if dashboard title is displayed
    await expect(page.getByText('Autopilot Dashboard')).toBeVisible();
    
    // Check if description is displayed
    await expect(page.getByText('AI-powered marketing campaign management')).toBeVisible();
  });

  test('should display dashboard stats section', async ({ page }) => {
    // Wait for stats to load
    await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
    
    // Check for stat cards (they should be present even if showing 0)
    await expect(page.getByText('Total Campaigns')).toBeVisible();
    await expect(page.getByText('Active Campaigns')).toBeVisible();
    await expect(page.getByText('Total Budget')).toBeVisible();
    await expect(page.getByText('Total Spend')).toBeVisible();
  });

  test('should display Google Ads integration section', async ({ page }) => {
    await expect(page.getByText('Google Ads Integration')).toBeVisible();
    await expect(page.getByText('Real-time campaign performance sync')).toBeVisible();
    await expect(page.getByText('Automated budget optimization')).toBeVisible();
  });

  test('should display performance chart', async ({ page }) => {
    await expect(page.getByText('Campaign Performance Overview')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.click('text=View All Campaigns');
    await expect(page.url()).toContain('/campaigns');
    await expect(page.getByText('All Campaigns')).toBeVisible();
  });

  test('should navigate to create campaign page', async ({ page }) => {
    await page.click('text=Create Campaign');
    await expect(page.url()).toContain('/campaigns/new');
  });

  test('should show empty state when no campaigns exist', async ({ page }) => {
    // Assuming no campaigns exist in the test environment
    await expect(page.getByText('No campaigns yet')).toBeVisible();
    await expect(page.getByText('Get started by creating your first marketing campaign.')).toBeVisible();
  });
});

test.describe('Campaigns Page', () => {
  test('should display campaigns table and functionality', async ({ page }) => {
    await page.goto('/campaigns');
    
    // Check page title and navigation
    await expect(page.getByText('All Campaigns')).toBeVisible();
    await expect(page.getByText('Manage and monitor your marketing campaigns')).toBeVisible();
    
    // Check for search functionality
    await expect(page.getByPlaceholder('Search campaigns...')).toBeVisible();
    
    // Check for filters
    await expect(page.getByText('All Status')).toBeVisible();
    await expect(page.getByText('All Platforms')).toBeVisible();
    
    // Check for export button
    await expect(page.getByText('Export CSV')).toBeVisible();
  });

  test('should search campaigns', async ({ page }) => {
    await page.goto('/campaigns');
    
    const searchInput = page.getByPlaceholder('Search campaigns...');
    await searchInput.fill('test campaign');
    
    // The search should filter results (even if no results found)
    await expect(searchInput).toHaveValue('test campaign');
  });

  test('should filter by status', async ({ page }) => {
    await page.goto('/campaigns');
    
    const statusFilter = page.locator('select').first();
    await statusFilter.selectOption('active');
    
    // Filter should be applied
    await expect(statusFilter).toHaveValue('active');
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Check if mobile menu button is visible
    await expect(page.locator('button[title="Menu"]').or(page.locator('[data-testid="mobile-menu"]'))).toBeVisible();
    
    // Check if search is moved to mobile layout
    await expect(page.locator('.md\\:hidden input[placeholder*="Search"]')).toBeVisible();
  });

  test('should work on tablet size', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');
    
    await expect(page.getByText('Autopilot Dashboard')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should display error state when API fails', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    
    await page.goto('/');
    
    // Should show error message and retry button
    await expect(page.getByText('Error:')).toBeVisible();
    await expect(page.getByText('Retry')).toBeVisible();
  });
});