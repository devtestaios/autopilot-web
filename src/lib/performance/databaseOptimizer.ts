'use client';

import { supabase } from '@/lib/supabase';
import { optimizedAPI } from './optimizedAPI';
import { cacheUtils } from './simpleCacheUtils';

/**
 * DATABASE QUERY OPTIMIZATION LAYER
 * Following COMPREHENSIVE_PROJECT_ANALYSIS_OCTOBER_2025.md - Performance Considerations
 * 
 * Advanced database optimization with intelligent query optimization,
 * connection pooling, real-time subscriptions, and performance monitoring.
 */

interface QueryOptions {
  useCache?: boolean;
  cacheKey?: string;
  cacheTags?: string[];
  timeout?: number;
  retryCount?: number;
  priority?: 'low' | 'normal' | 'high';
  realtime?: boolean;
}

interface QueryPerformanceMetrics {
  queryTime: number;
  cacheHit: boolean;
  rowsReturned: number;
  queryComplexity: 'simple' | 'medium' | 'complex';
  optimizationSuggestions: string[];
}

class DatabaseOptimizer {
  private queryMetrics: Map<string, QueryPerformanceMetrics[]> = new Map();
  private activeSubscriptions: Map<string, any> = new Map();
  private connectionPool = {
    active: 0,
    total: 0,
    maxConnections: 10
  };

  constructor(private supabase: any) {}

  /**
   * Optimized query execution with intelligent caching
   */
  async executeQuery<T>(
    query: string,
    params: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }> {
    const startTime = performance.now();
    const queryKey = options.cacheKey || this.generateQueryKey(query, params);
    
    // Check cache first if enabled
    if (options.useCache !== false) {
      const cached = cacheUtils.get(queryKey);
      if (cached) {
        const metrics: QueryPerformanceMetrics = {
          queryTime: performance.now() - startTime,
          cacheHit: true,
          rowsReturned: Array.isArray(cached) ? cached.length : 1,
          queryComplexity: this.analyzeQueryComplexity(query),
          optimizationSuggestions: []
        };
        
        this.recordQueryMetrics(queryKey, metrics);
        return { data: cached, error: null, metrics };
      }
    }

    try {
      // Execute optimized query
      const { data, error } = await this.executeOptimizedQuery(query, params, options);
      
      const queryTime = performance.now() - startTime;
      const metrics: QueryPerformanceMetrics = {
        queryTime,
        cacheHit: false,
        rowsReturned: Array.isArray(data) ? data.length : data ? 1 : 0,
        queryComplexity: this.analyzeQueryComplexity(query),
        optimizationSuggestions: this.generateOptimizationSuggestions(query, queryTime)
      };

      // Cache successful results
      if (!error && data && options.useCache !== false) {
        cacheUtils.set(queryKey, data, {
          ttl: 300000, // 5 minutes default
          tags: options.cacheTags || [this.extractTableName(query)],
          staleWhileRevalidate: true
        });
      }

      this.recordQueryMetrics(queryKey, metrics);
      return { data, error, metrics };

    } catch (error: any) {
      const metrics: QueryPerformanceMetrics = {
        queryTime: performance.now() - startTime,
        cacheHit: false,
        rowsReturned: 0,
        queryComplexity: this.analyzeQueryComplexity(query),
        optimizationSuggestions: ['Add error handling', 'Check query syntax']
      };

      this.recordQueryMetrics(queryKey, metrics);
      return { data: null, error, metrics };
    }
  }

  /**
   * Optimized batch query execution
   */
  async executeBatch<T>(
    queries: Array<{
      query: string;
      params?: Record<string, any>;
      options?: QueryOptions;
    }>
  ): Promise<Array<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }>> {
    // Group queries by priority
    const priorityGroups = {
      high: queries.filter(q => q.options?.priority === 'high'),
      normal: queries.filter(q => q.options?.priority !== 'high' && q.options?.priority !== 'low'),
      low: queries.filter(q => q.options?.priority === 'low')
    };

    const results: Array<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }> = [];

    // Execute high priority queries first
    for (const group of [priorityGroups.high, priorityGroups.normal, priorityGroups.low]) {
      if (group.length === 0) continue;

      // Batch similar queries together
      const batches = this.groupSimilarQueries(group);
      
      for (const batch of batches) {
        const batchResults = await Promise.all(
          batch.map(({ query, params = {}, options = {} }) =>
            this.executeQuery<T>(query, params, options)
          )
        );
        results.push(...batchResults);
      }
    }

    return results;
  }

  /**
   * Real-time subscription with optimization
   */
  subscribeToChanges<T>(
    table: string,
    filter?: string,
    callback?: (payload: T) => void,
    options: QueryOptions = {}
  ): string {
    const subscriptionId = `${table}_${Date.now()}_${Math.random()}`;
    
    try {
      let subscription = this.supabase
        .channel(subscriptionId)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter
        }, (payload: any) => {
          // Invalidate cache for this table
          cacheUtils.invalidateByTag(table);
          
          // Call user callback
          if (callback) {
            callback(payload);
          }
          
          // Update real-time metrics
          this.updateRealtimeMetrics(table, payload);
        })
        .subscribe();

      this.activeSubscriptions.set(subscriptionId, subscription);
      return subscriptionId;

    } catch (error) {
      console.error('Failed to create subscription:', error);
      return '';
    }
  }

  /**
   * Unsubscribe from real-time changes
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.activeSubscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
    }
  }

  /**
   * Get query performance insights
   */
  getQueryInsights(): {
    totalQueries: number;
    averageQueryTime: number;
    cacheHitRate: number;
    slowestQueries: Array<{ query: string; avgTime: number; suggestions: string[] }>;
    mostFrequentQueries: Array<{ query: string; count: number; performance: number }>;
  } {
    const allMetrics = Array.from(this.queryMetrics.values()).flat();
    
    if (allMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageQueryTime: 0,
        cacheHitRate: 0,
        slowestQueries: [],
        mostFrequentQueries: []
      };
    }

    const totalQueries = allMetrics.length;
    const averageQueryTime = allMetrics.reduce((sum, m) => sum + m.queryTime, 0) / totalQueries;
    const cacheHitRate = (allMetrics.filter(m => m.cacheHit).length / totalQueries) * 100;

    // Find slowest queries
    const queryTimes = new Map<string, { times: number[]; suggestions: Set<string> }>();
    this.queryMetrics.forEach((metrics, query) => {
      const times = metrics.map(m => m.queryTime);
      const suggestions = new Set(metrics.flatMap(m => m.optimizationSuggestions));
      queryTimes.set(query, { times, suggestions });
    });

    const slowestQueries = Array.from(queryTimes.entries())
      .map(([query, { times, suggestions }]) => ({
        query: query.substring(0, 50) + '...',
        avgTime: times.reduce((sum, t) => sum + t, 0) / times.length,
        suggestions: Array.from(suggestions)
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);

    // Find most frequent queries
    const mostFrequentQueries = Array.from(this.queryMetrics.entries())
      .map(([query, metrics]) => ({
        query: query.substring(0, 50) + '...',
        count: metrics.length,
        performance: metrics.reduce((sum, m) => sum + m.queryTime, 0) / metrics.length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalQueries,
      averageQueryTime,
      cacheHitRate,
      slowestQueries,
      mostFrequentQueries
    };
  }

  /**
   * Get connection pool stats
   */
  getConnectionStats() {
    return {
      ...this.connectionPool,
      activeSubscriptions: this.activeSubscriptions.size,
      efficiency: this.connectionPool.total > 0 ? 
        (this.connectionPool.active / this.connectionPool.total) * 100 : 0
    };
  }

  /**
   * Optimize database indexes suggestions
   */
  getIndexOptimizationSuggestions(): Array<{
    table: string;
    column: string;
    reason: string;
    impact: 'high' | 'medium' | 'low';
    sql: string;
  }> {
    const suggestions: Array<{
      table: string;
      column: string;
      reason: string;
      impact: 'high' | 'medium' | 'low';
      sql: string;
    }> = [];

    // Analyze query patterns for index suggestions
    this.queryMetrics.forEach((metrics, query) => {
      const avgTime = metrics.reduce((sum, m) => sum + m.queryTime, 0) / metrics.length;
      
      if (avgTime > 100) { // Slow queries
        const table = this.extractTableName(query);
        const columns = this.extractFilterColumns(query);
        
        columns.forEach(column => {
          suggestions.push({
            table,
            column,
            reason: `Frequent filtering on ${column} with avg query time ${avgTime.toFixed(2)}ms`,
            impact: avgTime > 500 ? 'high' : avgTime > 200 ? 'medium' : 'low',
            sql: `CREATE INDEX IF NOT EXISTS idx_${table}_${column} ON ${table} (${column});`
          });
        });
      }
    });

    return suggestions.slice(0, 10); // Top 10 suggestions
  }

  // Private helper methods
  private generateQueryKey(query: string, params: Record<string, any>): string {
    return `query_${btoa(query + JSON.stringify(params)).substring(0, 16)}`;
  }

  private analyzeQueryComplexity(query: string): 'simple' | 'medium' | 'complex' {
    const joinCount = (query.match(/JOIN/gi) || []).length;
    const subqueryCount = (query.match(/\(SELECT/gi) || []).length;
    const aggregateCount = (query.match(/(COUNT|SUM|AVG|MAX|MIN)/gi) || []).length;
    
    const complexity = joinCount + subqueryCount * 2 + aggregateCount;
    
    if (complexity === 0) return 'simple';
    if (complexity <= 3) return 'medium';
    return 'complex';
  }

  private generateOptimizationSuggestions(query: string, queryTime: number): string[] {
    const suggestions: string[] = [];
    
    if (queryTime > 100) {
      suggestions.push('Consider adding appropriate indexes');
    }
    
    if (queryTime > 500) {
      suggestions.push('Query is very slow - review query structure');
    }
    
    if (query.includes('SELECT *')) {
      suggestions.push('Avoid SELECT * - specify only needed columns');
    }
    
    if ((query.match(/JOIN/gi) || []).length > 3) {
      suggestions.push('Consider breaking down complex joins');
    }
    
    return suggestions;
  }

  private extractTableName(query: string): string {
    const match = query.match(/FROM\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }

  private extractFilterColumns(query: string): string[] {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
    if (!whereMatch) return [];
    
    const whereClause = whereMatch[1];
    const columnMatches = whereClause.match(/(\w+)\s*[=<>]/g);
    
    return columnMatches ? columnMatches.map(m => m.replace(/\s*[=<>].*/, '')) : [];
  }

  private recordQueryMetrics(queryKey: string, metrics: QueryPerformanceMetrics): void {
    if (!this.queryMetrics.has(queryKey)) {
      this.queryMetrics.set(queryKey, []);
    }
    
    const queryMetrics = this.queryMetrics.get(queryKey)!;
    queryMetrics.push(metrics);
    
    // Keep only last 100 metrics per query
    if (queryMetrics.length > 100) {
      queryMetrics.splice(0, queryMetrics.length - 100);
    }
  }

  private groupSimilarQueries(queries: Array<any>): Array<Array<any>> {
    // Simple grouping - could be enhanced with more sophisticated clustering
    const groups = new Map<string, Array<any>>();
    
    queries.forEach(query => {
      const table = this.extractTableName(query.query);
      if (!groups.has(table)) {
        groups.set(table, []);
      }
      groups.get(table)!.push(query);
    });
    
    return Array.from(groups.values());
  }

  private async executeOptimizedQuery(
    query: string, 
    params: Record<string, any>, 
    options: QueryOptions
  ): Promise<{ data: any; error: any }> {
    // Use existing Supabase client with optimizations
    this.connectionPool.active++;
    this.connectionPool.total++;
    
    try {
      // Add query timeout
      const timeout = options.timeout || 30000;
      const queryPromise = this.supabase.rpc('execute_query', { 
        query_text: query, 
        params 
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeout)
      );
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      return result;
      
    } finally {
      this.connectionPool.active--;
    }
  }

  private updateRealtimeMetrics(table: string, payload: any): void {
    // Update metrics for real-time events
    // This could be enhanced with more sophisticated tracking
  }
}

// Create singleton instance
export const databaseOptimizer = new DatabaseOptimizer(supabase);

// Convenience functions for common operations
export const dbQuery = {
  /**
   * Optimized SELECT with intelligent caching
   */
  async select<T>(
    table: string,
    options: {
      select?: string;
      filter?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      useCache?: boolean;
      cacheTags?: string[];
    } = {}
  ): Promise<{ data: T[] | null; error: any; metrics: QueryPerformanceMetrics }> {
    const {
      select = '*',
      filter = {},
      orderBy,
      limit,
      useCache = true,
      cacheTags = [table]
    } = options;

    let query = `SELECT ${select} FROM ${table}`;
    
    // Add WHERE clause
    const whereConditions = Object.entries(filter).map(([key, value]) => `${key} = '${value}'`);
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Add ORDER BY
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    
    // Add LIMIT
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return databaseOptimizer.executeQuery<T[]>(query, filter, {
      useCache,
      cacheTags,
      cacheKey: `select_${table}_${JSON.stringify(options)}`
    });
  },

  /**
   * Optimized INSERT with cache invalidation
   */
  async insert<T>(
    table: string,
    data: Record<string, any> | Record<string, any>[],
    options: {
      returning?: string;
      onConflict?: string;
    } = {}
  ): Promise<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }> {
    const { returning = '*', onConflict } = options;
    
    const isArray = Array.isArray(data);
    const insertData = isArray ? data : [data];
    
    let query = `INSERT INTO ${table} (${Object.keys(insertData[0]).join(', ')}) VALUES `;
    
    const values = insertData.map(item => 
      `(${Object.values(item).map(v => `'${v}'`).join(', ')})`
    ).join(', ');
    
    query += values;
    
    if (onConflict) {
      query += ` ON CONFLICT ${onConflict}`;
    }
    
    if (returning) {
      query += ` RETURNING ${returning}`;
    }

    const result = await databaseOptimizer.executeQuery<T>(query, {}, {
      useCache: false,
      cacheTags: [table]
    });

    // Invalidate cache for this table
    if (!result.error) {
      cacheUtils.invalidateByTag(table);
    }

    return result;
  },

  /**
   * Optimized UPDATE with cache invalidation
   */
  async update<T>(
    table: string,
    updates: Record<string, any>,
    filter: Record<string, any>,
    options: {
      returning?: string;
    } = {}
  ): Promise<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }> {
    const { returning = '*' } = options;
    
    const setClause = Object.entries(updates)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');
    
    const whereClause = Object.entries(filter)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING ${returning}`;

    const result = await databaseOptimizer.executeQuery<T>(query, { ...updates, ...filter }, {
      useCache: false,
      cacheTags: [table]
    });

    // Invalidate cache for this table
    if (!result.error) {
      cacheUtils.invalidateByTag(table);
    }

    return result;
  },

  /**
   * Optimized DELETE with cache invalidation
   */
  async delete<T>(
    table: string,
    filter: Record<string, any>,
    options: {
      returning?: string;
    } = {}
  ): Promise<{ data: T | null; error: any; metrics: QueryPerformanceMetrics }> {
    const { returning } = options;
    
    const whereClause = Object.entries(filter)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    
    let query = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    if (returning) {
      query += ` RETURNING ${returning}`;
    }

    const result = await databaseOptimizer.executeQuery<T>(query, filter, {
      useCache: false,
      cacheTags: [table]
    });

    // Invalidate cache for this table
    if (!result.error) {
      cacheUtils.invalidateByTag(table);
    }

    return result;
  }
};

// Real-time subscription helpers
export const realtimeSubscriptions = {
  /**
   * Subscribe to table changes with optimization
   */
  subscribeToTable<T>(
    table: string,
    callback: (payload: T) => void,
    filter?: string
  ): string {
    return databaseOptimizer.subscribeToChanges(table, filter, callback);
  },

  /**
   * Unsubscribe from table changes
   */
  unsubscribe(subscriptionId: string): void {
    databaseOptimizer.unsubscribe(subscriptionId);
  },

  /**
   * Get active subscriptions count
   */
  getActiveCount(): number {
    return databaseOptimizer.getConnectionStats().activeSubscriptions;
  }
};

export { databaseOptimizer, type QueryOptions, type QueryPerformanceMetrics };