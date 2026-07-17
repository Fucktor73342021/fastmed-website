import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FlashMed — Medicines in 10 Minutes',
    short_name: 'FlashMed',
    description: 'Order medicines, book lab tests, consult doctors online. 10-minute delivery in your city.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#059669',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    categories: ['health', 'medical', 'shopping'],
    lang: 'en-IN',
    dir: 'ltr',
  };
}
