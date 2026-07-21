'use client';

/**
 * DeepLinkBridge.tsx — FlashMed Production Deep Link Bridge
 * ════════════════════════════════════════════════════════════════════
 *
 * MULTI-STRATEGY APPROACH (2026 production-grade):
 *
 * Strategy 1 — Android App Links (BEST):
 *   When assetlinks.json verification passes, Android intercepts
 *   https://flashmed.in/d/{id} BEFORE this page ever loads.
 *   This page is never shown. Zero friction.
 *
 * Strategy 2 — Custom scheme via <a> click (WORKS WITHOUT assetlinks):
 *   window.location.href = 'flashmed://d/3852d613...'
 *   The app manifest declares scheme=flashmed → Android opens app directly.
 *   NO assetlinks.json verification needed.
 *   This fires on page load automatically.
 *
 * Strategy 3 — intent:// URL (Chrome-specific fallback):
 *   intent://d/3852d613#Intent;scheme=flashmed;package=in.flashmed.app;end
 *   Chrome handles this and launches the matching app.
 *
 * Strategy 4 — Manual "Open in App" button:
 *   Shown after 2.5s if app-open didn't happen (means app not installed).
 *
 * WHY STRATEGY 2 IS THE KEY FIX:
 *   The custom scheme 'flashmed://d/3852d613...' maps directly to:
 *     DEEP_LINK_CONFIG: { path: 'd/:doctorId' }
 *   which React Navigation handles natively — no assetlinks needed.
 *   Previously we were using 'flashmed://doctor/ID' which mapped to
 *   DoctorProfile2 (alias screen) — now we use 'd/ID' which maps
 *   directly to DoctorProfile (primary screen), more reliable.
 */

import { useEffect, useRef, useState } from 'react';

const PACKAGE_NAME   = 'in.flashmed.app';
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

type ProviderType = 'doctor' | 'clinic' | 'pharmacy';
// Short path prefix as used in HTTPS URL and deep link config
type ProviderPrefix = 'd' | 'c' | 'p';

const PREFIX_MAP: Record<ProviderType, ProviderPrefix> = {
  doctor: 'd',
  clinic: 'c',
  pharmacy: 'p',
};

const LABEL_MAP: Record<ProviderType, string> = {
  doctor:   'book this doctor',
  clinic:   'book at this clinic',
  pharmacy: 'order from this pharmacy',
};

interface Props {
  type: ProviderType;
  id: string;
  ctaLabel: string;
  intentPath: string; // UNUSED — kept for API compat, we compute URLs internally now
}

export default function DeepLinkBridge({ type, id, ctaLabel }: Props) {
  const [phase, setPhase] = useState<'loading' | 'fallback'>('loading');
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'other'>('other');
  const hiddenLinkRef = useRef<HTMLAnchorElement>(null);

  // The SHORT prefix path ('d', 'c', 'p') matches the React Navigation
  // DEEP_LINK_CONFIG: { path: 'd/:doctorId' } etc.
  // This is what the app is ACTUALLY configured to handle.
  const prefix = PREFIX_MAP[type];
  const safeId = encodeURIComponent(id);

  // Custom scheme: flashmed://d/3852d613...
  // Matches AndroidManifest: android:scheme="flashmed"
  // Matches DEEP_LINK_CONFIG: path: 'd/:doctorId'
  const customSchemeUrl = `flashmed://${prefix}/${safeId}`;

  // Referrer for Play Store attribution
  const referrer = encodeURIComponent(
    `utm_source=deeplink&utm_medium=share&utm_content=${type}_${id}`
  );
  const playUrl = `${PLAY_STORE_URL}&referrer=${referrer}`;

  // intent:// for Chrome — secondary strategy
  // Note: browser_fallback_url points to Play Store (not our page, avoids loops)
  const intentUrl = `intent://${prefix}/${safeId}#Intent;scheme=flashmed;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playUrl)};end`;

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isiOS     = /iphone|ipad|ipod/.test(ua);

    if (isAndroid) setDeviceType('android');
    else if (isiOS) setDeviceType('ios');
    else            setDeviceType('other');

    if (isAndroid) {
      // ──── Strategy A: custom scheme via location change ────
      // Works with ANY browser on Android (Chrome, Firefox, Samsung).
      // Android routes flashmed:// to registered app immediately.
      // If app is NOT installed: Android shows "No app found" briefly,
      // then our setTimeout fallback catches it.
      try {
        window.location.href = customSchemeUrl;
      } catch (_) { /* silent */ }

      // ──── Strategy B: intent:// via hidden anchor click ────
      // Chrome-specific. Belt-and-suspenders after Strategy A.
      // Fires 100ms later to give Strategy A a chance first.
      const intentTimer = setTimeout(() => {
        try {
          if (hiddenLinkRef.current) {
            hiddenLinkRef.current.click();
          }
        } catch (_) { /* silent */ }
      }, 100);

      // ──── Show manual fallback buttons after 2.5s ────
      // If we're still here after 2.5s, the app is not installed.
      const fallbackTimer = setTimeout(() => setPhase('fallback'), 2500);

      return () => {
        clearTimeout(intentTimer);
        clearTimeout(fallbackTimer);
      };
    } else if (isiOS) {
      // iOS custom scheme
      try { window.location.href = customSchemeUrl; } catch (_) {}
      const t = setTimeout(() => setPhase('fallback'), 1500);
      return () => clearTimeout(t);
    } else {
      // Desktop
      setPhase('fallback');
    }
  }, [customSchemeUrl, intentUrl]);

  return (
    <>
      {/* Hidden anchor for intent:// — clicked programmatically */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a
        ref={hiddenLinkRef}
        href={intentUrl}
        style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.13)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 28,
          padding: '44px 32px',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 28px 72px rgba(0,0,0,0.35)',
          color: '#fff',
          boxSizing: 'border-box',
        }}>

          {/* Brand */}
          <div style={{ fontSize: 56, marginBottom: 8, lineHeight: 1 }}>⚡</div>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
            FlashMed
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginBottom: 36, lineHeight: 1.4 }}>
            Your Trusted Healthcare Platform
          </div>

          {phase === 'loading' ? (
            /* ── Loading phase: opening app ── */
            <>
              <Spinner />
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>
                Opening FlashMed…
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {ctaLabel}
              </div>
              {deviceType === 'android' && (
                <div style={{ marginTop: 28 }}>
                  <a
                    href={customSchemeUrl}
                    style={btnStyle}
                    onClick={(e) => {
                      // If user taps this during loading phase, try again
                      e.preventDefault();
                      window.location.href = customSchemeUrl;
                    }}
                  >
                    Tap to Open App
                  </a>
                </div>
              )}
            </>
          ) : (
            /* ── Fallback phase: app not installed or wrong OS ── */
            <>
              {deviceType === 'android' && (
                <>
                  <a href={customSchemeUrl} style={btnStyle}>
                    📱 Open in FlashMed App
                  </a>
                  <div style={dividerStyle}>already have the app? tap above</div>
                </>
              )}

              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                {deviceType === 'android'
                  ? `Download to ${LABEL_MAP[type]}`
                  : deviceType === 'ios'
                  ? 'FlashMed is on Android'
                  : 'Get FlashMed'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 22, lineHeight: 1.5 }}>
                {deviceType === 'android'
                  ? 'Install the free app to ' + LABEL_MAP[type] + ' and much more!'
                  : 'Download for free from the Google Play Store.'}
              </div>

              <a href={playUrl} style={outlineBtnStyle}>
                ⬇️ Download FlashMed Free
              </a>

              {/* URL debug preview */}
              <div style={{
                marginTop: 24,
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.18)',
                borderRadius: 10,
                fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}>
                🔗 flashmed.in/{prefix}/{id.slice(0, 18)}…
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <>
      <style>{`
        @keyframes fm-spin { to { transform: rotate(360deg); } }
        .fm-spinner {
          width: 48px; height: 48px;
          border: 4px solid rgba(255,255,255,0.25);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: fm-spin 0.85s linear infinite;
          margin: 0 auto 22px;
        }
      `}</style>
      <div className="fm-spinner" />
    </>
  );
}

const btnStyle: React.CSSProperties = {
  display: 'block',
  background: '#FFFFFF',
  color: '#1565C0',
  fontWeight: 900,
  fontSize: 17,
  padding: '18px 24px',
  borderRadius: 18,
  textDecoration: 'none',
  marginBottom: 14,
  boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
  letterSpacing: 0.2,
  cursor: 'pointer',
};

const outlineBtnStyle: React.CSSProperties = {
  display: 'block',
  background: 'transparent',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: 15,
  padding: '15px 20px',
  borderRadius: 16,
  textDecoration: 'none',
  border: '2px solid rgba(255,255,255,0.42)',
};

const dividerStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.38)',
  marginBottom: 18,
  letterSpacing: 0.3,
};
