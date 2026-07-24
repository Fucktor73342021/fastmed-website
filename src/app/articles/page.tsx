import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Articles | FlashMed',
  description: 'Read the latest health articles, tips, and medical insights from the FlashMed team. Stay informed about pharmacy, doctors, labs, and wellness.',
  openGraph: {
    title: 'Health Articles | FlashMed',
    description: 'Latest health articles from FlashMed — your trusted medical delivery platform.',
    siteName: 'FlashMed',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

interface Article {
  id: string;
  title: string;
  category: string;
  body: string;
  photos: string[];
  authorName: string;
  publishedAt: string;
}

async function fetchArticles(page = 1): Promise<{ data: Article[]; meta: { total: number; totalPages: number } }> {
  // Use direct Railway URL server-side to bypass Cloudflare bot protection
  // BACKEND_URL = direct Railway URL (no CF proxy); fallback to api.flashmed.in
  const serverApiUrl = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
  try {
    const res = await fetch(`${serverApiUrl}/api/marketing/articles?page=${page}&limit=12`, {
      next: { revalidate: 0 },
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FlashMed-Web/1.0 (+https://flashmed.in)',
        'X-Requested-From': 'flashmed-patient-web',
      },
    });
    if (!res.ok) {
      console.error(`[Articles] API returned ${res.status}: ${await res.text().catch(() => '')}`);
      return { data: [], meta: { total: 0, totalPages: 0 } };
    }
    const json = await res.json();
    console.log(`[Articles] Fetched ${json.data?.length ?? 0} articles from DB`);
    return json;
  } catch (err: unknown) {
    console.error('[Articles] Fetch error:', err instanceof Error ? err.message : String(err));
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').slice(0, 180).trim();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  pharmacy: '#059669',
  doctor: '#2563eb',
  lab: '#7c3aed',
  health: '#dc2626',
  wellness: '#d97706',
  general: '#64748b',
};

export default async function ArticlesPage() {
  const { data: articles, meta } = await fetchArticles(1);

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
            <Link href="/articles" style={{ color: '#10b981', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Articles</Link>
            <Link href="/vlogs" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Vlogs</Link>
            <Link href="/faqs" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>FAQs</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: '64px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
          📝 Health Articles
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
          Stay Informed, Stay Healthy
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
          Expert health tips, pharmacy guides, and medical insights from the FlashMed team.
        </p>
      </div>

      {/* Articles Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>No articles published yet</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Check back soon — our team publishes new content daily!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {articles.map((article) => (
              <article key={article.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                {article.photos?.[0] && (
                  <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
                    <img src={article.photos[0]} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      background: `${CATEGORY_COLORS[article.category] || '#64748b'}20`,
                      color: CATEGORY_COLORS[article.category] || '#94a3b8',
                      border: `1px solid ${CATEGORY_COLORS[article.category] || '#64748b'}40`,
                      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    }}>{article.category}</span>
                    <span style={{ color: '#475569', fontSize: 12, marginLeft: 'auto' }}>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
                    {stripHtml(article.body)}…
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569', fontSize: 12 }}>By {article.authorName}</span>
                    <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>Read more →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
            {page > 1 && (
              <Link href={`/articles?page=${page - 1}`} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: 8, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
                ← Previous
              </Link>
            )}
            <span style={{ padding: '10px 20px', color: '#64748b', fontSize: 14 }}>
              Page {page} of {meta.totalPages}
            </span>
            {page < meta.totalPages && (
              <Link href={`/articles?page=${page + 1}`} style={{ padding: '10px 20px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 8, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(16,185,129,0.2)' }}>
                Next →
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>© {new Date().getFullYear()} FlashMed. All rights reserved. | <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link></p>
      </footer>
    </div>
  );
}
