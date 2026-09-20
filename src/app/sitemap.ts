import type { MetadataRoute } from 'next';

const BASE = 'https://flashmed.in';
const SERVER_API = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';

interface ContentItem {
  id: string;
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
}

async function fetchAllContent(type: 'articles' | 'vlogs' | 'faqs'): Promise<ContentItem[]> {
  try {
    // Fetch up to 200 items per type — covers most sites comfortably
    const res = await fetch(`${SERVER_API}/api/marketing/${type}?limit=200&page=1`, {
      next: { revalidate: 3600 }, // cache sitemap data for 1 hour
      headers: { 'Accept': 'application/json', 'User-Agent': 'FlashMed-Sitemap/1.0' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function fetchAllDoctors(): Promise<ContentItem[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/doctors`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json', 'User-Agent': 'FlashMed-Sitemap/1.0' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.doctors) ? json.doctors : [];
  } catch {
    return [];
  }
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/doctors`,                     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/articles`,                    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/vlogs`,                       lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/faqs`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/privacy-policy`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms-and-conditions`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/refund-policy`,               lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/rider-privacy-policy`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/delete-account`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    // Legacy duplicates (keep so old indexed URLs redirect properly)
    { url: `${BASE}/privacypolicy`,               lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/termsandconditions`,          lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/paymentandrefundpolicy`,      lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // ── Dynamic content — fetch from API ────────────────────────────────────
  const [articles, vlogs, faqs, doctors] = await Promise.all([
    fetchAllContent('articles'),
    fetchAllContent('vlogs'),
    fetchAllContent('faqs'),
    fetchAllDoctors(),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    // Use slug if available (SEO-friendly), fall back to id for old articles
    url: `${BASE}/articles/${a.slug || a.id}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : (a.publishedAt ? new Date(a.publishedAt) : now),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const vlogEntries: MetadataRoute.Sitemap = vlogs.map((v) => ({
    url: `${BASE}/vlogs/${v.slug || v.id}`,
    lastModified: v.updatedAt ? new Date(v.updatedAt) : (v.publishedAt ? new Date(v.publishedAt) : now),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const faqEntries: MetadataRoute.Sitemap = faqs.map((f) => ({
    url: `${BASE}/faqs/${f.slug || f.id}`,
    lastModified: f.updatedAt ? new Date(f.updatedAt) : (f.publishedAt ? new Date(f.publishedAt) : now),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const doctorEntries: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${BASE}/doctors/${d.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticPages, ...articleEntries, ...vlogEntries, ...faqEntries, ...doctorEntries];
}

