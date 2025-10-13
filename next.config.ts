import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static export to prevent SSR issues with theme context
  output: undefined,
  trailingSlash: false,
  
  // Optimize build performance for local development
  productionBrowserSourceMaps: false,
  
  // Performance optimizations for slow filesystems
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
    // Enhanced performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'framer-motion'
    ],
  },
  
  // Turbopack configuration (Next.js 15.5.2+)
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$'],
    } : false,
  },
  
  // Advanced bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, 'src'),
      };
      
      // Filesystem performance optimizations
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/backend/**',
          '**/.next/**',
          '**/dist/**',
          '**/*.log',
          '**/coverage/**',
          '**/e2e/**',
          '**/playwright-report/**',
          '**/test-results/**'
        ],
        aggregateTimeout: 200,
        poll: false, // Disable polling to reduce filesystem load
      };
      
      // Enhanced bundle optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for external libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate chunk for heavy libraries
            framerMotion: {
              name: 'framer-motion',
              chunks: 'all',
              test: /node_modules\/framer-motion/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Icons chunk
            icons: {
              name: 'icons',
              chunks: 'all',
              test: /node_modules\/lucide-react/,
              priority: 25,
              reuseExistingChunk: true,
            },
          },
        },
        // Enhanced tree shaking
        usedExports: true,
        providedExports: true,
        sideEffects: false,
      };

      // Tree shaking enhancements
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              ['import', { libraryName: '@radix-ui/react-icons', libraryDirectory: 'dist', camel2DashComponentName: false }, 'radix-icons']
            ]
          }
        }
      });
    }
    return config;
  },
  
  // Enhanced headers for performance and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
