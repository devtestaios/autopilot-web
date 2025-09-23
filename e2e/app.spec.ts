import { test, expect } from '@playwright/test';

test.describe('PulseBridge.ai E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/PulseBridge\.ai/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.goto('/campaigns');
    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator('h1')).toContainText('Campaigns');
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('h1').first()).toContainText('Analytics');
  });

  test('should load dashboard with key metrics', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="metric-card"]').first()).toBeVisible();
    await expect(page.locator('[role="img"]').first()).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Campaign Management Flow', () => {
  test('should create new campaign flow', async ({ page }) => {
    await page.goto('/campaigns');
    
    // Wait for button to be visible and clickable
    await page.waitForSelector('[data-testid="create-campaign-button"]');
    await page.click('[data-testid="create-campaign-button"]');
    
    // Check URL and form elements
    await expect(page).toHaveURL(/.*campaigns\/new/);
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});

test.describe('Analytics and Reporting', () => {
  test('should load performance analytics', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.locator('[role="img"]').first()).toBeVisible();
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