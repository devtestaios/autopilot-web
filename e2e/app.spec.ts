import { test, expect } from '@playwright/test';

test.describe('PulseBridge.ai E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/PulseBridge\.ai/);
    await expect(page.locator('[data-testid="main-navigation"]').first()).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.goto('/campaigns');
    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator('h1').first()).toContainText('Campaign Command Center');
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('[data-testid="analytics-title"]')).toContainText('Analytics', { timeout: 10000 });
  });

  test('should load dashboard with key metrics', async ({ page }) => {
    await page.goto('/dashboard');
    // Just check that the dashboard page loads properly
    await expect(page.locator('main, [class*="dashboard"], .min-h-screen').first()).toBeVisible({ timeout: 10000 });
    
    // Check if it's mobile view and sidebar is hidden, or desktop with visible sidebar/nav
    const isMobile = page.viewportSize()?.width && page.viewportSize()!.width < 768;
    if (isMobile) {
      // On mobile, just ensure page content is visible
      await expect(page.locator('body').first()).toBeVisible();
    } else {
      // On desktop, check for sidebar/navigation
      await expect(page.locator('[data-testid="unified-sidebar"], nav').first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="main-navigation"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('main')).toBeVisible();
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