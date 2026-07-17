import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/forgot-password'],
        disallow: ['/home', '/orders', '/doctor', '/blood-sos', '/profile', '/wallet', '/referral', '/subscription', '/notifications', '/api/'],
      },
    ],
    sitemap: 'https://flashmed.in/sitemap.xml',
    host: 'https://flashmed.in',
  };
}
