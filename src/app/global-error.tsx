'use client';
import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0d1117', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#9CA3AF', marginBottom: 32, lineHeight: 1.6 }}>
            An unexpected error occurred. Our team has been notified and is working to fix it.
            {error.digest && <><br /><span style={{ fontSize: 12, opacity: 0.6 }}>Error ID: {error.digest}</span></>}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 28px', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}
            >
              Try Again
            </button>
            <a href="/">
              <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                Go Home
              </button>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
