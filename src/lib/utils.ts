import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  if (value === null || value === undefined) {
    return '0';
  }
  
  if (isNaN(value)) {
    return 'NaN';
  }
  
  if (value === Infinity) {
    return 'Infinity';
  }
  
  if (value === -Infinity) {
    return '-Infinity';
  }
  
  // Handle very small numbers with proper precision
  if (Math.abs(value) < 0.000001 && value !== 0) {
    return value.toFixed(7);
  }
  
  // Format numbers with appropriate precision
  if (Math.abs(value) < 1) {
    return value.toString();
  }
  
  // For larger numbers, use standard formatting
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  
  return value.toString();
}

export function formatPercentage(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  // Convert to percentage and format
  const percentage = value * 100;
  
  if (Math.abs(percentage) < 0.01 && percentage !== 0) {
    return percentage.toFixed(5) + '%';
  }
  
  if (Math.abs(percentage) < 1) {
    return percentage.toFixed(2) + '%';
  }
  
  return percentage.toFixed(1) + '%';
}

// Currency formatting
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value as number)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// Date formatting
export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);
  return `${startFormatted} - ${endFormatted}`;
}

// Calculation functions
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

export function calculateCTR(clicks: number | null | undefined, impressions: number): number {
  if (!clicks || !impressions || impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

export function calculateCPC(cost: number, clicks: number | null | undefined): number {
  if (!clicks || clicks === 0 || !cost) return 0;
  return cost / clicks;
}

export function calculateCPM(cost: number, impressions: number): number {
  if (!impressions || impressions === 0 || !cost) return 0;
  return (cost / impressions) * 1000;
}

export function calculateROAS(revenue: number, cost: number): number {
  if (!cost || cost === 0) return 0;
  return revenue / cost;
}

// Validation functions
export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d\s\-\.\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/[\s\-\.\(\)]/g, ''));
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// String utilities
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string | null | undefined, length: number): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Function utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Object utilities
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy: any = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
}

export function mergeObjects<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  return { ...target, ...source };
}

export function isEmptyObject(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj).length === 0;
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(arrays: T[][]): T[] {
  return arrays.reduce((flat, arr) => flat.concat(arr), []);
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// URL utilities
export function parseQueryParams(queryString: string): Record<string, string> {
  if (!queryString || queryString === '?') return {};
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(queryString);
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function buildQueryString(params: Record<string, any>): string {
  if (isEmptyObject(params)) return '';
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      urlParams.append(key, String(value));
    }
  });
  return urlParams.toString();
}