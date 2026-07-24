import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const SERVER_API = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
const SITE_URL = 'https://flashmed.in';

interface Article {
  id: string;
  slug?: string;
  title: string;
  category: string;
  body: string;
  photos: string[];
  authorName: string;
  publishedAt: string;
  updatedAt?: string;
  keywords?: { word: string; url: string }[];
}

async function fetchArticle(slugOrId: string): Promise<Article | null> {
  const url = `${SERVER_API}/api/marketing/articles/${slugOrId}`;
  // Retry once — Railway may be cold-starting
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        console.error(`[Article] Attempt ${attempt}: ${url} → HTTP ${res.status}`);
        if (attempt === 2) return null;
        continue;
      }
      const json = await res.json();
      return json.data || json;
    } catch (err) {
      console.error(`[Article] Attempt ${attempt}: fetch failed for ${url}:`, err);
      if (attempt === 2) return null;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return null;
}

// ── Metadata (for Google's title/description in search results) ─────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return { title: 'Article Not Found | FlashMed' };
  }

  const plainText = article.body.replace(/<[^>]*>/g, '').trim();
  const description = plainText.substring(0, 155);
  const canonicalSlug = article.slug || article.id;
  const canonicalUrl = `${SITE_URL}/articles/${canonicalSlug}`;
  const ogImage = article.photos?.[0] || `${SITE_URL}/og-default.png`;

  return {
    title: article.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title,
      description,
      siteName: 'FlashMed',
      type: 'article',
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.authorName],
      tags: [article.category, 'health', 'medicine', 'pharmacy'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [ogImage],
    },
  };
}

// ── Helper: apply linked words ───────────────────────────────────────────────
function applyLinkedWords(html: string, keywords?: { word: string; url: string }[]): string {
  if (!keywords?.length) return html;
  let result = html;
  for (const { word, url } of keywords) {
    if (!word || !url) continue;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![\"'>])\\b${escaped}\\b(?![^<]*>)`, 'gi');
    result = result.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#10b981;text-decoration:underline;font-weight:600;">${word}</a>`);
  }
  return result;
}

const CATEGORY_COLORS: Record<string, string> = {
  pharmacy: '#059669', doctor: '#2563eb', lab: '#7c3aed',
  health: '#dc2626', wellness: '#d97706', general: '#64748b',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Page Component ───────────────────────────────────────────────────────────

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) notFound();

  // If someone visits /articles/<cuid>, redirect to the canonical slug URL
  if (article.slug && slug !== article.slug) {
    redirect(`/articles/${article.slug}`);
  }

  const canonicalSlug = article.slug || article.id;
  const canonicalUrl = `${SITE_URL}/articles/${canonicalSlug}`;
  const bodyWithLinks = applyLinkedWords(article.body, article.keywords);

  const plainText = article.body.replace(/<[^>]*>/g, '').trim();
  const description = plainText.substring(0, 155);
  const ogImage = article.photos?.[0] || `${SITE_URL}/og-default.png`;

  // JSON-LD structured data — Google reads this from body fine per their documentation
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    image: ogImage,
    author: { '@type': 'Person', name: article.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'FlashMed',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-192.png` },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url: canonicalUrl,
    keywords: [article.category, 'health', 'medicine', 'pharmacy', 'FlashMed'].join(', '),
    articleSection: article.category,
    inLanguage: 'en-IN',
  };

  const catColor = CATEGORY_COLORS[article.category] || '#64748b';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

        {/* Header */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,15,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>F</span>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>FlashMed</span>
            </Link>
            <nav style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
              <Link href="/articles" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Articles</Link>
              <Link href="/vlogs" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Vlogs</Link>
              <Link href="/faqs" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>FAQs</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        {article.photos?.[0] && (
          <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden', position: 'relative' }}>
            <img
              src={article.photos[0]}
              alt={article.title}
              width={1200}
              height={420}
              style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
              priority-fetch="high"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,15,26,0.95))' }} />
          </div>
        )}

        {/* Content */}
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Category + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44`,
              padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {article.category}
            </span>
            {article.publishedAt && (
              <span style={{ color: '#64748b', fontSize: 13 }}>
                📅 {formatDate(article.publishedAt)}
              </span>
            )}
            {article.authorName && (
              <span style={{ color: '#64748b', fontSize: 13 }}>
                ✍️ {article.authorName}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#f8fafc',
            lineHeight: 1.2, marginBottom: 28, letterSpacing: '-0.02em',
          }}>
            {article.title}
          </h1>

          {/* Description */}
          {description && (
            <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, borderLeft: `3px solid ${catColor}`, paddingLeft: 16 }}>
              {description}
            </p>
          )}

          {/* Body */}
          <article
            dangerouslySetInnerHTML={{ __html: bodyWithLinks }}
            style={{
              color: '#cbd5e1', lineHeight: 1.85, fontSize: 17,
              ['--tw-prose-headings' as string]: '#f8fafc',
            }}
          />

          {/* Extra Photos */}
          {article.photos && article.photos.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 48 }}>
              {article.photos.slice(1).map((photo, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <img
                    src={photo}
                    alt={`${article.title} — image ${i + 2}`}
                    width={240}
                    height={200}
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Back Link */}
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Link href="/articles" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981', borderRadius: 10,
              padding: '12px 24px', textDecoration: 'none', fontWeight: 600, fontSize: 14,
            }}>
              ← Back to Articles
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
          <p>© {new Date().getFullYear()} FlashMed. All rights reserved. | <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link></p>
        </footer>
      </div>
    </>
  );
}
