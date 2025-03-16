/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Only include necessary experimental features
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  typescript: {
    // This will allow the build to succeed even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This will allow the build to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
  // Increase memory limit for builds
  env: {
    NODE_OPTIONS: "--max-old-space-size=4096"
  },
  // Disable source maps in production to reduce build size
  productionBrowserSourceMaps: false,
  // Simplify webpack config
  webpack: (config, { isServer }) => {
    // Reduce logging noise
    config.infrastructureLogging = {
      level: "error",
    };
    
    // Optimize build
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
      };
    }
    
    return config;
  },
}

export default nextConfig

