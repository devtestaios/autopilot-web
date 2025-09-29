// Performance Analysis Configuration
// Following ADVANCED_CODING_AI_DISSERTATION.md patterns for systematic optimization

import type { NextConfig } from 'next';

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Performance monitoring utilities
export interface PerformanceMetrics {
  bundleSize: number;
  initialLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  providerRenderTime: number;
}

export interface OptimizationTarget {
  metric: keyof PerformanceMetrics;
  currentValue: number;
  targetValue: number;
  priority: 'high' | 'medium' | 'low';
  risk: 'high' | 'medium' | 'low';
}

// Systematic optimization tracking
export const OPTIMIZATION_TARGETS: OptimizationTarget[] = [
  {
    metric: 'bundleSize',
    currentValue: 0, // To be measured
    targetValue: 500000, // 500KB target
    priority: 'high',
    risk: 'low'
  },
  {
    metric: 'firstContentfulPaint',
    currentValue: 0,
    targetValue: 1500, // 1.5s target
    priority: 'high', 
    risk: 'low'
  },
  {
    metric: 'providerRenderTime',
    currentValue: 0,
    targetValue: 50, // 50ms target
    priority: 'medium',
    risk: 'medium'
  }
];

// Enhanced next.config following dissertation patterns
const performanceConfig: NextConfig = {
  // Systematic bundle optimization
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    // Enable bundle analyzer
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new webpack.BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: `bundle-analysis-${isServer ? 'server' : 'client'}.html`
        })
      );
    }

    // Advanced chunk splitting following dissertation
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate vendor bundles
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true
          },
          // Separate UI components
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            enforce: true
          },
          // Separate context providers
          contexts: {
            test: /[\\/]src[\\/]contexts[\\/]/,
            name: 'contexts',
            chunks: 'all',
            enforce: true
          }
        }
      };
    }

    return config;
  },
  
  // Optimized package imports
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion', 
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      'recharts'
    ]
  }
};

export default withBundleAnalyzer(performanceConfig);