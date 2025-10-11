// Test setup for API mocking
import { jest } from '@jest/globals';

// Mock fetch for API tests
export const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  mockFetch.mockReset();
};

describe('Test Mocks Setup', () => {
  it('should initialize mock functions', () => {
    expect(mockFetch).toBeDefined();
    expect(resetAllMocks).toBeDefined();
  });
});

// Enterprise API mock data
export const mockEnterpriseData = {
  companies: [
    {
      id: 'company-1',
      name: 'Test Company 1',
      status: 'active',
      subscription_tier: 'enterprise',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'company-2', 
      name: 'Test Company 2',
      status: 'active',
      subscription_tier: 'enterprise_plus',
      created_at: '2024-01-02T00:00:00Z',
    },
  ],
  subscriptionPlans: [
    {
      id: 'basic',
      name: 'Basic',
      price_monthly: 99,
      price_yearly: 999,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price_monthly: 1799,
      price_yearly: 17999,
    },
    {
      id: 'enterprise_plus',
      name: 'Enterprise Plus',
      price_monthly: 2999,
      price_yearly: 29999,
    },
  ],
};

// Social media API mock data
export const mockSocialMediaData = {
  accounts: [
    {
      id: 'social-1',
      platform: 'facebook',
      account_name: '@testcompany',
      followers: 10000,
      status: 'active',
    },
    {
      id: 'social-2',
      platform: 'instagram', 
      account_name: '@testcompany',
      followers: 15000,
      status: 'active',
    },
  ],
};

// Email marketing mock data
export const mockEmailData = {
  campaigns: [
    {
      id: 'email-1',
      name: 'Welcome Campaign',
      status: 'active',
      subscribers: 5000,
      open_rate: 0.25,
    },
    {
      id: 'email-2',
      name: 'Monthly Newsletter',
      status: 'draft',
      subscribers: 8000,
      open_rate: 0.18,
    },
  ],
  subscribers: [
    {
      id: 'sub-1',
      email: 'user1@example.com',
      status: 'subscribed',
      tags: ['premium'],
    },
    {
      id: 'sub-2',
      email: 'user2@example.com', 
      status: 'subscribed',
      tags: ['basic'],
    },
  ],
};

// Team collaboration mock data
export const mockTeamData = {
  members: [
    {
      id: 'member-1',
      name: 'John Doe',
      role: 'admin',
      email: 'john@example.com',
      status: 'active',
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      role: 'editor',
      email: 'jane@example.com',
      status: 'active',
    },
  ],
  projects: [
    {
      id: 'project-1',
      name: 'Q1 Campaign',
      status: 'in-progress',
      team_members: ['member-1', 'member-2'],
    },
    {
      id: 'project-2',
      name: 'Brand Refresh',
      status: 'planning',
      team_members: ['member-1'],
    },
  ],
};

// Additional interfaces and factories for comprehensive testing
export interface TestCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  budget?: number;
  created_at: string;
  updated_at?: string;
  platform?: 'google' | 'meta' | 'other';
}

export interface TestMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions?: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversion_rate?: number;
  created_at: string;
}

export interface TestUser {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  preferences?: Record<string, any>;
  last_login?: string;
}

export interface TestCompany {
  id: string;
  name: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large';
  created_at: string;
  settings?: Record<string, any>;
}

export interface TestApiResponse {
  data?: any;
  error?: string;
  success: boolean;
  timestamp: string;
  status_code?: number;
}

// Campaign mock factory
export function createTestCampaign(overrides: Partial<TestCampaign> = {}): TestCampaign {
  const defaultCampaign: TestCampaign = {
    id: `campaign_${Math.random().toString(36).substr(2, 9)}`,
    name: `Test Campaign ${Date.now()}`,
    status: 'ACTIVE',
    budget: 1000,
    created_at: new Date().toISOString(),
    platform: 'google',
  };

  return { ...defaultCampaign, ...overrides };
}

// Metrics mock factory with calculated fields
export function createTestMetrics(overrides: Partial<Omit<TestMetrics, 'ctr' | 'cpm' | 'cpc' | 'conversion_rate'>> = {}): TestMetrics {
  const baseMetrics = {
    impressions: 1000,
    clicks: 50,
    cost: 250,
    conversions: 5,
    created_at: new Date().toISOString(),
    ...overrides,
  };

  // Calculate derived metrics
  const ctr = baseMetrics.impressions > 0 ? (baseMetrics.clicks / baseMetrics.impressions) : 0;
  const cpm = baseMetrics.impressions > 0 ? (baseMetrics.cost / baseMetrics.impressions) * 1000 : 0;
  const cpc = baseMetrics.clicks > 0 ? (baseMetrics.cost / baseMetrics.clicks) : 0;
  const conversion_rate = baseMetrics.clicks > 0 && baseMetrics.conversions ? (baseMetrics.conversions / baseMetrics.clicks) : 0;

  return {
    ...baseMetrics,
    ctr,
    cpm,
    cpc,
    conversion_rate,
  };
}

// User mock factory
export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const defaultUser: TestUser = {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    email: `test${Date.now()}@example.com`,
    role: 'user',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  return { ...defaultUser, ...overrides };
}

// Company mock factory
export function createTestCompany(overrides: Partial<TestCompany> = {}): TestCompany {
  const defaultCompany: TestCompany = {
    id: `company_${Math.random().toString(36).substr(2, 9)}`,
    name: `Test Company ${Date.now()}`,
    industry: 'Technology',
    size: 'medium',
    created_at: new Date().toISOString(),
  };

  return { ...defaultCompany, ...overrides };
}

// API response mock factory
export function mockApiResponse(overrides: Partial<TestApiResponse> = {}): TestApiResponse {
  const defaultResponse: TestApiResponse = {
    success: true,
    timestamp: new Date().toISOString(),
    status_code: 200,
  };

  return { ...defaultResponse, ...overrides };
}

// Database client mocks
export function mockSupabaseClient() {
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    then: jest.fn().mockResolvedValue({ data: [], error: null }),
  };

  return {
    from: jest.fn().mockReturnValue(mockQuery),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: createTestUser() }, error: null }),
      signIn: jest.fn().mockResolvedValue({ data: { user: createTestUser() }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: null, error: null }),
        download: jest.fn().mockResolvedValue({ data: null, error: null }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  };
}

export function mockGoogleAdsClient() {
  return {
    Customer: jest.fn().mockImplementation(() => ({
      campaigns: {
        list: jest.fn().mockResolvedValue([createTestCampaign({ platform: 'google' })]),
        get: jest.fn().mockResolvedValue(createTestCampaign({ platform: 'google' })),
        create: jest.fn().mockResolvedValue(createTestCampaign({ platform: 'google' })),
        update: jest.fn().mockResolvedValue(createTestCampaign({ platform: 'google' })),
      },
      reports: {
        query: jest.fn().mockResolvedValue([createTestMetrics()]),
      },
    })),
    GoogleAdsApi: jest.fn().mockImplementation(() => ({
      Customer: jest.fn(),
    })),
  };
}

export function mockMetaAdsClient() {
  return {
    AdAccount: jest.fn().mockImplementation(() => ({
      getCampaigns: jest.fn().mockResolvedValue([createTestCampaign({ platform: 'meta' })]),
      createCampaign: jest.fn().mockResolvedValue(createTestCampaign({ platform: 'meta' })),
      getInsights: jest.fn().mockResolvedValue([createTestMetrics()]),
    })),
    FacebookAdsApi: jest.fn().mockImplementation(() => ({
      init: jest.fn(),
    })),
  };
}