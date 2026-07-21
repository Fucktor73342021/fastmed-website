'use client';

/**
 * DeepLinkBridge.tsx — FlashMed
 * ════════════════════════════════════════════════════════════════════
 *
 * Production-grade deep-link bridge page served from flashmed.in
 *
 * HOW IT WORKS:
 * ─────────────
 * When Android App Links verification passes (correct fingerprint in assetlinks.json):
 *   → Android intercepts the URL BEFORE the browser opens → app opens directly
 *   → This page is NEVER shown.
 *
 * When verification fails OR user is on a device without the app:
 *   → Browser shows this page
 *   → JS immediately fires intent://... URL (package-name based, no assetlinks needed)
 *   → If FlashMed app installed → opens directly to the correct profile screen
 *   → If NOT installed → auto-redirects to Play Store
 *   → Manual buttons are also shown after 2 seconds as fallback
 */

import { useEffect, useState } from 'react';

const PACKAGE_NAME   = 'in.flashmed.app';
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

type ProviderType = 'doctor' | 'clinic' | 'pharmacy';

interface Props {
  type: ProviderType;
  id: string;
  ctaLabel: string;
  intentPath: string; // e.g. "doctor/abc123"
}

function getInstallLabel(type: ProviderType): string {
  switch (type) {
    case 'doctor':   return 'book this doctor';
    case 'clinic':   return 'book at this clinic';
    case 'pharmacy': return 'order from this pharmacy';
  }
}

export default function DeepLinkBridge({ type, id, ctaLabel, intentPath }: Props) {
  const [showFallback, setShowFallback] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isiOS     = /iphone|ipad|ipod/.test(ua);

    if (isAndroid) setDeviceType('android');
    else if (isiOS) setDeviceType('ios');
    else            setDeviceType('other');

    const referrer  = encodeURIComponent(
      `utm_source=deeplink&utm_medium=share&utm_content=${type}_${id}`
    );
    const playUrl   = `${PLAY_STORE_URL}&referrer=${referrer}`;
    const intentUrl = `intent://${intentPath}#Intent;scheme=flashmed;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;
    const customUrl = `flashmed://${intentPath}`;

    if (isAndroid) {
      // intent:// opens app via package name — no assetlinks.json required
      // browser_fallback_url kicks in automatically if app is not installed
      try { window.location.href = intentUrl; } catch (_) {}
      // Show manual button after 2.5 s in case auto-redirect stalls
      setTimeout(() => setShowFallback(true), 2500);
    } else if (isiOS) {
      try { window.location.href = customUrl; } catch (_) {}
      setTimeout(() => setShowFallback(true), 1500);
    } else {
      // Desktop — just show the Play Store button
      setShowFallback(true);
    }
  }, [id, intentPath, type]);

  const referrer  = encodeURIComponent(
    `utm_source=deeplink&utm_medium=share&utm_content=${type}_${id}`
  );
  const playUrl   = `${PLAY_STORE_URL}&referrer=${referrer}`;
  const intentUrl = `intent://${intentPath}#Intent;scheme=flashmed;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 24,
        padding: '40px 28px',
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        color: '#fff',
      }}>
        {/* Branding */}
        <div style={{ fontSize: 52, marginBottom: 8 }}>⚡</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 1, marginBottom: 4 }}>
          FlashMed
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>
          Your Trusted Healthcare Platform
        </div>

        {/* Spinner / Status */}
        {!showFallback ? (
          <>
            <div style={{
              width: 48, height: 48,
              border: '4px solid rgba(255,255,255,0.25)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite',
              margin: '0 auto 20px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
              Opening app…
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              {ctaLabel}
            </div>
          </>
        ) : (
          <>
            {/* Primary CTA — open/install app */}
            {deviceType === 'android' && (
              <a
                href={intentUrl}
                style={{
                  display: 'block',
                  background: '#FFFFFF',
                  color: '#1565C0',
                  fontWeight: 900,
                  fontSize: 17,
                  padding: '18px 20px',
                  borderRadius: 16,
                  textDecoration: 'none',
                  marginBottom: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  letterSpacing: 0.3,
                }}
              >
                📱 Open in FlashMed App
              </a>
            )}

            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              {deviceType === 'android'
                ? 'App not installed?'
                : deviceType === 'ios'
                ? 'FlashMed is available on Android'
                : 'Get FlashMed on Android'}
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.65)',
              marginBottom: 20, lineHeight: 1.5,
            }}>
              {deviceType === 'android'
                ? `Install the free app to ${getInstallLabel(type)} and much more!`
                : 'Download for free from the Google Play Store.'}
            </div>

            <a
              href={playUrl}
              style={{
                display: 'block',
                background: 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                padding: '15px 20px',
                borderRadius: 16,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.45)',
                marginBottom: 0,
              }}
            >
              ⬇️ Download FlashMed Free
            </a>

            {/* URL preview */}
            <div style={{
              marginTop: 24,
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 10,
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}>
              🌐 flashmed.in/{type === 'doctor' ? 'd' : type === 'clinic' ? 'c' : 'p'}/{id.slice(0, 20)}…
            </div>
          </>
        )}
      </div>
    </div>
  );
}
