import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Do not fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
