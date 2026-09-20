/**
 * /doctors/[id] — Individual Doctor SEO Profile Page
 * ═══════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 *   Google-indexable profile page for each FlashMed doctor.
 *   When someone searches "Dr. Tajdar Asrar FlashMed" in Google,
 *   this page appears in results. Clicking → sees doctor info → taps
 *   "Book Now" → opens app (or Play Store if not installed).
 *
 * ARCHITECTURE:
 *   - generateMetadata(): dynamic title/description/canonical per doctor
 *   - generateStaticParams(): pre-renders top doctors at build time (ISG)
 *   - ISR revalidate=60: stale pages refresh within 60s on next request
 *   - JSON-LD Physician + MedicalClinic schema → Google Rich Results
 *   - Book Now: uses intent:// deep link (same as DeepLinkBridge)
 *     → App installed: opens DoctorProfile screen directly
 *     → App not installed: falls back to Play Store via browser_fallback_url
 *
 * DATA SOURCE:
 *   Server-to-server fetch from BACKEND_URL/api/public/profile/doctor/:id
 *   (no CORS, no Firebase, no auth needed — fully public endpoint)
 *
 * ZERO HARM:
 *   - New file only. No existing files modified.
 *   - /d/[id] deeplink page is completely separate and untouched.
 *   - Booking workflow in the mobile app is untouched.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60; // ISR: refresh at most every 60 seconds

const BACKEND = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
const BASE_URL = 'https://flashmed.in';
const PACKAGE  = 'in.flashmed.app';
const PLAY_URL = `https://play.google.com/store/apps/details?id=${PACKAGE}`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DoctorLocation {
  address: string | null;
  locality: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pinCode: string | null;
}

interface DoctorClinic {
  name: string | null;
  phone: string | null;
  isOpen: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string | null;
  specialties: string[] | null;
  clinicName: string | null;
  qualifications: string | null;
  experience: number | null;
  consultationFee: number | null;
  available: boolean;
  rating: number | null;
  ratingCount: number;
  bookingMode: string;
  amountDue: number;
  consultationMode: string | null;
  about: string | null;
  photoUrl: string | null;
  location: DoctorLocation | null;
  clinic: DoctorClinic | null;
  shareUrl: string | null;
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function fetchDoctor(id: string): Promise<Doctor | null> {
  try {
    const res = await fetch(
      `${BACKEND}/api/public/profile/doctor/${encodeURIComponent(id)}`,
      {
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json',
          'X-Forwarded-From': 'flashmed-web',
        },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.doctor) return null;
    return json.doctor as Doctor;
  } catch {
    return null;
  }
}

// Pre-render top 50 doctors at build time for instant first load
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BACKEND}/api/doctors`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json', 'X-Forwarded-From': 'flashmed-web-sitemap' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const doctors: Array<{ id: string }> = Array.isArray(json.doctors) ? json.doctors : [];
    return doctors.slice(0, 50).map((d) => ({ id: d.id }));
  } catch {
    return [];
  }
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const doctor = await fetchDoctor(id);

  if (!doctor) {
    return {
      title: 'Doctor Not Found | FlashMed',
      robots: { index: false, follow: false },
    };
  }

  const title = `Dr. ${doctor.name}${doctor.specialty ? ` — ${doctor.specialty}` : ''}`;
  const clinic = doctor.clinicName || doctor.clinic?.name || '';
  const city = doctor.location?.city || doctor.location?.district || '';
  const desc = [
    `Book an appointment with Dr. ${doctor.name}`,
    doctor.specialty ? `(${doctor.specialty})` : '',
    clinic ? `at ${clinic}` : '',
    city ? `in ${city}` : '',
    '— available on FlashMed.',
    doctor.qualifications ? `Qualifications: ${doctor.qualifications}.` : '',
  ].filter(Boolean).join(' ');

  const canonicalUrl = `${BASE_URL}/doctors/${id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      url: canonicalUrl,
      siteName: 'FlashMed',
      type: 'profile',
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function formatLocation(loc: DoctorLocation | null): string | null {
  if (!loc) return null;
  return [loc.locality, loc.city || loc.district, loc.state, loc.pinCode]
    .filter(Boolean).join(', ') || null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DoctorProfilePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate ID format before fetching
  if (!id || !/^[a-zA-Z0-9_\-]{1,128}$/.test(id)) notFound();

  const doctor = await fetchDoctor(id);
  if (!doctor) notFound();

  const initials    = getInitials(doctor.name);
  const location    = formatLocation(doctor.location);
  const clinicName  = doctor.clinicName || doctor.clinic?.name || null;
  const city        = doctor.location?.city || doctor.location?.district || '';

  // Deep link URLs
  const referrer   = encodeURIComponent(`utm_source=web&utm_medium=doctor_profile&utm_content=${id}`);
  const playUrl    = `${PLAY_URL}&referrer=${referrer}`;
  const intentPath = `d/${encodeURIComponent(id)}`;
  const intentUrl  = `intent://${intentPath}#Intent;scheme=flashmed;package=${PACKAGE};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;

  // JSON-LD: Physician + MedicalClinic schema for Google Rich Results
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${BASE_URL}/doctors/${id}`,
    name: `Dr. ${doctor.name}`,
    url: `${BASE_URL}/doctors/${id}`,
    ...(doctor.specialty ? { medicalSpecialty: doctor.specialty } : {}),
    ...(doctor.qualifications ? { qualifications: doctor.qualifications } : {}),
    ...(doctor.about ? { description: doctor.about } : {}),
    ...(doctor.rating != null && Number(doctor.rating) > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(doctor.rating).toFixed(1),
        ratingCount: doctor.ratingCount || 1,
        bestRating: '5',
      },
    } : {}),
    ...(clinicName ? {
      worksFor: {
        '@type': 'MedicalClinic',
        name: clinicName,
        ...(location ? { address: location } : {}),
      },
    } : {}),
  };

  const accent = '#1a6bcc';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,15,26,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1a6bcc, #145bb3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>FlashMed</span>
          </Link>
          <Link href="/doctors" style={{ color: '#10b981', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            ← All Doctors
          </Link>
        </div>
      </header>

      {/* ── Profile Card ── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Avatar + Name block */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20,
          padding: 32,
          marginBottom: 24,
          borderTop: `4px solid ${accent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: `${accent}22`,
              border: `2px solid ${accent}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 900, color: accent, flexShrink: 0,
            }}>
              {initials}
            </div>

            {/* Name + specialty */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: '#f1f5f9', margin: '0 0 6px', lineHeight: 1.2 }}>
                Dr. {doctor.name}
              </h1>
              {doctor.specialty && (
                <p style={{ fontSize: 15, fontWeight: 700, color: '#10b981', margin: '0 0 6px' }}>
                  {doctor.specialty}
                </p>
              )}
              {doctor.qualifications && (
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>
                  {doctor.qualifications}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: doctor.available ? '#10b981' : '#64748b',
                  background: doctor.available ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                  padding: '4px 12px', borderRadius: 100,
                  border: `1px solid ${doctor.available ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.25)'}`,
                }}>
                  {doctor.available ? '✓ Available for Booking' : '✗ Currently Unavailable'}
                </span>
                {doctor.rating != null && Number(doctor.rating) > 0 && (
                  <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>
                    ★ {Number(doctor.rating).toFixed(1)}
                    {doctor.ratingCount > 0 && (
                      <span style={{ color: '#64748b', fontWeight: 400 }}> ({doctor.ratingCount})</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── BOOK NOW BUTTON ── */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Primary: Open in app (Android intent — falls back to Play Store) */}
            <a
              href={intentUrl}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
                color: '#fff', fontWeight: 900, fontSize: 17,
                padding: '16px 24px', borderRadius: 14,
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(26,107,204,0.35)',
                letterSpacing: '0.3px',
              }}
            >
              📱 Book Now — Open in FlashMed App
            </a>

            {/* Secondary: Direct Play Store link */}
            <a
              href={playUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'transparent',
                color: '#94a3b8', fontWeight: 600, fontSize: 14,
                padding: '12px 20px', borderRadius: 12,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              ⬇️ Download FlashMed on Play Store
            </a>
          </div>
        </div>

        {/* ── Info Sections ── */}

        {/* About */}
        {doctor.about && (
          <section style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: 24, marginBottom: 16,
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>About</h2>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{doctor.about}</p>
          </section>
        )}

        {/* Details grid */}
        <section style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: 24, marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px' }}>Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {clinicName && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>Clinic</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>🏥 {clinicName}</p>
              </div>
            )}
            {location && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>Location</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>📍 {location}</p>
              </div>
            )}
            {city && !location && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>City</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>📍 {city}</p>
              </div>
            )}
            {typeof doctor.experience === 'number' && doctor.experience > 0 && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>Experience</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>🎓 {doctor.experience} year{doctor.experience !== 1 ? 's' : ''}</p>
              </div>
            )}
            {typeof doctor.consultationFee === 'number' && doctor.consultationFee > 0 && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>Consultation Fee</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>
                  💰 ₹{doctor.consultationFee}
                  {doctor.bookingMode === 'partial' && doctor.amountDue > 0 && (
                    <span style={{ color: '#64748b', fontSize: 12, marginLeft: 6 }}>(Book for ₹{doctor.amountDue})</span>
                  )}
                </p>
              </div>
            )}
            {doctor.consultationMode && (
              <div>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>Consultation Mode</p>
                <p style={{ fontSize: 14, color: '#f1f5f9', margin: 0 }}>
                  {doctor.consultationMode === 'online' ? '💻 Online' :
                   doctor.consultationMode === 'offline' ? '🏥 In-Clinic' : '💻🏥 Online & In-Clinic'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Specialties */}
        {Array.isArray(doctor.specialties) && doctor.specialties.length > 1 && (
          <section style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: 24, marginBottom: 16,
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>Specializations</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {doctor.specialties.map((sp, i) => (
                <span key={i} style={{
                  fontSize: 13, fontWeight: 600, color: '#10b981',
                  background: 'rgba(16,185,129,0.1)', padding: '6px 14px',
                  borderRadius: 100, border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  {sp}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* How to book */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(26,107,204,0.08), rgba(16,185,129,0.04))',
          border: '1px solid rgba(26,107,204,0.2)',
          borderRadius: 16, padding: 24,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px' }}>How to Book</h2>
          <ol style={{ color: '#94a3b8', fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            <li>Tap <strong style={{ color: '#fff' }}>&ldquo;Book Now&rdquo;</strong> above</li>
            <li>If FlashMed is installed, it opens directly to this doctor</li>
            <li>If not installed, you&rsquo;ll be taken to the Play Store to download it free</li>
            <li>After installing, search for <strong style={{ color: '#fff' }}>Dr. {doctor.name}</strong> and tap Book</li>
          </ol>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>
          © {new Date().getFullYear()} FlashMed. |{' '}
          <Link href="/doctors" style={{ color: '#10b981', textDecoration: 'none' }}>All Doctors</Link>
          {' | '}
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link>
        </p>
      </footer>
    </div>
  );
}
