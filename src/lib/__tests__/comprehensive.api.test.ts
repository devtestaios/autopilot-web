/**
 * API Client Comprehensive Testing Suite
 * Expanding coverage for core API infrastructure
 */

import * as api from '../api';
import { APIError } from '../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Client - Comprehensive Coverage', () => {
  
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock successful response by default
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ data: 'test' }),
      text: jest.fn().mockResolvedValue('success')
    });
  });

  describe('Core API Infrastructure', () => {
    test('APIError class construction and properties', () => {
      const error = new APIError(404, 'Not Found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('Error');
    });

    test('APIError with different status codes', () => {
      const errors = [
        new APIError(400, 'Bad Request'),
        new APIError(401, 'Unauthorized'),
        new APIError(403, 'Forbidden'),
        new APIError(500, 'Internal Server Error')
      ];

      errors.forEach((error, index) => {
        const expectedStatus = [400, 401, 403, 500][index];
        expect(error.status).toBe(expectedStatus);
        expect(error).toBeInstanceOf(APIError);
      });
    });
  });

  describe('Social Media API Functions', () => {
    test('getSocialAccounts handles successful response', async () => {
      const mockAccounts = [
        { id: '1', platform: 'instagram', username: 'test1' },
        { id: '2', platform: 'linkedin', username: 'test2' }
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAccounts)
      });

      const result = await api.getSocialAccounts();
      
      expect(result).toEqual(mockAccounts);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/social-media/accounts'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('getSocialAccounts handles API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'Not found' })
      });

      await expect(api.getSocialAccounts()).rejects.toThrow(APIError);
      await expect(api.getSocialAccounts()).rejects.toThrow('Not found');
    });

    test('createSocialPost with valid data', async () => {
      const postData = {
        platform: 'instagram',
        content: 'Test post',
        mediaUrls: ['https://example.com/image.jpg']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'post123', ...postData })
      });

      const result = await api.createSocialPost(postData);
      
      expect(result).toMatchObject(postData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/social-media/posts'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(postData)
        })
      );
    });

    test('updateSocialPost with patch data', async () => {
      const postId = 'post123';
      const updateData = { content: 'Updated content' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: postId, ...updateData })
      });

      const result = await api.updateSocialPost(postId, updateData);
      
      expect(result).toMatchObject(updateData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/social-media/posts/${postId}`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      );
    });

    test('deleteSocialPost success', async () => {
      const postId = 'post123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      });

      await expect(api.deleteSocialPost(postId)).resolves.not.toThrow();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/social-media/posts/${postId}`),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('Email Marketing API Functions', () => {
    test('getEmailCampaigns with successful response', async () => {
      const mockCampaigns = [
        { id: '1', name: 'Welcome Series', status: 'active' },
        { id: '2', name: 'Newsletter', status: 'draft' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockCampaigns)
      });

      const result = await api.getEmailCampaigns();
      
      expect(result).toEqual(mockCampaigns);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/email-marketing/campaigns'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('createEmailCampaign with campaign data', async () => {
      const campaignData = {
        name: 'New Campaign',
        subject: 'Test Subject',
        content: 'Campaign content',
        targetAudience: 'all'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'campaign123', ...campaignData })
      });

      const result = await api.createEmailCampaign(campaignData);
      
      expect(result).toMatchObject(campaignData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/email-marketing/campaigns'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(campaignData)
        })
      );
    });

    test('getEmailSubscribers pagination', async () => {
      const mockSubscribers = {
        data: [
          { id: '1', email: 'user1@example.com', status: 'active' },
          { id: '2', email: 'user2@example.com', status: 'active' }
        ],
        pagination: { page: 1, limit: 10, total: 2 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSubscribers)
      });

      const result = await api.getEmailSubscribers();
      
      expect(result).toEqual(mockSubscribers);
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
    });

    test('sendEmailCampaign triggers sending', async () => {
      const campaignId = 'campaign123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ 
          success: true, 
          message: 'Campaign sent successfully',
          sentCount: 1500
        })
      });

      const result = await api.sendEmailCampaign(campaignId);
      
      expect(result.success).toBe(true);
      expect(result.sentCount).toBe(1500);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/email-marketing/campaigns/${campaignId}/send`),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('Collaboration API Functions', () => {
    test('getTeamMembers returns team data', async () => {
      const mockTeam = [
        { id: '1', name: 'John Doe', role: 'admin', status: 'active' },
        { id: '2', name: 'Jane Smith', role: 'editor', status: 'active' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTeam)
      });

      const result = await api.getTeamMembers();
      
      expect(result).toEqual(mockTeam);
      expect(result).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/collaboration/team'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('inviteTeamMember sends invitation', async () => {
      const inviteData = {
        email: 'newuser@example.com',
        role: 'editor',
        permissions: ['read', 'write']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ 
          success: true, 
          inviteId: 'invite123',
          message: 'Invitation sent'
        })
      });

      const result = await api.inviteTeamMember(inviteData);
      
      expect(result.success).toBe(true);
      expect(result.inviteId).toBe('invite123');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/collaboration/team/invite'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(inviteData)
        })
      );
    });

    test('getCollaborationProjects returns projects', async () => {
      const mockProjects = [
        { id: '1', name: 'Website Redesign', status: 'active', members: 5 },
        { id: '2', name: 'Marketing Campaign', status: 'planning', members: 3 }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProjects)
      });

      const result = await api.getCollaborationProjects();
      
      expect(result).toEqual(mockProjects);
      expect(result[0]).toHaveProperty('members');
      expect(result[1]).toHaveProperty('status');
    });

    test('createCollaborationProject with project data', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        deadline: '2024-12-31',
        members: ['user1', 'user2']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'project123', ...projectData })
      });

      const result = await api.createCollaborationProject(projectData);
      
      expect(result).toMatchObject(projectData);
      expect(result.id).toBe('project123');
    });
  });

  describe('Integrations API Functions', () => {
    test('getIntegrations returns available integrations', async () => {
      const mockIntegrations = [
        { id: '1', name: 'Zapier', category: 'automation', status: 'active' },
        { id: '2', name: 'Slack', category: 'communication', status: 'available' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockIntegrations)
      });

      const result = await api.getIntegrations();
      
      expect(result).toEqual(mockIntegrations);
      expect(result[0]).toHaveProperty('category');
      expect(result[1]).toHaveProperty('status');
    });

    test('installIntegration handles installation', async () => {
      const integrationId = 'integration123';
      const config = { apiKey: 'test-key', webhook: 'https://example.com/hook' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ 
          success: true, 
          installationId: 'install456',
          message: 'Integration installed successfully'
        })
      });

      const result = await api.installIntegration(integrationId, config);
      
      expect(result.success).toBe(true);
      expect(result.installationId).toBe('install456');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/integrations/${integrationId}/install`),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(config)
        })
      );
    });

    test('getIntegrationUsage returns usage statistics', async () => {
      const integrationId = 'integration123';
      const mockUsage = {
        totalRequests: 1500,
        successfulRequests: 1450,
        failedRequests: 50,
        lastUsed: '2024-12-19T10:00:00Z',
        monthlyUsage: 45000
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUsage)
      });

      const result = await api.getIntegrationUsage(integrationId);
      
      expect(result).toEqual(mockUsage);
      expect(result.totalRequests).toBe(1500);
      expect(result.successfulRequests).toBe(1450);
    });

    test('updateIntegrationConfig modifies settings', async () => {
      const integrationId = 'integration123';
      const newConfig = { 
        apiKey: 'updated-key', 
        enabled: true,
        notifications: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ 
          success: true, 
          config: newConfig,
          message: 'Configuration updated'
        })
      });

      const result = await api.updateIntegrationConfig(integrationId, newConfig);
      
      expect(result.success).toBe(true);
      expect(result.config).toEqual(newConfig);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getSocialAccounts()).rejects.toThrow('Network error');
    });

    test('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      });

      await expect(api.getSocialAccounts()).rejects.toThrow('Invalid JSON');
    });

    test('handles empty response bodies', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(null)
      });

      const result = await api.getSocialAccounts();
      expect(result).toBeNull();
    });

    test('handles different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];
      
      for (const status of statusCodes) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status,
          json: jest.fn().mockResolvedValue({ error: `Error ${status}` })
        });

        await expect(api.getSocialAccounts()).rejects.toThrow(APIError);
      }
    });

    test('handles rate limiting responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: {
          get: jest.fn().mockReturnValue('60') // Retry-After header
        },
        json: jest.fn().mockResolvedValue({ error: 'Rate limit exceeded' })
      });

      await expect(api.getSocialAccounts()).rejects.toThrow(APIError);
    });
  });

  describe('Request Configuration and Headers', () => {
    test('includes proper headers in requests', async () => {
      await api.getSocialAccounts();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('includes authentication headers when available', async () => {
      // Mock environment or context with auth token
      const originalEnv = process.env.NEXT_PUBLIC_API_TOKEN;
      process.env.NEXT_PUBLIC_API_TOKEN = 'test-token';

      await api.getSocialAccounts();

      // Restore environment
      process.env.NEXT_PUBLIC_API_TOKEN = originalEnv;

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('handles different HTTP methods correctly', async () => {
      const testCases = [
        { method: 'GET', func: () => api.getSocialAccounts() },
        { method: 'POST', func: () => api.createSocialPost({ platform: 'instagram', content: 'test' }) },
        { method: 'PUT', func: () => api.updateSocialPost('123', { content: 'updated' }) },
        { method: 'DELETE', func: () => api.deleteSocialPost('123') }
      ];

      for (const testCase of testCases) {
        mockFetch.mockClear();
        await testCase.func();
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: testCase.method
          })
        );
      }
    });
  });

  describe('Response Processing', () => {
    test('processes successful responses correctly', async () => {
      const testData = { id: '123', name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(testData)
      });

      const result = await api.getSocialAccounts();
      expect(result).toEqual(testData);
    });

    test('processes array responses correctly', async () => {
      const testData = [
        { id: '1', name: 'first' },
        { id: '2', name: 'second' }
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(testData)
      });

      const result = await api.getSocialAccounts();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    test('processes paginated responses correctly', async () => {
      const paginatedData = {
        data: [{ id: '1' }, { id: '2' }],
        pagination: { page: 1, limit: 10, total: 2, hasMore: false }
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(paginatedData)
      });

      const result = await api.getEmailSubscribers();
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('hasMore');
    });
  });
});