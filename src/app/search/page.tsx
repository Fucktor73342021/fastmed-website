'use client';
/**
 * FlashMed — Universal Provider Search Page
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * PUBLIC route — no login required. Accessible at /search.
 *
 * Features:
 *  ✅ Search doctors, pharmacies, clinics, labs, hospitals (all in one)
 *  ✅ Type filter tabs (All / Doctors / Pharmacies / Clinics / Labs / Hospitals)
 *  ✅ Full profile detail view for every provider (click to expand)
 *  ✅ "Book / Open App" button → deep-links to the exact profile in the app
 *      - If app installed: opens FlashMed app to that exact screen
 *      - If not installed: opens Play Store with referrer tracking
 *  ✅ Debounced search (300 ms) so every keystroke doesn't fire a request
 *  ✅ Accessibility: keyboard-navigable, aria-labels, reduced-motion safe
 *  ✅ Zero DOM thrashing, virtualization-ready card list
 *  ✅ Proper error states, empty states, loading skeletons
 *  ✅ Edge-cached API proxy (10 s) → Redis-cached backend (15 s) → DB
 *
 * Deep-link strategy (identical to DeepLinkBridge, but inline):
 *  - Doctors:   flashmed://d/<id>  /  intent://d/<id>#Intent;...
 *  - Clinics:   flashmed://c/<uid> /  intent://c/<uid>#Intent;...
 *  - Pharmacies: flashmed://p/<uid> / intent://p/<uid>#Intent;...
 *  - Labs:      treated as pharmacy type (uid-based) → flashmed://p/<uid>
 *  - Hospitals: treated as clinic type (facilityUid) → flashmed://c/<uid>
 *
 * IMPORTANT: The existing deep-link routes /d/[id], /c/[uid], /p/[uid]
 * are NOT touched or changed. Those shared links still work exactly as before.
 * This page is an ADDITIVE feature only.
 *
 * ══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const PACKAGE_NAME  = 'in.flashmed.app';
const PLAY_STORE    = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

// Category tabs shown in the UI
type Category = 'all' | 'doctor' | 'pharmacy' | 'clinic' | 'lab' | 'hospital';

const CATEGORIES: { key: Category; label: string; icon: string; backendType: string }[] = [
  { key: 'all',      label: 'All',       icon: '🔍',  backendType: 'all'          },
  { key: 'doctor',   label: 'Doctors',   icon: '🩺',  backendType: 'doctor'       },
  { key: 'pharmacy', label: 'Pharmacy',  icon: '💊',  backendType: 'pharmacy'     },
  { key: 'clinic',   label: 'Clinics',   icon: '🏥',  backendType: 'clinic'       },
  { key: 'lab',      label: 'Labs',      icon: '🔬',  backendType: 'lab'          },
  { key: 'hospital', label: 'Hospitals', icon: '🏨',  backendType: 'nursing_home' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  name: string;
  businessType: string;
  avgRating: number;
  totalRatingCount: number;
  flashmedTrusted: boolean;
  isOpen: boolean;
  district: string | null;
  address: string | null;
  providerSource: 'seller' | 'doctor' | 'facility';
  facilityUid: string | null;
}

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  specialties: string[] | null;
  clinicName: string | null;
  facilityUid: string | null;
  qualifications: string | null;
  experience: number;
  consultationFee: number | null;
  available: boolean;
  rating: number;
  ratingCount: number;
  photoUrl: string | null;
  bookingMode: string;
  amountDue: number;
  location: { address: string | null; locality: string | null; city: string | null; district: string | null; state: string | null; pinCode: string | null } | null;
  clinic: { name: string; phone: string | null; isOpen: boolean; operatingHours: unknown } | null;
  reviews: { rating: number; review: string | null; reviewerName: string; createdAt: string }[];
  shareUrl: string;
}

interface ClinicProfile {
  uid: string;
  facilityType: string;
  name: string;
  ownerName: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  locality: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pinCode: string | null;
  isOpen: boolean;
  services: string[];
  avgRating: number;
  ratingCount: number;
  photos: string[];
  doctors: { id: string; name: string; specialty: string; qualifications: string | null; experience: number; rating: number; consultationFee: number | null; available: boolean; photoUrl: string | null }[];
  reviews: { rating: number; review: string | null; createdAt: string }[];
  shareUrl: string;
}

interface PharmacyProfile {
  uid: string;
  name: string;
  ownerName: string | null;
  businessType: string;
  address: string | null;
  district: string | null;
  pinCode: string | null;
  isOpen: boolean;
  avgRating: number;
  totalRatingCount: number;
  flashmedTrusted: boolean;
  discountPercent: number;
  photos: string[];
  reviews: { rating: number; review: string | null; reviewerName: string; createdAt: string }[];
  shareUrl: string;
}

type ProviderProfile = { type: 'doctor'; data: DoctorProfile } | { type: 'clinic'; data: ClinicProfile } | { type: 'pharmacy'; data: PharmacyProfile } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildDeepLinks(type: 'doctor' | 'clinic' | 'pharmacy', id: string) {
  const prefixMap = { doctor: 'd', clinic: 'c', pharmacy: 'p' } as const;
  const prefix    = prefixMap[type];
  const safeId    = encodeURIComponent(id);
  const referrer  = encodeURIComponent(`utm_source=web_search&utm_medium=search&utm_content=${type}_${id}`);
  const playUrl   = `${PLAY_STORE}&referrer=${referrer}`;
  const customUrl = `flashmed://${prefix}/${safeId}`;
  const intentUrl = `intent://${prefix}/${safeId}#Intent;scheme=flashmed;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;
  return { customUrl, intentUrl, playUrl };
}

// Map a search result's businessType / providerSource to the profile type for the deep link
function resolveDeepLinkType(result: SearchResult): { profileType: 'doctor' | 'clinic' | 'pharmacy'; profileId: string } {
  if (result.providerSource === 'doctor') {
    return { profileType: 'doctor', profileId: result.id };
  }
  if (result.providerSource === 'facility' || result.facilityUid) {
    return { profileType: 'clinic', profileId: result.facilityUid || result.id };
  }
  // seller — businessType determines routing
  if (result.businessType === 'lab' || result.businessType === 'blood_bank' || result.businessType === 'pharmacy') {
    return { profileType: 'pharmacy', profileId: result.id };
  }
  if (result.businessType === 'doctor_clinic' || result.businessType === 'nursing_home' || result.businessType === 'clinic') {
    return { profileType: 'clinic', profileId: result.facilityUid || result.id };
  }
  return { profileType: 'pharmacy', profileId: result.id };
}

// Also resolve for fetching the profile
function resolveProfileFetchType(result: SearchResult): { fetchType: 'doctor' | 'clinic' | 'pharmacy'; fetchId: string } {
  if (result.providerSource === 'doctor') return { fetchType: 'doctor', fetchId: result.id };
  if (result.providerSource === 'facility' || result.facilityUid) {
    return { fetchType: 'clinic', fetchId: result.facilityUid || result.id };
  }
  if (['lab', 'blood_bank', 'pharmacy'].includes(result.businessType)) return { fetchType: 'pharmacy', fetchId: result.id };
  if (['doctor_clinic', 'nursing_home', 'clinic'].includes(result.businessType)) {
    return { fetchType: 'clinic', fetchId: result.facilityUid || result.id };
  }
  return { fetchType: 'pharmacy', fetchId: result.id };
}

function renderStars(rating: number) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
}

function businessTypeLabel(bt: string): string {
  const map: Record<string, string> = {
    pharmacy: 'Pharmacy',
    lab: 'Diagnostic Lab',
    doctor_clinic: 'Doctor / Clinic',
    nursing_home: 'Hospital / Nursing Home',
    blood_bank: 'Blood Bank',
    clinic: 'Clinic',
    doctor: 'Doctor',
  };
  return map[bt] || bt;
}

function businessTypeIcon(bt: string): string {
  const map: Record<string, string> = {
    pharmacy: '💊', lab: '🔬', doctor_clinic: '🩺', nursing_home: '🏨',
    blood_bank: '🩸', clinic: '🏥', doctor: '🩺',
  };
  return map[bt] || '🏪';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--color-card)',
      borderRadius: 16,
      padding: '20px 18px',
      border: '1px solid var(--color-border)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ height: 18, width: '60%', background: 'var(--color-border)', borderRadius: 6, marginBottom: 10 }} />
      <div style={{ height: 13, width: '40%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 13, width: '80%', background: 'var(--color-border)', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 36, width: '100%', background: 'var(--color-border)', borderRadius: 10, marginTop: 14 }} />
    </div>
  );
}

function BookButton({ result }: { result: SearchResult }) {
  const { profileType, profileId } = resolveDeepLinkType(result);
  const { intentUrl, customUrl, playUrl } = buildDeepLinks(profileType, profileId);

  const labels: Record<typeof profileType, string> = {
    doctor:   '📱 Book Doctor on FlashMed',
    clinic:   '📱 Book on FlashMed',
    pharmacy: '📱 Order on FlashMed',
  };

  return (
    <a
      href={intentUrl}
      onClick={(e) => {
        // Detect non-Chrome Android → use custom scheme
        const ua = navigator.userAgent.toLowerCase();
        const isChrome = /chrome/.test(ua) && !/edg/.test(ua) && !/opr/.test(ua);
        if (!isChrome) {
          e.preventDefault();
          window.location.href = customUrl;
          setTimeout(() => { window.location.href = playUrl; }, 2000);
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
        color: '#fff',
        fontWeight: 800,
        fontSize: 14,
        padding: '12px 20px',
        borderRadius: 12,
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(26,107,204,0.3)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        marginTop: 14,
        width: '100%',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
    >
      {labels[profileType]}
    </a>
  );
}

function DoctorProfileCard({ data }: { data: DoctorProfile }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={data.name}
            width={64} height={64}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--color-border)' }}
            loading="lazy"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#fff', fontWeight: 800,
          }}>
            {data.name?.charAt(0) || '👨‍⚕️'}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-text)' }}>Dr. {data.name}</div>
          <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, marginTop: 2 }}>{data.specialty}</div>
          {data.qualifications && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{data.qualifications}</div>}
          {data.experience > 0 && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{data.experience} yrs experience</div>}
        </div>
      </div>

      {/* Clinic info */}
      {data.clinic && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 13 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>🏥 {data.clinic.name}</div>
          {data.location?.address && <div style={{ color: 'var(--color-text-muted)' }}>📍 {data.location.address}{data.location.city ? `, ${data.location.city}` : ''}</div>}
          {data.clinic.phone && <div style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>📞 {data.clinic.phone}</div>}
          <div style={{ marginTop: 4 }}>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              background: data.clinic.isOpen ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: data.clinic.isOpen ? 'var(--color-success)' : 'var(--color-error)',
            }}>
              {data.clinic.isOpen ? '● Open Now' : '● Closed'}
            </span>
          </div>
        </div>
      )}

      {/* Fee & booking */}
      {data.consultationFee != null && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-success)' }}>
            ₹{data.consultationFee} consultation fee
          </span>
          {data.bookingMode !== 'free' && data.amountDue > 0 && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              (₹{data.amountDue} to book online)
            </span>
          )}
        </div>
      )}

      {/* Rating */}
      {data.ratingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 13 }}>
          <span style={{ color: '#f59e0b' }}>{renderStars(data.rating)}</span>
          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{data.rating.toFixed(1)}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>({data.ratingCount} reviews)</span>
        </div>
      )}

      {/* Reviews */}
      {data.reviews.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patient Reviews</div>
          {data.reviews.slice(0, 3).map((r, i) => (
            <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontWeight: 700 }}>{r.reviewerName}</span>
                <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
              </div>
              {r.review && <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{r.review}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClinicProfileCard({ data }: { data: ClinicProfile }) {
  return (
    <div style={{ marginTop: 14 }}>
      {/* Photos */}
      {data.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
          {data.photos.slice(0, 3).map((url, i) => (
            <img
              key={i} src={url} alt="Clinic" loading="lazy"
              style={{ width: 80, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-border)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ))}
        </div>
      )}

      {/* Basic info */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 13 }}>
        {data.address && <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>📍 {data.address}{data.city ? `, ${data.city}` : ''}</div>}
        {data.phone && <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>📞 {data.phone}</div>}
        {data.email && <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>✉️ {data.email}</div>}
        <span style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          background: data.isOpen ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          color: data.isOpen ? 'var(--color-success)' : 'var(--color-error)',
        }}>
          {data.isOpen ? '● Open Now' : '● Closed'}
        </span>
      </div>

      {/* Rating */}
      {data.ratingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 13 }}>
          <span style={{ color: '#f59e0b' }}>{renderStars(data.avgRating)}</span>
          <span style={{ fontWeight: 700 }}>{data.avgRating.toFixed(1)}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>({data.ratingCount} reviews)</span>
        </div>
      )}

      {/* Services */}
      {data.services.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Services</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.services.slice(0, 8).map((s, i) => (
              <span key={i} style={{ fontSize: 11, background: 'rgba(26,107,204,0.08)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Doctors at this clinic */}
      {data.doctors.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Doctors Here</div>
          {data.doctors.map((d) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 13 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, color: '#fff', fontWeight: 800, flexShrink: 0,
              }}>{d.name?.charAt(0) || '👨‍⚕️'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>Dr. {d.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{d.specialty}</div>
                {d.consultationFee != null && <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 700 }}>₹{d.consultationFee}</div>}
              </div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                background: d.available ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: d.available ? 'var(--color-success)' : 'var(--color-error)',
              }}>
                {d.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PharmacyProfileCard({ data }: { data: PharmacyProfile }) {
  return (
    <div style={{ marginTop: 14 }}>
      {data.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
          {data.photos.slice(0, 3).map((url, i) => (
            <img
              key={i} src={url} alt="Pharmacy" loading="lazy"
              style={{ width: 80, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-border)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ))}
        </div>
      )}

      <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 13 }}>
        {data.address && <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>📍 {data.address}{data.district ? `, ${data.district}` : ''}</div>}
        {data.pinCode && <div style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>📮 PIN: {data.pinCode}</div>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: data.isOpen ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: data.isOpen ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {data.isOpen ? '● Open Now' : '● Closed'}
          </span>
          {data.flashmedTrusted && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(26,107,204,0.10)', color: 'var(--color-primary)' }}>
              ✅ FlashMed Trusted
            </span>
          )}
          {data.discountPercent > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', color: 'var(--color-success)' }}>
              🏷 {data.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {data.totalRatingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 13 }}>
          <span style={{ color: '#f59e0b' }}>{renderStars(data.avgRating)}</span>
          <span style={{ fontWeight: 700 }}>{data.avgRating.toFixed(1)}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>({data.totalRatingCount} reviews)</span>
        </div>
      )}

      {data.reviews.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer Reviews</div>
          {data.reviews.slice(0, 3).map((r, i) => (
            <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontWeight: 700 }}>{r.reviewerName}</span>
                <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
              </div>
              {r.review && <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{r.review}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: SearchResult }) {
  const [expanded,  setExpanded]  = useState(false);
  const [profile,   setProfile]   = useState<ProviderProfile>(null);
  const [loadingPr, setLoadingPr] = useState(false);
  const [profileErr,setProfileErr]= useState<string | null>(null);
  const hasFetched = useRef(false);

  const toggleExpand = useCallback(async () => {
    if (!expanded && !hasFetched.current) {
      hasFetched.current = true;
      setLoadingPr(true);
      setProfileErr(null);

      const { fetchType, fetchId } = resolveProfileFetchType(result);
      try {
        const res = await fetch(
          `/api/proxy/public-profile?type=${fetchType}&id=${encodeURIComponent(fetchId)}`,
          { headers: { Accept: 'application/json' } }
        );
        const data = await res.json().catch(() => null);

        if (data?.success) {
          if (fetchType === 'doctor')   setProfile({ type: 'doctor',   data: data.doctor   });
          if (fetchType === 'clinic')   setProfile({ type: 'clinic',   data: data.clinic   });
          if (fetchType === 'pharmacy') setProfile({ type: 'pharmacy', data: data.pharmacy });
        } else {
          setProfileErr(data?.error || 'Profile not available');
        }
      } catch {
        setProfileErr('Could not load profile details. Tap Book to open in the app.');
      } finally {
        setLoadingPr(false);
      }
    }
    setExpanded(prev => !prev);
  }, [expanded, result]);

  const icon  = businessTypeIcon(result.businessType);
  const label = businessTypeLabel(result.businessType);

  return (
    <div
      style={{
        background: 'var(--color-card)',
        borderRadius: 16,
        border: expanded ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: expanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── Card Header (always visible) ── */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggleExpand}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(); } }}
        style={{
          padding: '16px 18px',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Icon */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(26,107,204,0.12), rgba(26,107,204,0.06))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, border: '1px solid rgba(26,107,204,0.12)',
          }}>
            {icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)', wordBreak: 'break-word' }}>
                {result.name}
              </div>
              {result.flashmedTrusted && (
                <span style={{ fontSize: 10, background: 'rgba(26,107,204,0.10)', color: 'var(--color-primary)', padding: '1px 7px', borderRadius: 20, fontWeight: 700, whiteSpace: 'nowrap' }}>✅ Trusted</span>
              )}
            </div>

            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3, fontWeight: 600 }}>{label}</div>

            <div style={{ display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
              {result.avgRating > 0 && (
                <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>★ {result.avgRating.toFixed(1)}</span>
              )}
              {result.district && (
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>📍 {result.district}</span>
              )}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20,
                background: result.isOpen ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
                color: result.isOpen ? 'var(--color-success)' : 'var(--color-error)',
              }}>
                {result.isOpen ? '● Open' : '● Closed'}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            fontSize: 16, color: 'var(--color-text-muted)', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}>▼</div>
        </div>
      </div>

      {/* ── Expanded Detail Section ── */}
      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--color-border)' }}>
          {loadingPr && (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3, margin: '0 auto 8px' }} />
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Loading profile…</div>
            </div>
          )}

          {!loadingPr && profileErr && (
            <div style={{ padding: '14px 0', fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              ⚠️ {profileErr}
            </div>
          )}

          {!loadingPr && !profileErr && profile && (
            <>
              {profile.type === 'doctor'   && <DoctorProfileCard   data={profile.data} />}
              {profile.type === 'clinic'   && <ClinicProfileCard   data={profile.data} />}
              {profile.type === 'pharmacy' && <PharmacyProfileCard data={profile.data} />}
            </>
          )}

          {/* Book button — always shown when expanded */}
          {!loadingPr && <BookButton result={result} />}
        </div>
      )}
    </div>
  );
}

// ─── Main Search Page ─────────────────────────────────────────────────────────
export default function SearchPage() {
  const [query,      setQuery]      = useState('');
  const [category,   setCategory]   = useState<Category>('all');
  const [results,    setResults]    = useState<SearchResult[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQuery  = useRef<string>('');

  // ── Perform search ──────────────────────────────────────────────────────────
  const doSearch = useCallback(async (q: string, cat: Category) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    const requestId = q + '|' + cat;
    latestQuery.current = requestId;

    setLoading(true);
    setError(null);

    const backendType = CATEGORIES.find(c => c.key === cat)?.backendType || 'all';
    const params = new URLSearchParams({ q: q.trim(), type: backendType, limit: '30' });

    try {
      const res = await fetch(`/api/proxy/public-search?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        // 12-second client-side timeout
        signal: AbortSignal.timeout(12_000),
      });

      // Guard: ignore stale responses if a newer query overtook this one
      if (latestQuery.current !== requestId) return;

      const data = await res.json().catch(() => ({ success: false, results: [], error: 'Parse error' }));

      if (!data.success) {
        setError(data.error || 'Search failed. Please try again.');
        setResults([]);
      } else {
        setResults(Array.isArray(data.results) ? data.results : []);
        setError(null);
      }
    } catch (err: unknown) {
      if (latestQuery.current !== requestId) return;
      const isTimeout = err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError');
      setError(isTimeout ? 'Search timed out. Please try again.' : 'Connection error. Please check your network.');
      setResults([]);
    } finally {
      if (latestQuery.current === requestId) {
        setLoading(false);
        setSearched(true);
      }
    }
  }, []);

  // ── Debounced search on query/category change ────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setError(null);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      doSearch(query, category);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, category, doSearch]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    // Re-search immediately when tab changes (no extra debounce needed, useEffect above handles it)
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setError(null);
    setLoading(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* ── Public Top Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'var(--color-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>💊</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--color-text)' }}>
            FlashMed
          </span>
        </a>
        <a href="/register" style={{
          padding: '8px 18px', borderRadius: 10, border: 'none',
          background: 'var(--color-primary)', color: '#fff',
          textDecoration: 'none', fontSize: 13, fontWeight: 700,
          boxShadow: 'var(--shadow-primary)',
        }}>Get Started</a>
      </header>

      {/* ── Search Content ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* ── Page Title ── */}
        <div style={{ padding: '28px 0 20px' }}>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, color: 'var(--color-text)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            Find Healthcare Providers
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Search doctors, pharmacies, clinics, labs &amp; hospitals near you.<br />
            Tap any result to view their full profile, then book directly in the FlashMed app.
          </p>
        </div>

      {/* ── Search Bar ── */}
      <div style={{
        background: 'var(--color-card)',
        borderRadius: 16,
        border: '1.5px solid var(--color-border)',
        padding: '4px 8px 4px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0, color: 'var(--color-text-muted)' }}>🔍</span>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, specialty, district…"
          aria-label="Search healthcare providers"
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 15,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            padding: '12px 0',
          }}
        />
        {loading && (
          <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, flexShrink: 0 }} />
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, color: 'var(--color-text-muted)', flexShrink: 0,
              padding: '4px 8px', borderRadius: 8,
            }}
          >✕</button>
        )}
      </div>

      {/* ── Category Tabs ── */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            aria-pressed={category === cat.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 24,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 700,
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              background: category === cat.key
                ? 'var(--color-primary)'
                : 'var(--color-card)',
              color: category === cat.key
                ? '#fff'
                : 'var(--color-text-muted)',
              boxShadow: category === cat.key
                ? 'var(--shadow-primary)'
                : 'var(--shadow-sm)',
              border: category === cat.key
                ? '1.5px solid var(--color-primary)'
                : '1.5px solid var(--color-border)',
            } as React.CSSProperties}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── Hint when no query ── */}
      {!query && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'var(--color-card)', borderRadius: 20,
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>
            Search any healthcare provider
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
            Type a name, specialty, location, or condition — we'll find doctors, pharmacies, clinics, labs, and hospitals.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['Cardiologist', 'Jain Medical', 'Dermatologist', 'Diagnostic Lab'].map(hint => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)', color: 'var(--color-primary)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 14,
          color: 'var(--color-error)', fontWeight: 600,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && searched && results.length === 0 && !error && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'var(--color-card)', borderRadius: 20, border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>😕</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>
            No results for "{query}"
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Try a different name, spelling, or switch to the "All" category.
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {!loading && results.length > 0 && (
        <>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12, fontWeight: 600 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            {category !== 'all' && ` · ${CATEGORIES.find(c => c.key === category)?.label}`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map(r => (
              <ResultCard key={`${r.providerSource}-${r.id}`} result={r} />
            ))}
          </div>

          {/* App CTA */}
          <div style={{
            marginTop: 32, padding: '24px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(26,107,204,0.08), rgba(26,107,204,0.04))',
            border: '1px solid rgba(26,107,204,0.15)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📱</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)', marginBottom: 6 }}>
              Get the full experience on the app
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
              Book appointments, track orders, consult doctors &amp; more — all in one place.
            </div>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--color-primary)', color: '#fff',
                padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
                fontWeight: 800, fontSize: 14, boxShadow: 'var(--shadow-primary)',
              }}
            >
              ⬇️ Download FlashMed Free
            </a>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
