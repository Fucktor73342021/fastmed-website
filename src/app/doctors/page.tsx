/**
 * /doctors — Public Doctor Discovery Listing Page
 * ═══════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 *   SEO landing page listing all active FlashMed doctors.
 *   Google crawls this page → discovers all /doctors/[id] profile links.
 *   Each card links to the individual doctor's SEO profile page.
 *
 * ARCHITECTURE:
 *   - Server Component (no 'use client') — full SSR on every request
 *   - ISR: revalidate = 300 (5 min) — stays fresh without hammering backend
 *   - Fetches from backend via BACKEND_URL env var (server-side, no CORS)
 *   - JSON-LD ItemList schema — enables Google Rich Results for the listing
 *   - Canonical URL set to flashmed.in/doctors
 *
 * SCALABILITY:
 *   - Vercel Edge CDN caches rendered HTML — millions of req/s supported
 *   - ISR means backend is hit at most once per 5 min per region
 *   - Individual doctor pages have their own ISR (60s)
 *
 * ZERO HARM:
 *   - New file only — no existing file modified
 *   - Uses existing BACKEND_URL pattern (same as faqs/articles pages)
 *   - Does NOT use Firebase or auth — fully public
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 300; // ISR: refresh at most every 5 minutes

const BACKEND = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
const BASE_URL = 'https://flashmed.in';

export const metadata: Metadata = {
  title: 'Find Doctors — Book Doctor Appointments Online',
  description:
    'Find and book trusted doctors near you on FlashMed. Browse General Physicians, Specialists, Dermatologists, and more. Instant appointment booking via the FlashMed app.',
  alternates: { canonical: `${BASE_URL}/doctors` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Find Doctors — FlashMed',
    description: 'Browse and book verified doctors. Instant appointments via FlashMed.',
    url: `${BASE_URL}/doctors`,
    siteName: 'FlashMed',
    type: 'website',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Doctor {
  id: string;
  name: string;
  specialty: string | null;
  clinicName: string | null;
  available: boolean;
  rating: number | null;
  ratingCount?: number;
  qualifications?: string | null;
  experience?: number | null;
  consultationFee?: number | null;
  bookingMode?: string;
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${BACKEND}/api/doctors`, {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json', 'X-Forwarded-From': 'flashmed-web' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.doctors) ? json.doctors : [];
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

const SPECIALTY_COLORS: Record<string, string> = {
  'General Physician': '#10b981',
  'Cardiologist':      '#ef4444',
  'Dermatologist':     '#8b5cf6',
  'Pediatrician':      '#f59e0b',
  'Orthopedic':        '#3b82f6',
  'Neurologist':       '#6366f1',
  'Gynecologist':      '#ec4899',
  'Dentist':           '#14b8a6',
  'Psychiatrist':      '#a855f7',
  'ENT Specialist':    '#f97316',
  'Ophthalmologist':   '#06b6d4',
  'default':           '#1a6bcc',
};

function specialtyColor(specialty: string | null): string {
  if (!specialty) return SPECIALTY_COLORS.default;
  return SPECIALTY_COLORS[specialty] ?? SPECIALTY_COLORS.default;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DoctorsListingPage() {
  const doctors = await fetchDoctors();

  // JSON-LD: ItemList schema for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FlashMed Doctors',
    description: 'Verified doctors available for appointment booking on FlashMed.',
    url: `${BASE_URL}/doctors`,
    numberOfItems: doctors.length,
    itemListElement: doctors.slice(0, 50).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/doctors/${d.id}`,
      name: `Dr. ${d.name}${d.specialty ? ` — ${d.specialty}` : ''}`,
    })),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,15,26,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1a6bcc, #145bb3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>FlashMed</span>
          </Link>
          <nav style={{ display: 'flex', gap: 24 }}>
            <Link href="/articles" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Articles</Link>
            <Link href="/faqs" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>FAQs</Link>
            <Link href="/doctors" style={{ color: '#10b981', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Find Doctors</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: '64px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
          👨‍⚕️ Find Doctors
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
          Trusted Doctors, Instant Booking
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 560, margin: '0 auto 8px' }}>
          Browse verified doctors across specialties. Book appointments instantly through the FlashMed app.
        </p>
        {doctors.length > 0 && (
          <p style={{ color: '#64748b', fontSize: 14, margin: '8px auto 0' }}>
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {/* ── Doctor Grid ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {doctors.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍⚕️</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>No doctors listed yet</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Check back soon — we're onboarding doctors every day.</p>
          </div>
        ) : (
          <>
            {/* JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}>
              {doctors.map((doctor) => {
                const color = specialtyColor(doctor.specialty);
                const initials = getInitials(doctor.name);
                return (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <article style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      borderTop: `3px solid ${color}`,
                    }}>
                      {/* Avatar + Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14,
                          background: `${color}22`,
                          border: `2px solid ${color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 900, color, flexShrink: 0,
                        }}>
                          {initials}
                        </div>
                        <div>
                          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                            Dr. {doctor.name}
                          </h2>
                          {doctor.specialty && (
                            <p style={{ fontSize: 13, color, fontWeight: 600, margin: '3px 0 0' }}>
                              {doctor.specialty}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Clinic */}
                      {doctor.clinicName && (
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span>🏥</span> {doctor.clinicName}
                        </p>
                      )}

                      {/* Footer row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: doctor.available ? '#10b981' : '#64748b',
                          background: doctor.available ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                          padding: '3px 10px', borderRadius: 100,
                        }}>
                          {doctor.available ? '✓ Available' : 'Unavailable'}
                        </span>
                        {doctor.rating != null && Number(doctor.rating) > 0 && (
                          <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
                            ★ {Number(doctor.rating).toFixed(1)}
                          </span>
                        )}
                        <span style={{ fontSize: 13, color: '#1a6bcc', fontWeight: 700 }}>
                          View Profile →
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>© {new Date().getFullYear()} FlashMed. All rights reserved. | <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link></p>
      </footer>
    </div>
  );
}
