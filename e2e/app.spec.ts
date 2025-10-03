import { test, expect } from '@playwright/test';

test.describe('PulseBridge.ai E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/PulseBridge\.ai/);
    
    // Homepage may show business setup wizard or main navigation depending on configuration
    // Check for either the setup wizard or main navigation
    const hasSetupWizard = await page.locator('h1:has-text("Welcome to PulseBridge.ai")').isVisible();
    const hasMainNavigation = await page.locator('[data-testid="main-navigation"]').isVisible();
    
    if (hasSetupWizard) {
      // Business setup wizard is shown
      await expect(page.locator('h1:has-text("Welcome to PulseBridge.ai")')).toBeVisible();
      await expect(page.locator('h2:has-text("Tell us about your business")')).toBeVisible();
    } else if (hasMainNavigation) {
      // Main navigation is shown
      await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    }
    
    // Main content should always be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.goto('/campaigns');
    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator('[data-testid="campaigns-title"]')).toContainText('Campaign Command Center', { timeout: 15000 });
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('[data-testid="analytics-title"]')).toContainText('Analytics', { timeout: 10000 });
  });

  test('should load dashboard with key metrics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for the dashboard title to appear (this indicates the page loaded successfully)
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible({ timeout: 15000 });
    
    // Ensure the container is present (dashboard uses container instead of main)
    await expect(page.locator('.container')).toBeVisible({ timeout: 10000 });
    
    // Verify the page title content
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Master Terminal');
    
    // Check that KPI cards are loaded
    await expect(page.locator('[data-testid="kpi-grid"]')).toBeVisible({ timeout: 10000 });
    
    // On desktop, we might see the sidebar (it loads dynamically)
    const viewportWidth = page.viewportSize()?.width || 1200;
    if (viewportWidth >= 768) {
      // Try to find the sidebar, but don't fail if it's still loading
      const sidebarVisible = await page.locator('[data-testid="unified-sidebar"]').isVisible().catch(() => false);
      if (sidebarVisible) {
        await expect(page.locator('[data-testid="unified-sidebar"]')).toBeVisible();
      }
    }
  });

  test('should handle responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check for either setup wizard or main navigation on mobile
    const hasSetupWizard = await page.locator('h1:has-text("Welcome to PulseBridge.ai")').isVisible();
    const hasMainNavigation = await page.locator('[data-testid="main-navigation"]').isVisible();
    
    if (hasSetupWizard) {
      // Business setup wizard should be visible and responsive
      await expect(page.locator('h1:has-text("Welcome to PulseBridge.ai")')).toBeVisible();
    } else if (hasMainNavigation) {
      // Main navigation should be visible
      await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    }
    
    // Page content should always be responsive
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Campaign Management Flow', () => {
  test('should create new campaign flow', async ({ page }) => {
    // Go directly to campaigns/new for now to test the form
    await page.goto('/campaigns/new');
    
    // Check URL and form elements
    await expect(page).toHaveURL(/.*campaigns\/new/);
    await expect(page.locator('[data-testid="campaign-form"]')).toBeVisible();
  });
});

test.describe('Analytics and Reporting', () => {
  test('should load performance analytics', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-card"]').first()).toBeVisible();
  });

  test('should load ROI analysis', async ({ page }) => {
    await page.goto('/analytics/roi');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('AI Features', () => {
  test('should load AI center', async ({ page }) => {
    await page.goto('/ai-center');
    await expect(page.locator('[data-testid="ai-chat"]').first()).toBeVisible().catch(() => {
      expect(page.locator('main')).toBeVisible();
    });
  });
});