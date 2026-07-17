import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.flashmed.in' },
      { protocol: 'https', hostname: 'flashmed.in' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: '*.tile.openstreetmap.org' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: false,
  },

  // Logging
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === 'development' },
  },

  // Experimental
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['firebase', 'leaflet', 'react-leaflet'],
  },

  // Headers applied at the framework layer (middleware does this for dynamic, but this covers static assets)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Long cache for static assets
        source: '/(_next/static|icons|fonts)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Rewrites: expose api.flashmed.in through /api/proxy/* (our route handlers handle this)
  // Redirect www to apex
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'www.flashmed.in' }],
        destination: 'https://flashmed.in/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
