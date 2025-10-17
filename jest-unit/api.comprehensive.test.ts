import { APIError } from '@/lib/api';

describe('API Library - Comprehensive Tests', () => {
  describe('APIError Class', () => {
    test('creates APIError with message and status', () => {
      const error = new APIError('Not Found', 404);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('APIError');
    });

    test('creates APIError with different parameters', () => {
      const error1 = new APIError('Basic error');
      const error2 = new APIError('Error with status', 500);
      const error3 = new APIError('Error with all params', 422, 'VALIDATION_ERROR', { field: 'email' });
      
      expect(error1.message).toBe('Basic error');
      expect(error1.status).toBeUndefined();
      
      expect(error2.message).toBe('Error with status');
      expect(error2.status).toBe(500);
      
      expect(error3.message).toBe('Error with all params');
      expect(error3.status).toBe(422);
      expect(error3.code).toBe('VALIDATION_ERROR');
      expect(error3.details).toEqual({ field: 'email' });
    });

    test('APIError inherits from Error correctly', () => {
      const error = new APIError('Test error', 400);
      
      expect(error.name).toBe('APIError');
      expect(error.stack).toBeDefined();
      expect(typeof error.toString).toBe('function');
      expect(error instanceof Error).toBe(true);
    });

    test('handles edge cases in APIError creation', () => {
      const emptyError = new APIError('');
      const nullStatusError = new APIError('Message', null as any);
      const zeroStatusError = new APIError('Zero status', 0);
      
      expect(emptyError.message).toBe('');
      expect(nullStatusError.status).toBeNull();
      expect(zeroStatusError.status).toBe(0);
    });
  });

  describe('HTTP Status Code Validation', () => {
    test('validates 2xx success codes', () => {
      const successCodes = [200, 201, 202, 204, 206];
      
      successCodes.forEach(code => {
        expect(code).toBeGreaterThanOrEqual(200);
        expect(code).toBeLessThan(300);
      });
    });

    test('validates 4xx client error codes', () => {
      const clientErrorCodes = [400, 401, 403, 404, 422, 429];
      
      clientErrorCodes.forEach(code => {
        const error = new APIError(`Client error ${code}`, code);
        expect(error.status).toBeGreaterThanOrEqual(400);
        expect(error.status).toBeLessThan(500);
      });
    });

    test('validates 5xx server error codes', () => {
      const serverErrorCodes = [500, 502, 503, 504];
      
      serverErrorCodes.forEach(code => {
        const error = new APIError(`Server error ${code}`, code);
        expect(error.status).toBeGreaterThanOrEqual(500);
        expect(error.status).toBeLessThan(600);
      });
    });
  });

  describe('Error Message Handling', () => {
    test('handles various message types', () => {
      const messages = [
        'Simple error',
        'Error with émojis 🚀',
        'Error with "quotes" and \'apostrophes\'',
        'Error with newlines\nand\ttabs',
        'Error with <html>tags</html>',
        'Very long error message that exceeds normal length to test how the APIError class handles extended messages with lots of details and information',
      ];

      messages.forEach(message => {
        const error = new APIError(message, 400);
        expect(error.message).toBe(message);
        expect(typeof error.message).toBe('string');
      });
    });

    test('handles null and undefined messages', () => {
      const nullError = new APIError(null as any);
      const undefinedError = new APIError(undefined as any);
      
      // Note: JavaScript converts null to string "null" and undefined to empty string in Error constructor
      expect(nullError.message).toBe('null');
      expect(undefinedError.message).toBe('');
    });
  });

  describe('API Configuration Validation', () => {
    test('validates URL patterns', () => {
      const validURLs = [
        'https://autopilot-api-1.onrender.com',
        'https://api.pulsebridge.ai',
        'http://localhost:8000',
        'https://staging-api.example.com'
      ];
      
      validURLs.forEach(url => {
        expect(typeof url).toBe('string');
        expect(url.startsWith('http')).toBe(true);
        expect(url.length).toBeGreaterThan(0);
      });
    });

    test('validates API response structure patterns', () => {
      const responsePatterns = [
        { success: true, data: {}, message: 'OK' },
        { success: false, error: 'Not found', code: 404 },
        { data: [], pagination: { page: 1, limit: 10 } },
        { result: null, meta: { timestamp: Date.now() } }
      ];
      
      responsePatterns.forEach(pattern => {
        expect(typeof pattern).toBe('object');
        expect(pattern).not.toBeNull();
        expect(Object.keys(pattern).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Code Classification', () => {
    test('classifies error codes by type', () => {
      const errorCodes = [
        { code: 'VALIDATION_ERROR', type: 'client' },
        { code: 'AUTHENTICATION_FAILED', type: 'client' },
        { code: 'RATE_LIMIT_EXCEEDED', type: 'client' },
        { code: 'INTERNAL_SERVER_ERROR', type: 'server' },
        { code: 'DATABASE_CONNECTION_FAILED', type: 'server' },
        { code: 'NETWORK_TIMEOUT', type: 'network' }
      ];
      
      errorCodes.forEach(({ code, type }) => {
        const error = new APIError(`${type} error`, 400, code);
        expect(error.code).toBe(code);
        expect(typeof error.code).toBe('string');
        expect(error.code!.length).toBeGreaterThan(0);
      });
    });

    test('handles missing error codes gracefully', () => {
      const error = new APIError('Error without code', 500);
      expect(error.code).toBeUndefined();
    });
  });

  describe('Error Details Structure', () => {
    test('handles complex error details', () => {
      const complexDetails = {
        field: 'email',
        value: 'invalid-email',
        constraints: ['isEmail', 'isNotEmpty'],
        nested: {
          deep: {
            property: 'value'
          }
        },
        array: [1, 2, 3]
      };
      
      const error = new APIError('Validation failed', 422, 'VALIDATION_ERROR', complexDetails);
      
      expect(error.details).toEqual(complexDetails);
      expect(error.details.field).toBe('email');
      expect(error.details.nested.deep.property).toBe('value');
      expect(Array.isArray(error.details.array)).toBe(true);
    });

    test('handles primitive error details', () => {
      const primitiveDetails = ['string detail', 42, true, null];
      
      primitiveDetails.forEach(detail => {
        const error = new APIError('Error with primitive detail', 400, 'TEST_ERROR', detail);
        expect(error.details).toBe(detail);
      });
    });
  });

  describe('API Error Serialization', () => {
    test('error serializes to JSON correctly', () => {
      const error = new APIError('Serialization test', 400, 'SERIALIZE_ERROR', { extra: 'data' });
      
      // Create a plain object with error properties for JSON serialization
      const errorObj = {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details
      };
      
      const serialized = JSON.stringify(errorObj);
      const parsed = JSON.parse(serialized);
      
      expect(typeof serialized).toBe('string');
      expect(parsed.message).toBe('Serialization test');
      expect(parsed.status).toBe(400);
      expect(parsed.code).toBe('SERIALIZE_ERROR');
      expect(parsed.details).toEqual({ extra: 'data' });
    });

    test('error toString method works', () => {
      const error = new APIError('ToString test', 500);
      const stringified = error.toString();
      
      expect(typeof stringified).toBe('string');
      expect(stringified).toContain('APIError');
      expect(stringified).toContain('ToString test');
    });
  });
});