'use client';
import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Could send to Sentry/LogRocket here
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2 className="h3" style={{ marginBottom: 12 }}>Oops! Something broke</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
          This section encountered an error. Your data is safe.
          {error.digest && <><br /><span style={{ fontSize: 11 }}>Ref: {error.digest}</span></>}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>
            🔄 Try Again
          </button>
          <a href="/home"><button className="btn btn-secondary">🏠 Home</button></a>
        </div>
      </div>
    </div>
  );
}
