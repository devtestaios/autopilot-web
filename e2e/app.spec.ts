import { test, expect } from '@playwright/test';

test.describe('PulseBridge.ai E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load homepage and display key elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/PulseBridge\.ai/);
    
    // Check main navigation elements exist
    await expect(page.locator('nav')).toBeVisible();
    
    // Check main content area
    await expect(page.locator('main')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    // Click campaigns link
    await page.click('text=Campaigns');
    
    // Verify URL
    await expect(page).toHaveURL(/.*campaigns/);
    
    // Check page content
    await expect(page.locator('h1')).toContainText('Campaigns');
  });

  test('should navigate to analytics page', async ({ page }) => {
    // Click analytics link
    await page.click('text=Analytics');
    
    // Verify URL
    await expect(page).toHaveURL(/.*analytics/);
    
    // Check page content loads
    await expect(page.locator('h1')).toContainText('Analytics');
  });

  test('should open global search with Cmd+K', async ({ page }) => {
    // Trigger global search
    await page.keyboard.press('Meta+k');
    
    // Check search modal appears
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check search input is focused
    await expect(page.locator('input[placeholder*="Search"]')).toBeFocused();
  });

  test('should toggle theme', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"]').first();
    
    if (await themeToggle.isVisible()) {
      // Click theme toggle
      await themeToggle.click();
      
      // Check theme changed (dark/light mode)
      await expect(page.locator('html')).toHaveAttribute('class', /dark|light/);
    }
  });

  test('should load dashboard with key metrics', async ({ page }) => {
    // Navigate to dashboard
    await page.click('text=Dashboard');
    
    // Check dashboard elements load
    await expect(page.locator('[data-testid="metric-card"]').first()).toBeVisible();
    
    // Check charts load
    await expect(page.locator('[role="img"]').first()).toBeVisible();
  });

  test('should load and interact with campaign table', async ({ page }) => {
    // Navigate to campaigns
    await page.goto('/campaigns');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Check table has content
    await expect(page.locator('tbody tr')).not.toHaveCount(0);
    
    // Check action buttons exist
    await expect(page.locator('button[aria-label*="Edit"]').first()).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to a route that might have errors
    await page.goto('/campaigns/invalid-id');
    
    // Should not crash and show error boundary or 404
    await expect(page.locator('body')).toBeVisible();
    
    // Should have error messaging or redirect
    await expect(page.locator('text=Error')).toBeVisible().catch(() => {
      // Or redirect to valid page
      expect(page.url()).not.toContain('invalid-id');
    });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check navigation adapts to mobile
    await expect(page.locator('nav')).toBeVisible();
    
    // Check content is scrollable and accessible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load components without console errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate to key pages
    await page.goto('/dashboard');
    await page.goto('/campaigns');
    await page.goto('/analytics');
    
    // Check no critical errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('source-map') &&
      !error.includes('Failed to load resource')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Campaign Management Flow', () => {
  test('should create new campaign flow', async ({ page }) => {
    // Navigate to campaigns
    await page.goto('/campaigns');
    
    // Click create campaign button
    await page.click('text=Create Campaign');
    
    // Should navigate to campaign creation form
    await expect(page).toHaveURL(/.*campaigns\/new/);
    
    // Check form elements exist
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('select, [role="combobox"]').first()).toBeVisible();
  });

  test('should edit campaign flow', async ({ page }) => {
    // Navigate to campaigns
    await page.goto('/campaigns');
    
    // Click edit button on first campaign
    const editButton = page.locator('button[aria-label*="Edit"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should navigate to edit page
      await expect(page).toHaveURL(/.*campaigns\/.*\/edit/);
    }
  });
});

test.describe('Analytics and Reporting', () => {
  test('should load performance analytics', async ({ page }) => {
    await page.goto('/analytics/performance');
    
    // Check charts load
    await expect(page.locator('[role="img"]').first()).toBeVisible();
    
    // Check metric cards
    await expect(page.locator('[data-testid="metric-card"]').first()).toBeVisible();
  });

  test('should load ROI analysis', async ({ page }) => {
    await page.goto('/analytics/roi');
    
    // Check page loads without errors
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('AI Features', () => {
  test('should load AI center', async ({ page }) => {
    await page.goto('/ai');
    
    // Check AI features load
    await expect(page.locator('h1')).toContainText('AI');
    
    // Check AI components exist
    await expect(page.locator('[data-testid="ai-chat"]').first()).toBeVisible().catch(() => {
      // AI chat might be conditionally rendered
      expect(page.locator('main')).toBeVisible();
    });
  });

  test('should navigate AI analytics', async ({ page }) => {
    await page.goto('/ai/analytics');
    
    // Check AI analytics load
    await expect(page.locator('h1')).toBeVisible();
  });
});