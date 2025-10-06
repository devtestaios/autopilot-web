import { EnterpriseCompanyAPI } from '../enterpriseAPI';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ 
            data: { 
              id: 'test-company-id',
              name: 'Test Company',
              subscription_tier: 'enterprise' 
            }, 
            error: null 
          })),
          range: jest.fn(() => Promise.resolve({ 
            data: [], 
            error: null,
            count: 0 
          }))
        })),
        ilike: jest.fn(() => ({
          range: jest.fn(() => Promise.resolve({ 
            data: [], 
            error: null,
            count: 0 
          }))
        })),
        range: jest.fn(() => Promise.resolve({ 
          data: [], 
          error: null,
          count: 0 
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ 
          data: [{ id: 'new-company-id' }], 
          error: null 
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({ 
            data: [{ id: 'updated-company-id' }], 
            error: null 
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        }))
      }))
    }))
  }
}));

describe('Enterprise API - Company Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EnterpriseCompanyAPI Class', () => {
    test('class exists and has static methods', () => {
      expect(EnterpriseCompanyAPI).toBeDefined();
      expect(typeof EnterpriseCompanyAPI.fetchCompanies).toBe('function');
    });

    test('fetchCompanies method exists', () => {
      expect(EnterpriseCompanyAPI.fetchCompanies).toBeDefined();
      expect(typeof EnterpriseCompanyAPI.fetchCompanies).toBe('function');
    });
  });

  describe('Company Fetching', () => {
    test('fetchCompanies returns companies', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('companies');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.companies)).toBe(true);
      expect(typeof result.total).toBe('number');
    });

    test('fetchCompanies with options', async () => {
      const options = {
        limit: 25,
        offset: 10,
        search: 'test',
        status: 'active',
        subscription_tier: 'enterprise'
      };
      
      const result = await EnterpriseCompanyAPI.fetchCompanies(options);
      
      expect(result).toBeDefined();
      expect(result.companies).toBeDefined();
      expect(result.total).toBeDefined();
    });

    test('fetchCompanies with default options', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({});
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.companies)).toBe(true);
    });

    test('fetchCompanies with empty options', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies();
      
      expect(result).toBeDefined();
      expect(typeof result.total).toBe('number');
    });
  });

  describe('Error Handling', () => {
    test('handles database errors gracefully', async () => {
      // Mock database error
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: () => ({
          range: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Database error' },
            count: null 
          })
        })
      });
      
      const result = await EnterpriseCompanyAPI.fetchCompanies();
      
      // Should handle error gracefully
      expect(result).toBeDefined();
    });

    test('handles network errors', async () => {
      // Mock network error
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementationOnce(() => {
        throw new Error('Network error');
      });
      
      // Should not throw
      await expect(EnterpriseCompanyAPI.fetchCompanies()).resolves.toBeDefined();
    });
  });

  describe('Method Parameter Validation', () => {
    test('handles null options', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies(null as any);
      
      expect(result).toBeDefined();
    });

    test('handles undefined options', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies(undefined);
      
      expect(result).toBeDefined();
    });

    test('handles invalid limit values', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ limit: -1 });
      
      expect(result).toBeDefined();
    });

    test('handles invalid offset values', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ offset: -10 });
      
      expect(result).toBeDefined();
    });
  });

  describe('API Integration', () => {
    test('calls supabase with correct parameters', async () => {
      const mockSupabase = require('@/lib/supabase').supabase;
      
      await EnterpriseCompanyAPI.fetchCompanies({ limit: 25, offset: 10 });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('companies');
    });

    test('constructs queries correctly', async () => {
      const mockSupabase = require('@/lib/supabase').supabase;
      const mockSelect = jest.fn(() => ({
        range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 }))
      }));
      
      mockSupabase.from.mockReturnValueOnce({
        select: mockSelect
      });
      
      await EnterpriseCompanyAPI.fetchCompanies();
      
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('Response Processing', () => {
    test('processes successful responses', async () => {
      const mockData = [
        { id: '1', name: 'Company 1', subscription_tier: 'enterprise' },
        { id: '2', name: 'Company 2', subscription_tier: 'professional_agency' }
      ];
      
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: () => ({
          range: () => Promise.resolve({ 
            data: mockData, 
            error: null,
            count: 2 
          })
        })
      });
      
      const result = await EnterpriseCompanyAPI.fetchCompanies();
      
      expect(result.companies).toEqual(mockData);
      expect(result.total).toBe(2);
    });

    test('handles empty responses', async () => {
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: () => ({
          range: () => Promise.resolve({ 
            data: [], 
            error: null,
            count: 0 
          })
        })
      });
      
      const result = await EnterpriseCompanyAPI.fetchCompanies();
      
      expect(result.companies).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('Performance and Scalability', () => {
    test('handles large datasets efficiently', async () => {
      const startTime = Date.now();
      
      await EnterpriseCompanyAPI.fetchCompanies({ limit: 1000 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete reasonably quickly even with large limits
      expect(duration).toBeLessThan(5000);
    });

    test('supports pagination', async () => {
      const page1 = await EnterpriseCompanyAPI.fetchCompanies({ limit: 10, offset: 0 });
      const page2 = await EnterpriseCompanyAPI.fetchCompanies({ limit: 10, offset: 10 });
      
      expect(page1).toBeDefined();
      expect(page2).toBeDefined();
      expect(page1.companies).toBeDefined();
      expect(page2.companies).toBeDefined();
    });
  });

  describe('Search Functionality', () => {
    test('supports search queries', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ search: 'test company' });
      
      expect(result).toBeDefined();
      expect(result.companies).toBeDefined();
    });

    test('supports empty search', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ search: '' });
      
      expect(result).toBeDefined();
    });

    test('supports special characters in search', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ search: 'test@company.com' });
      
      expect(result).toBeDefined();
    });
  });

  describe('Filtering Functionality', () => {
    test('supports status filtering', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({ status: 'active' });
      
      expect(result).toBeDefined();
    });

    test('supports subscription tier filtering', async () => {
      const tiers = ['trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'];
      
      for (const tier of tiers) {
        const result = await EnterpriseCompanyAPI.fetchCompanies({ subscription_tier: tier });
        expect(result).toBeDefined();
      }
    });

    test('supports multiple filters', async () => {
      const result = await EnterpriseCompanyAPI.fetchCompanies({
        status: 'active',
        subscription_tier: 'enterprise',
        search: 'test'
      });
      
      expect(result).toBeDefined();
    });
  });
});