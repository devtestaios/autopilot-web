/**
 * Utility Functions Comprehensive Testing Suite
 * Testing common utilities and helper functions
 */

// Mock various utility functions that might exist
describe('Utility Functions - Comprehensive Coverage', () => {
  
  describe('String Utilities', () => {
    // Test basic string manipulation functions
    test('string formatting functions', () => {
      const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
      const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
      const truncate = (text: string, length: number) => 
        text.length > length ? text.substring(0, length) + '...' : text;

      expect(formatCurrency(123.456)).toBe('$123.46');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000)).toBe('$1000.00');

      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test Title Here')).toBe('test-title-here');
      
      expect(truncate('Long text here', 10)).toBe('Long text ...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    test('validation functions', () => {
      const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isURL = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };
      const isPhoneNumber = (phone: string) => /^\+?[\d\s\-\(\)]+$/.test(phone);

      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('test@')).toBe(false);

      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://test.org')).toBe(true);
      expect(isURL('invalid-url')).toBe(false);

      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('(555) 123-4567')).toBe(true);
      expect(isPhoneNumber('invalid')).toBe(false);
    });

    test('text processing functions', () => {
      const capitalize = (text: string) => 
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      const extractHashtags = (text: string) => 
        text.match(/#[\w]+/g) || [];
      const extractMentions = (text: string) => 
        text.match(/@[\w]+/g) || [];

      expect(capitalize('hello WORLD')).toBe('Hello world');
      expect(capitalize('TEST')).toBe('Test');
      expect(capitalize('')).toBe('');

      expect(extractHashtags('Hello #world #test')).toEqual(['#world', '#test']);
      expect(extractHashtags('No hashtags here')).toEqual([]);

      expect(extractMentions('Hello @user1 and @user2')).toEqual(['@user1', '@user2']);
      expect(extractMentions('No mentions')).toEqual([]);
    });
  });

  describe('Date and Time Utilities', () => {
    test('date formatting functions', () => {
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const formatTime = (date: Date) => date.toTimeString().split(' ')[0];
      const formatDateTime = (date: Date) => 
        `${formatDate(date)} ${formatTime(date)}`;

      const testDate = new Date('2024-12-19T15:30:45');
      
      expect(formatDate(testDate)).toBe('2024-12-19');
      expect(formatTime(testDate)).toMatch(/15:30:45/);
      expect(formatDateTime(testDate)).toMatch(/2024-12-19 15:30:45/);
    });

    test('relative time functions', () => {
      const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
      };

      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      expect(getTimeAgo(fiveMinutesAgo)).toBe('5m ago');
      expect(getTimeAgo(twoHoursAgo)).toBe('2h ago');
      expect(getTimeAgo(threeDaysAgo)).toBe('3d ago');
    });

    test('date range functions', () => {
      const isDateInRange = (date: Date, start: Date, end: Date) => 
        date >= start && date <= end;
      const getDaysBetween = (start: Date, end: Date) => 
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      const start = new Date('2024-12-01');
      const middle = new Date('2024-12-15');
      const end = new Date('2024-12-31');

      expect(isDateInRange(middle, start, end)).toBe(true);
      expect(isDateInRange(new Date('2025-01-01'), start, end)).toBe(false);

      expect(getDaysBetween(start, end)).toBe(30);
      expect(getDaysBetween(start, middle)).toBe(14);
    });
  });

  describe('Array and Object Utilities', () => {
    test('array manipulation functions', () => {
      const unique = <T>(arr: T[]) => [...new Set(arr)];
      const chunk = <T>(arr: T[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      };
      const groupBy = <T>(arr: T[], key: keyof T) => {
        return arr.reduce((groups, item) => {
          const group = String(item[key]);
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {} as Record<string, T[]>);
      };

      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);

      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);

      const users = [
        { name: 'John', role: 'admin' },
        { name: 'Jane', role: 'user' },
        { name: 'Bob', role: 'admin' }
      ];
      const grouped = groupBy(users, 'role');
      expect(grouped.admin).toHaveLength(2);
      expect(grouped.user).toHaveLength(1);
    });

    test('object manipulation functions', () => {
      const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]) => {
        const result = {} as Pick<T, K>;
        keys.forEach(key => {
          if (key in obj) result[key] = obj[key];
        });
        return result;
      };

      const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]) => {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
      };

      const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

      const testObj = { a: 1, b: 2, c: 3, d: 4 };
      
      expect(pick(testObj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
      expect(omit(testObj, ['b', 'd'])).toEqual({ a: 1, c: 3 });

      const original = { nested: { value: 1 }, array: [1, 2, 3] };
      const cloned = deepClone(original);
      cloned.nested.value = 2;
      expect(original.nested.value).toBe(1); // Original unchanged
      expect(cloned.nested.value).toBe(2);
    });

    test('data transformation functions', () => {
      const sortBy = <T>(arr: T[], key: keyof T) => 
        [...arr].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
      
      const filterBy = <T>(arr: T[], predicate: (item: T) => boolean) => 
        arr.filter(predicate);

      const mapToProperty = <T, K extends keyof T>(arr: T[], key: K) => 
        arr.map(item => item[key]);

      const users = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 }
      ];

      expect(sortBy(users, 'name').map(u => u.name)).toEqual(['Alice', 'Bob', 'Charlie']);
      expect(filterBy(users, u => u.age > 30)).toHaveLength(1);
      expect(mapToProperty(users, 'name')).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('File and Media Utilities', () => {
    test('file type detection', () => {
      const getFileType = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoTypes = ['mp4', 'avi', 'mov', 'wmv'];
        const audioTypes = ['mp3', 'wav', 'ogg'];
        
        if (imageTypes.includes(ext || '')) return 'image';
        if (videoTypes.includes(ext || '')) return 'video';
        if (audioTypes.includes(ext || '')) return 'audio';
        return 'other';
      };

      expect(getFileType('photo.jpg')).toBe('image');
      expect(getFileType('video.mp4')).toBe('video');
      expect(getFileType('song.mp3')).toBe('audio');
      expect(getFileType('document.pdf')).toBe('other');
    });

    test('file size formatting', () => {
      const formatFileSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
      };

      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    test('URL and path utilities', () => {
      const getFilenameFromPath = (path: string) => path.split('/').pop() || '';
      const getDirectoryFromPath = (path: string) => path.substring(0, path.lastIndexOf('/'));
      const joinPaths = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/');

      expect(getFilenameFromPath('/path/to/file.txt')).toBe('file.txt');
      expect(getDirectoryFromPath('/path/to/file.txt')).toBe('/path/to');
      expect(joinPaths('api', 'users', 'profile')).toBe('api/users/profile');
      expect(joinPaths('/api/', '/users/', '/profile')).toBe('/api/users/profile');
    });
  });

  describe('Performance and Debouncing Utilities', () => {
    test('debounce function', (done) => {
      const debounce = <T extends (...args: any[]) => any>(
        func: T,
        wait: number
      ): T => {
        let timeout: NodeJS.Timeout;
        return ((...args: any[]) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(null, args), wait);
        }) as T;
      };

      let callCount = 0;
      const increment = () => callCount++;
      const debouncedIncrement = debounce(increment, 100);

      // Call multiple times rapidly
      debouncedIncrement();
      debouncedIncrement();
      debouncedIncrement();

      // Should only be called once after delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });

    test('throttle function', (done) => {
      const throttle = <T extends (...args: any[]) => any>(
        func: T,
        limit: number
      ): T => {
        let inThrottle: boolean;
        return ((...args: any[]) => {
          if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        }) as T;
      };

      let callCount = 0;
      const increment = () => callCount++;
      const throttledIncrement = throttle(increment, 100);

      // Call multiple times rapidly
      throttledIncrement(); // Should execute
      throttledIncrement(); // Should be throttled
      throttledIncrement(); // Should be throttled

      expect(callCount).toBe(1);

      // Should allow another call after throttle period
      setTimeout(() => {
        throttledIncrement();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });

    test('memoization function', () => {
      const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
        const cache = new Map();
        return ((...args: any[]) => {
          const key = JSON.stringify(args);
          if (cache.has(key)) {
            return cache.get(key);
          }
          const result = fn(...args);
          cache.set(key, result);
          return result;
        }) as T;
      };

      let computeCount = 0;
      const expensiveComputation = (n: number) => {
        computeCount++;
        return n * n;
      };

      const memoizedComputation = memoize(expensiveComputation);

      expect(memoizedComputation(5)).toBe(25);
      expect(computeCount).toBe(1);

      // Second call should use cache
      expect(memoizedComputation(5)).toBe(25);
      expect(computeCount).toBe(1); // Still 1, not 2

      // Different argument should compute
      expect(memoizedComputation(6)).toBe(36);
      expect(computeCount).toBe(2);
    });
  });

  describe('Error Handling Utilities', () => {
    test('safe function execution', () => {
      const safeExecute = <T>(fn: () => T, fallback: T): T => {
        try {
          return fn();
        } catch {
          return fallback;
        }
      };

      const throwingFunction = () => {
        throw new Error('Test error');
      };
      const workingFunction = () => 'success';

      expect(safeExecute(throwingFunction, 'fallback')).toBe('fallback');
      expect(safeExecute(workingFunction, 'fallback')).toBe('success');
    });

    test('retry mechanism', async () => {
      const retry = async <T>(
        fn: () => Promise<T>,
        attempts: number,
        delay: number = 0
      ): Promise<T> => {
        try {
          return await fn();
        } catch (error) {
          if (attempts <= 1) throw error;
          if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
          return retry(fn, attempts - 1, delay);
        }
      };

      let attemptCount = 0;
      const flakyFunction = async () => {
        attemptCount++;
        if (attemptCount < 3) throw new Error('Flaky error');
        return 'success';
      };

      const result = await retry(flakyFunction, 3);
      expect(result).toBe('success');
      expect(attemptCount).toBe(3);
    });

    test('error categorization', () => {
      const categorizeError = (error: Error) => {
        if (error.message.includes('network')) return 'network';
        if (error.message.includes('auth')) return 'authentication';
        if (error.message.includes('permission')) return 'authorization';
        if (error.message.includes('validation')) return 'validation';
        return 'unknown';
      };

      expect(categorizeError(new Error('network timeout'))).toBe('network');
      expect(categorizeError(new Error('auth failed'))).toBe('authentication');
      expect(categorizeError(new Error('permission denied'))).toBe('authorization');
      expect(categorizeError(new Error('validation error'))).toBe('validation');
      expect(categorizeError(new Error('random error'))).toBe('unknown');
    });
  });

  describe('Browser and Environment Utilities', () => {
    test('environment detection', () => {
      const isClient = () => typeof window !== 'undefined';
      const isServer = () => typeof window === 'undefined';
      const isDevelopment = () => process.env.NODE_ENV === 'development';
      const isProduction = () => process.env.NODE_ENV === 'production';

      // These tests depend on the test environment
      expect(typeof isClient()).toBe('boolean');
      expect(typeof isServer()).toBe('boolean');
      expect(typeof isDevelopment()).toBe('boolean');
      expect(typeof isProduction()).toBe('boolean');
    });

    test('storage utilities', () => {
      const mockStorage = () => {
        const store: Record<string, string> = {};
        return {
          getItem: (key: string) => store[key] || null,
          setItem: (key: string, value: string) => { store[key] = value; },
          removeItem: (key: string) => delete store[key],
          clear: () => Object.keys(store).forEach(key => delete store[key])
        };
      };

      const storage = mockStorage();
      
      storage.setItem('test', 'value');
      expect(storage.getItem('test')).toBe('value');
      
      storage.removeItem('test');
      expect(storage.getItem('test')).toBeNull();
    });

    test('URL manipulation utilities', () => {
      const addQueryParam = (url: string, key: string, value: string) => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${key}=${encodeURIComponent(value)}`;
      };

      const removeQueryParam = (url: string, key: string) => {
        const [base, query] = url.split('?');
        if (!query) return url;
        
        const params = new URLSearchParams(query);
        params.delete(key);
        
        const newQuery = params.toString();
        return newQuery ? `${base}?${newQuery}` : base;
      };

      expect(addQueryParam('https://example.com', 'foo', 'bar'))
        .toBe('https://example.com?foo=bar');
      
      expect(addQueryParam('https://example.com?existing=value', 'foo', 'bar'))
        .toBe('https://example.com?existing=value&foo=bar');

      expect(removeQueryParam('https://example.com?foo=bar&baz=qux', 'foo'))
        .toBe('https://example.com?baz=qux');
    });
  });
});