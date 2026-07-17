import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — FlashMed',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1117 0%, #0f1b2d 100%)',
      color: 'white', fontFamily: 'system-ui, sans-serif', padding: '0 24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 90, marginBottom: 8, fontWeight: 900, background: 'linear-gradient(135deg, #059669, #2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>Page not found</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 36, lineHeight: 1.6 }}>
          Looks like this page went on an express delivery and never came back!
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/home">
            <button style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 28px', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
              🏠 Go Home
            </button>
          </Link>
          <Link href="/">
            <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
              Landing Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
