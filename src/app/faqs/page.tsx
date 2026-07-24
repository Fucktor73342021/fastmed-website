import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs | FlashMed — Frequently Asked Questions',
  description: 'Find answers to common questions about FlashMed — medicine delivery, doctor bookings, pharmacy, prescriptions, and more.',
  openGraph: {
    title: 'FAQs | FlashMed',
    description: 'Frequently asked questions about FlashMed services.',
    siteName: 'FlashMed',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

interface FAQ {
  id: string;
  title: string;
  category: string;
  shortAnswer: string;
  body: string;
  authorName: string;
  publishedAt: string;
}

async function fetchFaqs(): Promise<{ data: FAQ[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/marketing/faqs?limit=50`, {
      next: { revalidate: 0 },
      cache: 'no-store',
    });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch {
    return { data: [] };
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  pharmacy: '💊 Pharmacy',
  doctor: '👨‍⚕️ Doctors',
  lab: '🔬 Lab Tests',
  delivery: '🚚 Delivery',
  payment: '💳 Payment',
  account: '👤 Account',
  general: '❓ General',
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default async function FaqsPage() {
  const { data: faqs } = await fetchFaqs();

  // Group FAQs by category
  const grouped: Record<string, FAQ[]> = {};
  faqs.forEach(faq => {
    const cat = faq.category || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(faq);
  });

  const categories = Object.keys(grouped).sort();

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
            <Link href="/vlogs" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Vlogs</Link>
            <Link href="/faqs" style={{ color: '#10b981', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>FAQs</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: '64px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 16, border: '1px solid rgba(124,58,237,0.2)' }}>
          ❓ FAQs
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
          Got Questions? We Have Answers.
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
          Everything you need to know about FlashMed — medicines, doctors, labs, and delivery.
        </p>
      </div>

      {/* FAQs Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        {faqs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>No FAQs published yet</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Our team is working on answering your most common questions.</p>
          </div>
        ) : (
          <>
            {/* Category Jump Links */}
            {categories.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                {categories.map(cat => (
                  <a key={cat} href={`#cat-${cat}`} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8', padding: '8px 16px', borderRadius: 100,
                    fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    {CATEGORY_LABELS[cat] || cat}
                  </a>
                ))}
              </div>
            )}

            {/* FAQs by Category */}
            {categories.map(cat => (
              <section key={cat} id={`cat-${cat}`} style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {CATEGORY_LABELS[cat] || cat}
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', fontSize: 12, padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>{grouped[cat].length}</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {grouped[cat].map((faq, i) => (
                    <details key={faq.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, overflow: 'hidden',
                    }}>
                      <summary style={{
                        padding: '18px 20px', cursor: 'pointer', listStyle: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        color: '#f1f5f9', fontWeight: 600, fontSize: 15,
                        userSelect: 'none',
                      }}>
                        <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ color: '#10b981', fontSize: 13, fontWeight: 700, minWidth: 24 }}>Q{(i + 1).toString().padStart(2, '0')}</span>
                          {faq.title}
                        </span>
                        <span style={{ color: '#64748b', fontSize: 18, flexShrink: 0, marginLeft: 16 }}>+</span>
                      </summary>
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {faq.shortAnswer && (
                          <p style={{ color: '#10b981', fontSize: 15, fontWeight: 600, margin: '16px 0 8px', lineHeight: 1.6 }}>
                            {faq.shortAnswer}
                          </p>
                        )}
                        {faq.body && (
                          <div
                            style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginTop: faq.shortAnswer ? 8 : 16 }}
                            dangerouslySetInnerHTML={{ __html: faq.body }}
                          />
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 64, padding: 32, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(5,150,105,0.1), rgba(4,120,87,0.05))',
          border: '1px solid rgba(5,150,105,0.2)', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Still have questions?</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 20px' }}>Our support team is available 24/7 through the FlashMed app.</p>
          <Link href="/" style={{
            display: 'inline-block', padding: '12px 28px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff', borderRadius: 10, textDecoration: 'none',
            fontWeight: 700, fontSize: 15,
          }}>
            Download the App →
          </Link>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>© {new Date().getFullYear()} FlashMed. All rights reserved. | <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>Home</Link></p>
      </footer>
    </div>
  );
}
