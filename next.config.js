/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features with safer options
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    outputFileTracingRoot: undefined,
    // Disable features that might be causing build issues
    optimizeCss: false,
    swcMinify: true
  },

  // Configure headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.youtube.com https://*.twitch.tv https://s3.tradingview.com",
              "frame-src 'self' https://*.youtube.com https://*.twitch.tv https://www.okx.com",
              "img-src 'self' blob: data: https://*.ytimg.com https://*.twitch.tv https://*.jtvnw.net https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
              "media-src 'self' https://*.youtube.com https://*.twitch.tv",
              "connect-src 'self' https://*.youtube.com https://*.twitch.tv https://api.openai.com",
              "style-src 'self' 'unsafe-inline'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },

  // Configure redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },

  // Configure image domains
  images: {
    domains: ["images.unsplash.com", "hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },

  // Remove the standalone output setting to avoid symlink issues
  poweredByHeader: false,
}

module.exports = nextConfig

