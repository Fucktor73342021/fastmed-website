import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// force-dynamic: article detail pages fetch live data per request.
// ISR was causing 404s during Vercel build when Railway backend was unreachable.
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
  try {
    const res = await fetch(`${SERVER_API}/api/marketing/articles/${slugOrId}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
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
    title: `${article.title} | FlashMed`,
    description,
    // Canonical URL — tells Google the definitive URL for this page
    alternates: {
      canonical: canonicalUrl,
    },
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
  // This ensures only one URL is indexed by Google
  if (article.slug && slug !== article.slug) {
    redirect(`/articles/${article.slug}`);
  }

  const canonicalSlug = article.slug || article.id;
  const canonicalUrl = `${SITE_URL}/articles/${canonicalSlug}`;
  const bodyWithLinks = applyLinkedWords(article.body, article.keywords);

  // JSON-LD structured data — makes Google show rich results (author, date, image)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.body.replace(/<[^>]*>/g, '').substring(0, 155),
    image: article.photos?.[0] || `${SITE_URL}/og-default.png`,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FlashMed',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/icon-192.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    keywords: [article.category, 'health', 'medicine', 'pharmacy', 'FlashMed'].join(', '),
    articleSection: article.category,
    inLanguage: 'en-IN',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* JSON-LD Structured Data — parsed by Google for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {/* Article */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Breadcrumb — helps Google understand page hierarchy */}
        <nav aria-label="breadcrumb" style={{ marginBottom: 24, fontSize: 13, color: '#475569' }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/articles" style={{ color: '#64748b', textDecoration: 'none' }}>Articles</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#94a3b8' }}>{article.title}</span>
        </nav>

        {/* Category + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{
            background: `${CATEGORY_COLORS[article.category] || '#64748b'}20`,
            color: CATEGORY_COLORS[article.category] || '#94a3b8',
            border: `1px solid ${CATEGORY_COLORS[article.category] || '#64748b'}40`,
            padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
          }}>{article.category}</span>
          <time dateTime={article.publishedAt} style={{ color: '#475569', fontSize: 13 }}>
            {formatDate(article.publishedAt)}
          </time>
        </div>

        {/* Title — single H1 per page, contains the keyword */}
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.25, margin: '0 0 20px' }}>
          {article.title}
        </h1>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {article.authorName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>By {article.authorName}</span>
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <span style={{ display: 'block', color: '#475569', fontSize: 12, marginTop: 2 }}>
                Updated {formatDate(article.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Hero Image — width/height prevents layout shift (Core Web Vitals) */}
        {article.photos?.[0] && (
          <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 36 }}>
            <img
              src={article.photos[0]}
              alt={article.title}
              width={800}
              height={460}
              style={{ width: '100%', height: 'auto', maxHeight: 460, objectFit: 'cover', display: 'block' }}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        )}

        {/* Body */}
        <div
          style={{ color: '#cbd5e1', fontSize: 17, lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: bodyWithLinks }}
        />

        {/* Additional Images */}
        {article.photos?.length > 1 && (
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
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
            background: 'rgba(16,185,129,0.1)', color: '#10b981',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10,
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
  );
}
