import * as api from '@/lib/api';
import { APIError } from '@/lib/api';
import { mockFetch, mockSocialMediaData, mockEmailData, mockTeamData, resetAllMocks } from './test-mocks';

// Mock fetch globally
global.fetch = mockFetch as unknown as typeof fetch;

describe('API Library Tests', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('APIError Class', () => {
    test('creates APIError with message and status', () => {
      const error = new APIError('Not Found', 404);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
    });

    test('handles different status codes', () => {
      const errors = [
        new APIError('Bad Request', 400),
        new APIError('Unauthorized', 401),
        new APIError('Forbidden', 403),
        new APIError('Internal Server Error', 500)
      ];

      errors.forEach((error, index) => {
        const expectedStatus = [400, 401, 403, 500][index];
        expect(error.status).toBe(expectedStatus);
        expect(error).toBeInstanceOf(APIError);
      });
    });
  });

  describe('Social Media API Functions', () => {
    test('fetchSocialMediaAccounts returns account data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSocialMediaData.accounts)
      } as unknown as Response);

      const result = await api.fetchSocialMediaAccounts();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('platform');
    });

    test('createSocialMediaPost creates new post', async () => {
      const postData = {
        platform: 'instagram',
        content: 'Test post content',
        media_urls: ['https://example.com/image.jpg']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'post123', ...postData })
      });

      const result = await api.createSocialMediaPost(postData);
      
      expect(result).toMatchObject(postData);
      expect(result.id).toBe('post123');
    });
  });

  describe('Email Marketing API Functions', () => {
    test('fetchEmailCampaigns returns campaign data', async () => {
      const mockCampaigns = [
        { id: '1', name: 'Summer Campaign', status: 'active' },
        { id: '2', name: 'Winter Campaign', status: 'draft' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockCampaigns)
      });

      const result = await api.fetchEmailCampaigns();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name');
    });

    test('fetchEmailSubscribers returns subscriber data', async () => {
      const mockSubscribers = [
        { id: '1', email: 'user1@test.com', status: 'active' },
        { id: '2', email: 'user2@test.com', status: 'active' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSubscribers)
      });

      const result = await api.fetchEmailSubscribers();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('email');
    });
  });

  describe('Collaboration API Functions', () => {
    test('fetchTeamMembers returns team data', async () => {
      const mockMembers = [
        { id: '1', name: 'John Doe', role: 'admin' },
        { id: '2', name: 'Jane Smith', role: 'member' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMembers)
      });

      const result = await api.fetchTeamMembers();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('role');
    });

    test('fetchCollaborationProjects returns project data', async () => {
      const mockProjects = [
        { id: '1', name: 'Project Alpha', status: 'active' },
        { id: '2', name: 'Project Beta', status: 'planning' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProjects)
      });

      const result = await api.fetchCollaborationProjects();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('status');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.fetchSocialMediaAccounts()).rejects.toThrow('Network error');
    });

    test('handles HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(api.fetchSocialMediaAccounts()).rejects.toThrow(APIError);
    });

    test('handles JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      });

      await expect(api.fetchSocialMediaAccounts()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('API Configuration', () => {
    test('API functions are properly exported', () => {
      expect(typeof api.fetchSocialMediaAccounts).toBe('function');
      expect(typeof api.createSocialMediaPost).toBe('function');
      expect(typeof api.updateSocialMediaPost).toBe('function');
      expect(typeof api.deleteSocialMediaPost).toBe('function');
      expect(typeof api.fetchEmailCampaigns).toBe('function');
      expect(typeof api.fetchEmailSubscribers).toBe('function');
      expect(typeof api.fetchTeamMembers).toBe('function');
      expect(typeof api.fetchCollaborationProjects).toBe('function');
    });

    test('APIError is properly exported', () => {
      expect(APIError).toBeDefined();
      expect(typeof APIError).toBe('function');
    });
  });
});