import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://flashmed.in';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/forgot-password`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/rider-privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/delete-account`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
