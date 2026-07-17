import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const APP_URL = 'https://flashmed.in';

export const viewport: Viewport = {
  themeColor: '#059669',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'FlashMed — Medicines Delivered in 10 Minutes',
    template: '%s | FlashMed',
  },
  description:
    'Order medicines online with 10-minute delivery from verified local pharmacies. Book lab tests at home, consult doctors online, and find blood donors instantly.',
  keywords: [
    'medicine delivery', 'online pharmacy', 'lab test booking', 'doctor consultation',
    'blood bank', 'medicine home delivery', 'online medicine order', 'healthcare app',
    'pharmacy near me', 'FlashMed',
  ],
  authors: [{ name: 'FlashMed', url: APP_URL }],
  creator: 'FlashMed',
  publisher: 'FlashMed',
  applicationName: 'FlashMed',
  category: 'Healthcare',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'FlashMed',
    title: 'FlashMed — Medicines Delivered in 10 Minutes',
    description: 'Order medicines, book lab tests, consult doctors. Delivered to your door in 10-40 minutes from verified local pharmacies.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FlashMed — Healthcare Fast' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashMed — Medicines in 10 Minutes',
    description: 'Order medicines & healthcare essentials delivered to your door in 10-40 minutes.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  alternates: { canonical: APP_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.flashmed.in" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
