import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Vlogs | FlashMed',
  description: 'Watch health vlogs and medical video content from the FlashMed team. Pharmacy tips, doctor advice, and wellness guides.',
  openGraph: {
    title: 'Health Vlogs | FlashMed',
    description: 'Health and medical video content from FlashMed.',
    siteName: 'FlashMed',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

interface Vlog {
  id: string;
  title: string;
  category: string;
  body: string;
  url: string;
  photos: string[];
  authorName: string;
  publishedAt: string;
}

async function fetchVlogs(page = 1): Promise<{ data: Vlog[]; meta: { total: number; totalPages: number } }> {
  const serverApiUrl = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
  try {
    const res = await fetch(`${serverApiUrl}/api/marketing/vlogs?page=${page}&limit=12`, {
      next: { revalidate: 0 },
      cache: 'no-store',
    });
    if (!res.ok) return { data: [], meta: { total: 0, totalPages: 0 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default async function VlogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const { data: vlogs, meta } = await fetchVlogs(page);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,15,26,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #059669, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>FlashMed</span>
          </Link>
          <nav style={{ display: 'flex', gap: 24 }}>
            <Link href="/articles" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Articles</Link>
            <Link href="/vlogs" style={{ color: '#10b981', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Vlogs</Link>
            <Link href="/faqs" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>FAQs</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: '64px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.1)', color: '#60a5fa', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 16, border: '1px solid rgba(37,99,235,0.2)' }}>
          🎬 Health Vlogs
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
          Watch. Learn. Stay Healthy.
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
          Video guides on medicine, pharmacy, and wellness from our expert team.
        </p>
      </div>

      {/* Vlogs Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {vlogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>No vlogs published yet</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Check back soon — new video content coming!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {vlogs.map((vlog) => {
              const ytId = getYouTubeId(vlog.url || '');
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : vlog.photos?.[0];
              return (
                <article key={vlog.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, overflow: 'hidden',
                }}>
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#1e293b', cursor: 'pointer' }}
                    onClick={() => vlog.url && window.open(vlog.url, '_blank')}>
                    {thumb ? (
                      <img src={thumb} alt={vlog.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🎬</div>
                    )}
                    {vlog.url && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{vlog.category}</span>
                      <span style={{ color: '#475569', fontSize: 12, marginLeft: 'auto' }}>{formatDate(vlog.publishedAt)}</span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.4 }}>{vlog.title}</h2>
                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>By {vlog.authorName}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
            {page > 1 && (
              <Link href={`/vlogs?page=${page - 1}`} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: 8, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>← Previous</Link>
            )}
            <span style={{ padding: '10px 20px', color: '#64748b', fontSize: 14 }}>Page {page} of {meta.totalPages}</span>
            {page < meta.totalPages && (
              <Link href={`/vlogs?page=${page + 1}`} style={{ padding: '10px 20px', background: 'rgba(37,99,235,0.1)', color: '#60a5fa', borderRadius: 8, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(37,99,235,0.2)' }}>Next →</Link>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>© {new Date().getFullYear()} FlashMed. All rights reserved. | <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link></p>
      </footer>
    </div>
  );
}
