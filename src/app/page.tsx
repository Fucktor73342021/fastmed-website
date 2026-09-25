'use client';
/**
 * FlashMed Landing Page — page.tsx
 * ════════════════════════════════════════════════════════════════════════
 *
 * Changes vs previous version:
 *  ✅ Login button REMOVED from header (header now only shows "Get Started")
 *  ✅ Doctor / Clinic / Hospital ID search section added (no AI, pure fetch)
 *  ✅ Bright white background with animated floating bubbles
 *  ✅ /delete-account, /privacy-policy, /faqs — NOT touched, still linked in footer
 *  ✅ All backend APIs, booking workflows, deep links — completely untouched
 *
 * Architecture:
 *  - Search hits /api/proxy/public-search (same as /search page, already exists)
 *  - Deep-link logic identical to /search page — opens app or Play Store
 *  - No auth dependency on the landing page
 * ════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

// ─── Constants ─────────────────────────────────────────────────────────────────
const PACKAGE_NAME = 'in.flashmed.app';
const PLAY_STORE   = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

type SearchCategory = 'all' | 'doctor' | 'clinic' | 'pharmacy' | 'hospital';

const SEARCH_TABS: { key: SearchCategory; label: string; icon: string; backendType: string }[] = [
  { key: 'all',      label: 'All',       icon: '🔍', backendType: 'all' },
  { key: 'doctor',   label: 'Doctors',   icon: '🩺', backendType: 'doctor' },
  { key: 'clinic',   label: 'Clinics',   icon: '🏥', backendType: 'clinic' },
  { key: 'hospital', label: 'Hospitals', icon: '🏨', backendType: 'nursing_home' },
  { key: 'pharmacy', label: 'Pharmacy',  icon: '💊', backendType: 'pharmacy' },
];

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

// ─── Deep-link builder (mirrors /search page exactly) ─────────────────────────
function buildDeepLink(type: 'doctor' | 'clinic' | 'pharmacy', id: string) {
  const prefix    = { doctor: 'd', clinic: 'c', pharmacy: 'p' }[type];
  const safeId    = encodeURIComponent(id);
  const referrer  = encodeURIComponent(`utm_source=landing&utm_medium=search&utm_content=${type}_${id}`);
  const playUrl   = `${PLAY_STORE}&referrer=${referrer}`;
  const customUrl = `flashmed://${prefix}/${safeId}`;
  const intentUrl = `intent://${prefix}/${safeId}#Intent;scheme=flashmed;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;
  return { intentUrl, customUrl, playUrl };
}

function resolveDeepLinkType(r: SearchResult): { profileType: 'doctor' | 'clinic' | 'pharmacy'; profileId: string } {
  if (r.providerSource === 'doctor') return { profileType: 'doctor', profileId: r.id };
  if (r.providerSource === 'facility' || r.facilityUid) return { profileType: 'clinic', profileId: r.facilityUid || r.id };
  if (['lab', 'blood_bank', 'pharmacy'].includes(r.businessType)) return { profileType: 'pharmacy', profileId: r.id };
  if (['doctor_clinic', 'nursing_home', 'clinic'].includes(r.businessType)) return { profileType: 'clinic', profileId: r.facilityUid || r.id };
  return { profileType: 'pharmacy', profileId: r.id };
}

function typeLabel(bt: string): string {
  return ({ pharmacy: 'Pharmacy', lab: 'Diagnostic Lab', doctor_clinic: 'Doctor/Clinic', nursing_home: 'Hospital', blood_bank: 'Blood Bank', clinic: 'Clinic', doctor: 'Doctor' } as Record<string, string>)[bt] || bt;
}
function typeIcon(bt: string): string {
  return ({ pharmacy: '💊', lab: '🔬', doctor_clinic: '🩺', nursing_home: '🏨', blood_bank: '🩸', clinic: '🏥', doctor: '🩺' } as Record<string, string>)[bt] || '🏪';
}

// ─── Compact result row ────────────────────────────────────────────────────────
function HeroResultRow({ result, onClose }: { result: SearchResult; onClose: () => void }) {
  const { profileType, profileId } = resolveDeepLinkType(result);
  const { intentUrl, customUrl, playUrl } = buildDeepLink(profileType, profileId);
  const label = profileType === 'doctor' ? '📱 Book Doctor' : profileType === 'clinic' ? '📱 Book Clinic' : '📱 Order Now';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: '#ffffff',
      borderRadius: 14,
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(26,107,204,0.07)',
      marginBottom: 8,
      flexWrap: 'wrap',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(26,107,204,0.12), rgba(26,107,204,0.06))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>
        {typeIcon(result.businessType)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.name}
          {result.flashmedTrusted && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(26,107,204,0.10)', color: '#1a6bcc', padding: '1px 7px', borderRadius: 20, fontWeight: 700, display: 'inline-block' }}>✅ Trusted</span>}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span>{typeLabel(result.businessType)}</span>
          {result.district && <span>📍 {result.district}</span>}
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20,
            background: result.isOpen ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
            color: result.isOpen ? '#059669' : '#dc2626',
          }}>{result.isOpen ? '● Open' : '● Closed'}</span>
        </div>
      </div>
      <a
        href={intentUrl}
        onClick={(e) => {
          const ua = navigator.userAgent.toLowerCase();
          const isChrome = /chrome/.test(ua) && !/edg/.test(ua) && !/opr/.test(ua);
          if (!isChrome) {
            e.preventDefault();
            window.location.href = customUrl;
            setTimeout(() => { window.location.href = playUrl; }, 2000);
          }
        }}
        style={{
          flexShrink: 0, padding: '8px 14px', borderRadius: 10,
          background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
          color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(26,107,204,0.3)',
        }}
      >
        {label}
      </a>
    </div>
  );
}

// ─── Hero Search Component ─────────────────────────────────────────────────────
function HeroSearch() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [results,  setResults]  = useState<SearchResult[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef   = useRef<string>('');

  const doSearch = useCallback(async (q: string, cat: SearchCategory) => {
    const requestId = `${q}|${cat}`;
    latestRef.current = requestId;

    if (!q.trim() || q.trim().length < 2) {
      setResults([]); setSearched(false); setError(null); setLoading(false);
      return;
    }

    setLoading(true); setError(null);
    const backendType = SEARCH_TABS.find(t => t.key === cat)?.backendType ?? 'all';
    const params = new URLSearchParams({ q: q.trim(), type: backendType, limit: '15' });

    try {
      const res = await fetch(`/api/proxy/public-search?${params}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(12_000),
      });
      if (latestRef.current !== requestId) return;
      const data = await res.json().catch(() => ({ success: false, results: [] }));
      if (data.success) {
        setResults(Array.isArray(data.results) ? data.results : []);
      } else {
        setError(data.error || 'Search failed. Please try again.'); setResults([]);
      }
    } catch (err: unknown) {
      if (latestRef.current !== requestId) return;
      const isTimeout = err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError');
      setError(isTimeout ? 'Search timed out.' : 'Network error. Please check your connection.');
      setResults([]);
    } finally {
      if (latestRef.current === requestId) { setLoading(false); setSearched(true); }
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]); setSearched(false); setError(null); setLoading(false); return;
    }
    debounceRef.current = setTimeout(() => doSearch(query, category), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, category, doSearch]);

  const clear = () => { setQuery(''); setResults([]); setSearched(false); setError(null); setLoading(false); };

  const showResults = results.length > 0 || (searched && !loading);

  return (
    <section style={{
      position: 'relative', zIndex: 10,
      maxWidth: 700, margin: '0 auto',
      padding: '0 16px',
    }}>
      {/* Search bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '2px solid rgba(26,107,204,0.18)',
        padding: '6px 10px 6px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(26,107,204,0.14)',
        marginBottom: 12,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0, color: '#64748b' }}>🔍</span>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search doctor name, clinic, hospital ID…"
          aria-label="Search healthcare providers"
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent', fontSize: 15,
            color: '#1a1a2e', fontFamily: 'inherit', padding: '12px 0',
          }}
        />
        {loading && (
          <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, flexShrink: 0 }} />
        )}
        {query && !loading && (
          <button onClick={clear} aria-label="Clear" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, color: '#64748b', padding: '4px 8px', borderRadius: 8,
          }}>✕</button>
        )}
        <Link href="/search">
          <button style={{
            background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '11px 20px', fontWeight: 800, fontSize: 14,
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(26,107,204,0.3)',
          }}>
            Search
          </button>
        </Link>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: showResults ? 16 : 0 }}>
        {SEARCH_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            style={{
              padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
              fontWeight: 700, fontSize: 12, border: '1.5px solid',
              fontFamily: 'inherit', transition: 'all 0.15s ease',
              background: category === tab.key ? '#1a6bcc' : '#ffffff',
              color: category === tab.key ? '#fff' : '#64748b',
              borderColor: category === tab.key ? '#1a6bcc' : '#e2e8f0',
              boxShadow: category === tab.key ? '0 4px 12px rgba(26,107,204,0.3)' : '0 1px 4px rgba(15,23,42,0.06)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Hint chips when empty */}
      {!query && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Try searching for:</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Cardiologist', 'Apollo Clinic', 'Jain Medical', 'Dermatologist'].map(hint => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafd', color: '#1a6bcc',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 12, background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '12px 16px',
          fontSize: 13, color: '#dc2626', fontWeight: 600,
        }}>⚠️ {error}</div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </div>
          {results.slice(0, 6).map(r => (
            <HeroResultRow key={`${r.providerSource}-${r.id}`} result={r} onClose={clear} />
          ))}
          {results.length > 6 && (
            <Link href={`/search?q=${encodeURIComponent(query)}&type=${SEARCH_TABS.find(t => t.key === category)?.backendType ?? 'all'}`}>
              <div style={{
                textAlign: 'center', padding: '12px', borderRadius: 14,
                background: 'rgba(26,107,204,0.06)', border: '1px solid rgba(26,107,204,0.15)',
                fontSize: 13, fontWeight: 700, color: '#1a6bcc', cursor: 'pointer',
                marginTop: 4,
              }}>
                View all {results.length} results →
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && results.length === 0 && !error && (
        <div style={{
          marginTop: 12, textAlign: 'center', padding: '24px',
          background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>😕</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', marginBottom: 4 }}>No results for &quot;{query}&quot;</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Try a different spelling or switch category.</div>
        </div>
      )}
    </section>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

      {/* Animated Bubble Field — matches patient app MeshGradient */}
      <div className="bubble-field" aria-hidden="true">
        <div className="bubble-orb bubble-orb-1" />
        <div className="bubble-orb bubble-orb-2" />
        <div className="bubble-orb bubble-orb-3" />
        <div className="bubble-orb bubble-orb-4" />
        <div className="bubble-orb bubble-orb-5" />
      </div>

      {/* ── Header — NO Login button ── */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px',
        borderBottom: '1px solid rgba(26,107,204,0.10)',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#1a1a2e' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 8px 24px rgba(26,107,204,0.28)',
          }}>💊</div>
          FlashMed
        </div>
        {/* Only "Get Started" — Login button intentionally removed */}
        <Link href="/register">
          <button className="btn btn-primary btn-sm">Get Started</button>
        </Link>
      </header>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center',
        padding: 'clamp(48px, 8vh, 96px) 24px 32px',
        maxWidth: 860, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(26,107,204,0.08)',
          border: '1px solid rgba(26,107,204,0.20)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 24,
          fontSize: 13, fontWeight: 700, color: '#1a6bcc',
        }}>
          ⚡ 10–40 Min Delivery · Verified Pharmacies
        </div>

        <h1 className="h1" style={{ marginBottom: 18, color: '#1a1a2e' }}>
          Healthcare <span style={{ color: '#1a6bcc' }}>Delivered</span><br />
          at Lightning Speed
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)', color: '#64748b',
          lineHeight: 1.65, maxWidth: 540, margin: '0 auto 36px',
        }}>
          Order medicines, book lab tests at home, consult doctors,
          and request emergency blood — all from one place.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <Link href="/register">
            <button className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>
              🚀 Order Medicines Now
            </button>
          </Link>
          <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-secondary btn-lg" style={{ minWidth: 160 }}>
              ⬇️ Download App
            </button>
          </a>
        </div>
      </section>

      {/* ── Search Section ── */}
      <section style={{ position: 'relative', zIndex: 10, marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 24, padding: '0 16px' }}>
          <h2 className="h3" style={{ color: '#1a1a2e', marginBottom: 8 }}>
            Find Doctors, Clinics & Hospitals
          </h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            Search by name, specialty, or district — no login required
          </p>
        </div>
        <HeroSearch />
      </section>

      {/* ── Services grid ── */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: 32, color: '#1a1a2e' }}>
          Everything Healthcare, One App
        </h2>
        <div className="grid-4" style={{ gap: 20 }}>
          {[
            { color: '#1a6bcc', bg: 'linear-gradient(135deg, #1a6bcc, #145bb3)', icon: '💊', title: 'Medicines', desc: 'Upload prescription · Local pharmacy delivers' },
            { color: '#DC2626', bg: 'linear-gradient(135deg, #DC2626, #B91C1C)', icon: '🩸', title: 'Blood Bank', desc: 'Emergency SOS · 24/7 blood availability' },
            { color: '#2563EB', bg: 'linear-gradient(135deg, #2563EB, #1D4ED8)', icon: '🩺', title: 'Doctor', desc: 'Nearby clinics · Instant appointments' },
            { color: '#7C3AED', bg: 'linear-gradient(135deg, #7C3AED, #6D28D9)', icon: '🔬', title: 'Lab Tests', desc: 'Home sample collection · Same-day reports' },
          ].map((s) => (
            <div
              key={s.title}
              className="service-card fade-up"
              style={{ background: s.bg, boxShadow: `0 16px 40px ${s.color}40` }}
            >
              <div className="service-card-icon">{s.icon}</div>
              <div>
                <div className="service-card-title">{s.title}</div>
                <div className="service-card-subtitle">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: 48, color: '#1a1a2e' }}>How It Works</h2>
        <div className="grid-3" style={{ gap: 28 }}>
          {[
            { step: '1', icon: '📸', title: 'Upload Prescription', desc: 'Take a photo of your doctor\'s prescription or upload from gallery' },
            { step: '2', icon: '🏪', title: 'Pharmacy Accepts', desc: 'Verified local pharmacies receive your order and confirm availability' },
            { step: '3', icon: '🚴', title: 'Fast Delivery', desc: 'Get your medicines delivered to your door in 10–40 minutes' },
          ].map((step) => (
            <div key={step.step} className="glass-card" style={{ padding: '28px 24px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a6bcc, #00aaaa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, color: 'white',
                margin: '0 auto 16px', fontSize: 24,
              }}>{step.icon}</div>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(26,107,204,0.10)', borderRadius: 20,
                padding: '2px 10px', fontSize: 11, fontWeight: 800, color: '#1a6bcc',
              }}>Step {step.step}</div>
              <h3 className="h5" style={{ marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center', padding: '60px 24px 80px',
        background: 'linear-gradient(135deg, rgba(26,107,204,0.05), rgba(0,170,170,0.04))',
        borderTop: '1px solid rgba(26,107,204,0.10)',
      }}>
        <h2 className="h2" style={{ marginBottom: 12, color: '#1a1a2e' }}>Ready to get started?</h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16 }}>Join thousands of customers ordering medicines online</p>
        <Link href="/register">
          <button className="btn btn-primary btn-lg">Create Free Account →</button>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 5,
        background: 'linear-gradient(180deg, rgba(26,107,204,0.04) 0%, rgba(255,255,255,1) 100%)',
        borderTop: '1px solid #e2e8f0',
        padding: '48px 32px 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '36px 24px',
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg, #1a6bcc, #145bb3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>💊</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: '#1a1a2e' }}>FlashMed</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, maxWidth: 200 }}>
              Healthcare delivered fast. Order medicines, book lab tests, consult doctors — all in one place.
            </p>
          </div>

          {/* Legal — /delete-account, /privacy-policy, /faqs preserved */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1a6bcc', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/privacy-policy" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                Terms &amp; Conditions
              </Link>
              <Link href="/refund-policy" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                Refund Policy
              </Link>
              <Link href="/delete-account" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                Delete Account
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1a6bcc', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>Resources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://flashmed.in/articles" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                📰 Articles
              </a>
              <a href="https://flashmed.in/vlogs" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                🎬 Vlogs
              </a>
              <a href="https://flashmed.in/faqs" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                ❓ FAQs
              </a>
              <a href="https://flashmed-affiliate-web.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                🤝 Affiliate Program
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1a6bcc', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>Connect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://www.instagram.com/_flashmed?igsi=MWw4cnphMWRpd3I4Mg==" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e1306c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                <span style={{ fontSize: 16 }}>📸</span> Instagram
              </a>
              <a href="https://youtube.com/@flashmed-112?si=tQPxCiKRA6ug0jqP" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF0000')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                <span style={{ fontSize: 16 }}>▶️</span> YouTube
              </a>
              <a href="mailto:contact@flashmed.in"
                style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a6bcc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                <span style={{ fontSize: 16 }}>✉️</span> contact@flashmed.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          borderTop: '1px solid #e2e8f0',
          paddingTop: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            © 2025–2026 FlashMed · Healthcare Fast · All rights reserved
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="https://www.instagram.com/_flashmed?igsi=MWw4cnphMWRpd3I4Mg==" target="_blank" rel="noopener noreferrer"
              style={{ width: 34, height: 34, borderRadius: 10, background: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, textDecoration: 'none', transition: 'transform 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              📸
            </a>
            <a href="https://youtube.com/@flashmed-112?si=tQPxCiKRA6ug0jqP" target="_blank" rel="noopener noreferrer"
              style={{ width: 34, height: 34, borderRadius: 10, background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, textDecoration: 'none', transition: 'transform 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              ▶️
            </a>
            <a href="mailto:contact@flashmed.in"
              style={{ width: 34, height: 34, borderRadius: 10, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, textDecoration: 'none', transition: 'transform 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              ✉️
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
