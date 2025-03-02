/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.youtube.com https://*.twitch.tv",
              "frame-src 'self' https://*.youtube.com https://*.twitch.tv",
              "img-src 'self' blob: data: https://*.ytimg.com https://*.twitch.tv https://*.jtvnw.net",
              "media-src 'self' https://*.youtube.com https://*.twitch.tv",
              "connect-src 'self' https://*.youtube.com https://*.twitch.tv",
              "style-src 'self' 'unsafe-inline'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

