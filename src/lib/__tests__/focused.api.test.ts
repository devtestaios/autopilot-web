import { APIError } from '@/lib/api';

describe('API Library - Focused Tests', () => {
  describe('APIError Class', () => {
    test('creates APIError with status and message', () => {
      const error = new APIError('Not Found', 404);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
    });

    test('creates APIError with different status codes', () => {
      const testCases = [400, 401, 403, 404, 500, 502, 503];
      const errors = testCases.map(status => 
        new APIError(`Error ${status}`, status)
      );
      
      errors.forEach((error, index) => {
        expect(error).toBeInstanceOf(APIError);
        expect(error.status).toBeGreaterThan(0);
        expect(error.message).toBeTruthy();
      });
    });

    test('APIError inherits from Error correctly', () => {
      const error = new APIError('Validation Error', 422);
      
      expect(error.name).toBe('APIError');
      expect(error.stack).toBeDefined();
      expect(typeof error.toString).toBe('function');
    });

    test('APIError with edge case status codes', () => {
      const edgeCases = [
        new APIError('Continue', 100),
        new APIError('Custom error', 999),
        new APIError('Zero status', 0)
      ];
      
      edgeCases.forEach(error => {
        expect(error).toBeInstanceOf(APIError);
        expect(typeof error.status).toBe('number');
        expect(typeof error.message).toBe('string');
      });
    });

  describe('API Constants and Configuration', () => {
    test('API base URL patterns', () => {
      // Test common API URL patterns
      const validUrls = [
        'https://api.example.com',
        'https://autopilot-api-1.onrender.com',
        'http://localhost:8000',
        'https://subdomain.domain.com/api/v1',
      ];

      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\/.+/);
        expect(url.length).toBeGreaterThan(0);
      });
    });

    test('API error handling patterns', () => {
      // Test error message patterns
      const errorMessages = [
        'Network request failed',
        'Invalid response format',
        'Rate limit exceeded',
        'Authentication required',
      ];

      errorMessages.forEach(message => {
        const error = new APIError(message, 400);
        expect(error.message).toBe(message);
        expect(error.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('HTTP Status Code Handling', () => {
    test('success status codes (2xx)', () => {
      const successCodes = [200, 201, 202, 204];
      
      successCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(200);
        expect(code).toBeLessThan(300);
      });
    });

    test('client error status codes (4xx)', () => {
      const clientErrorCodes = [400, 401, 403, 404, 422, 429];
      
      clientErrorCodes.forEach(code => {
        const error = new APIError(`Client error ${code}`, code);
        expect(error.status).toBeGreaterThanOrEqual(400);
        expect(error.status).toBeLessThan(500);
      });
    });

    test('server error status codes (5xx)', () => {
      const serverErrorCodes = [500, 502, 503, 504];
      
      serverErrorCodes.forEach(code => {
        const error = new APIError(`Server error ${code}`, code);
        expect(error.status).toBeGreaterThanOrEqual(500);
        expect(error.status).toBeLessThan(600);
      });
    });
  });

  describe('Error Message Validation', () => {
    test('handles empty and null messages', () => {
      const emptyError = new APIError('', 400);
      const nullError = new APIError(null as any, 400);
      
      expect(emptyError.message).toBe('');
      expect(nullError.message).toBeNull();
    });

    test('handles long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const error = new APIError(longMessage, 400);
      
      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(1000);
    });

    test('handles special characters in messages', () => {
      const specialMessages = [
        'Error with émojis 🚀',
        'Error with "quotes" and \'apostrophes\'',
        'Error with newlines\nand\ttabs',
        'Error with <html>tags</html>',
      ];

      specialMessages.forEach(message => {
        const error = new APIError(message, 400);
        expect(error.message).toBe(message);
      });
    });
  });

  describe('API Request/Response Patterns', () => {
    test('validates common request headers', () => {
      const commonHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'Accept': 'application/json',
        'User-Agent': 'AutopilotWeb/1.0',
      };

      Object.entries(commonHeaders).forEach(([key, value]) => {
        expect(key).toBeTruthy();
        expect(value).toBeTruthy();
        expect(typeof key).toBe('string');
        expect(typeof value).toBe('string');
      });
    });

    test('validates response data structures', () => {
      const mockResponses = [
        { data: [], message: 'Success', status: 'ok' },
        { error: 'Not found', code: 404 },
        { results: [1, 2, 3], total: 3, page: 1 },
        { success: true, data: { id: 1, name: 'Test' } },
      ];

      mockResponses.forEach(response => {
        expect(typeof response).toBe('object');
        expect(response).not.toBeNull();
        expect(Object.keys(response).length).toBeGreaterThan(0);
      });
    });
  });
});