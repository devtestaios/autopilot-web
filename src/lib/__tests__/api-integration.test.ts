import {
  createTestCampaign,
  createTestMetrics,
  createTestUser,
  createTestCompany,
  mockApiResponse,
} from './test-mocks';

describe('API Integration Functions', () => {
  describe('Campaign Management', () => {
    it('should handle campaign creation', () => {
      const campaign = createTestCampaign({
        name: 'Test Campaign',
        status: 'ACTIVE',
        budget: 1000
      });

      expect(campaign).toMatchObject({
        id: expect.any(String),
        name: 'Test Campaign',
        status: 'ACTIVE',
        budget: 1000,
        created_at: expect.any(String)
      });
    });

    it('should handle campaign metrics', () => {
      const metrics = createTestMetrics({
        impressions: 1000,
        clicks: 50,
        cost: 250
      });

      expect(metrics).toMatchObject({
        impressions: 1000,
        clicks: 50,
        cost: 250,
        ctr: 0.05,
        cpm: 250 // CPM is (cost/impressions) * 1000 = (250/1000) * 1000 = 250
      });
    });

    it('should calculate performance ratios', () => {
      const metrics = createTestMetrics({
        impressions: 2000,
        clicks: 100,
        conversions: 10,
        cost: 500
      });

      expect(metrics.ctr).toBe(0.05); // 100/2000
      expect(metrics.conversion_rate).toBe(0.1); // 10/100
      expect(metrics.cpc).toBe(5); // 500/100
    });
  });

  describe('User Management', () => {
    it('should create user profiles', () => {
      const user = createTestUser({
        email: 'test@example.com',
        role: 'admin'
      });

      expect(user).toMatchObject({
        id: expect.any(String),
        email: 'test@example.com',
        role: 'admin',
        created_at: expect.any(String)
      });
    });

    it('should handle user preferences', () => {
      const user = createTestUser({
        preferences: {
          notifications: true,
          theme: 'dark',
          timezone: 'UTC'
        }
      });

      expect(user.preferences).toMatchObject({
        notifications: true,
        theme: 'dark',
        timezone: 'UTC'
      });
    });
  });

  describe('Company Management', () => {
    it('should create company profiles', () => {
      const company = createTestCompany({
        name: 'Test Corp',
        industry: 'Technology',
        size: 'medium'
      });

      expect(company).toMatchObject({
        id: expect.any(String),
        name: 'Test Corp',
        industry: 'Technology',
        size: 'medium'
      });
    });

    it('should handle company settings', () => {
      const company = createTestCompany({
        settings: {
          auto_optimization: true,
          reporting_frequency: 'weekly',
          budget_alerts: true
        }
      });

      expect(company.settings).toMatchObject({
        auto_optimization: true,
        reporting_frequency: 'weekly',
        budget_alerts: true
      });
    });
  });

  describe('API Response Handling', () => {
    it('should mock successful API responses', () => {
      const response = mockApiResponse({
        data: { campaigns: [] },
        success: true
      });

      expect(response).toMatchObject({
        data: { campaigns: [] },
        success: true,
        timestamp: expect.any(String)
      });
    });

    it('should mock error API responses', () => {
      const response = mockApiResponse({
        error: 'API Error',
        success: false
      });

      expect(response).toMatchObject({
        error: 'API Error',
        success: false,
        timestamp: expect.any(String)
      });
    });
  });

  describe('Data Validation', () => {
    it('should validate campaign data structure', () => {
      const campaign = createTestCampaign();
      
      // Required fields
      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBeDefined();
      expect(campaign.status).toBeDefined();
      expect(campaign.created_at).toBeDefined();
      
      // Data types
      expect(typeof campaign.id).toBe('string');
      expect(typeof campaign.name).toBe('string');
      expect(['ACTIVE', 'PAUSED', 'ENDED']).toContain(campaign.status);
    });

    it('should validate metrics data structure', () => {
      const metrics = createTestMetrics();
      
      // Required numeric fields
      expect(typeof metrics.impressions).toBe('number');
      expect(typeof metrics.clicks).toBe('number');
      expect(typeof metrics.cost).toBe('number');
      
      // Calculated fields
      expect(typeof metrics.ctr).toBe('number');
      expect(typeof metrics.cpm).toBe('number');
    });

    it('should validate user data structure', () => {
      const user = createTestUser();
      
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBeDefined();
      expect(['admin', 'user', 'viewer']).toContain(user.role);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty campaign creation', () => {
      const campaign = createTestCampaign({});
      
      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBeDefined();
      expect(campaign.status).toBeDefined();
    });

    it('should handle zero metrics', () => {
      const metrics = createTestMetrics({
        impressions: 0,
        clicks: 0,
        cost: 0
      });

      expect(metrics.ctr).toBe(0);
      expect(metrics.cpm).toBe(0);
      expect(metrics.cpc).toBe(0);
    });

    it('should handle division by zero in metrics', () => {
      const metrics = createTestMetrics({
        impressions: 1000,
        clicks: 0,
        cost: 100
      });

      expect(metrics.ctr).toBe(0);
      expect(metrics.cpc).toBe(0);
      expect(metrics.cpm).toBeGreaterThan(0);
    });
  });

  describe('Platform Integration', () => {
    it('should handle Google Ads platform data', () => {
      const campaign = createTestCampaign({ platform: 'google' });
      expect(campaign.platform).toBe('google');
    });

    it('should handle Meta platform data', () => {
      const campaign = createTestCampaign({ platform: 'meta' });
      expect(campaign.platform).toBe('meta');
    });

    it('should handle multiple campaigns from different platforms', () => {
      const googleCampaign = createTestCampaign({ platform: 'google', name: 'Google Campaign' });
      const metaCampaign = createTestCampaign({ platform: 'meta', name: 'Meta Campaign' });

      expect(googleCampaign.platform).toBe('google');
      expect(metaCampaign.platform).toBe('meta');
      expect(googleCampaign.id).not.toBe(metaCampaign.id);
    });
  });

  describe('Performance Calculations', () => {
    it('should calculate accurate CTR values', () => {
      const highCtrMetrics = createTestMetrics({
        impressions: 1000,
        clicks: 100
      });
      expect(highCtrMetrics.ctr).toBe(0.1); // 10% CTR

      const lowCtrMetrics = createTestMetrics({
        impressions: 10000,
        clicks: 50
      });
      expect(lowCtrMetrics.ctr).toBe(0.005); // 0.5% CTR
    });

    it('should calculate accurate CPC values', () => {
      const metrics = createTestMetrics({
        cost: 1000,
        clicks: 100
      });
      expect(metrics.cpc).toBe(10); // $10 per click
    });

    it('should calculate accurate CPM values', () => {
      const metrics = createTestMetrics({
        cost: 100,
        impressions: 10000
      });
      expect(metrics.cpm).toBe(10); // $10 per 1000 impressions
    });
  });
});