import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Doctors, Pharmacies & Clinics Near You — FlashMed',
  description:
    'Search doctors by specialty, find verified pharmacies, book clinics, discover labs and hospitals near you. View full profiles and book instantly on FlashMed.',
  keywords: [
    'find doctor near me', 'book doctor online', 'pharmacy near me',
    'clinic booking', 'diagnostic lab', 'hospital', 'FlashMed',
  ],
  openGraph: {
    title: 'Find Healthcare Providers — FlashMed',
    description: 'Search & book doctors, pharmacies, clinics, labs and hospitals near you.',
    url: 'https://flashmed.in/search',
    siteName: 'FlashMed',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flashmed.in/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
