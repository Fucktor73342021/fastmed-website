import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Explicitly allow all public content pages so Googlebot indexes them
        allow: [
          '/',
          '/articles',
          '/articles/*',
          '/vlogs',
          '/vlogs/*',
          '/faqs',
          '/faqs/*',
          '/login',
          '/register',
          '/forgot-password',
          '/privacy-policy',
          '/terms-and-conditions',
          '/refund-policy',
          '/rider-privacy-policy',
          '/delete-account',
        ],
        // Block authenticated/private pages only
        disallow: [
          '/home',
          '/orders',
          '/doctor',
          '/blood-sos',
          '/profile',
          '/wallet',
          '/referral',
          '/subscription',
          '/notifications',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://flashmed.in/sitemap.xml',
    host: 'https://flashmed.in',
  };
}
