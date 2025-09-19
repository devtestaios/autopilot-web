import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static export to prevent SSR issues with theme context
  output: undefined,
  trailingSlash: false,
};

export default nextConfig;
