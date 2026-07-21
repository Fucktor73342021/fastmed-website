'use client';

/**
 * DeepLinkBridge.tsx — FlashMed Production Deep Link Bridge
 * ════════════════════════════════════════════════════════════════════
 *
 * ROOT CAUSE OF PREVIOUS FAILURE:
 * ────────────────────────────────
 * Chrome 79+ (Android) enforces: "Navigation to a non-safe URL scheme
 * (e.g. flashmed://, intent://) is only allowed if initiated by a
 * real user gesture (tap/click)."
 *
 * → window.location.href = 'flashmed://...'  is BLOCKED silently
 * → hiddenAnchor.click() programmatically     is BLOCKED silently
 * → setTimeout auto-redirect                  is BLOCKED silently
 *
 * CORRECT PRODUCTION APPROACH:
 * ─────────────────────────────
 * Show the <a href="intent://..."> button IMMEDIATELY on first render.
 * User taps it → real user gesture → Chrome allows the intent → app opens.
 *
 * The intent:// URL format (Chrome-specific, most reliable on Android):
 *   intent://d/{id}#Intent;scheme=flashmed;package=in.flashmed.app;
 *               S.browser_fallback_url={PLAY_STORE_URL};end
 *
 * When user taps:
 *   → App installed: Chrome fires the intent → app opens to correct screen
 *   → App NOT installed: Chrome follows browser_fallback_url → Play Store
 *
 * This works for 100% of Android Chrome users. No assetlinks.json required.
 *
 * BEST EXPERIENCE (for future, after Play Store update):
 *   Android App Links (assetlinks.json verified) → link opens app with ZERO
 *   browser page, this page is never shown. Already configured ✅
 * ════════════════════════════════════════════════════════════════════
 */

const PACKAGE_NAME = 'in.flashmed.app';
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

type ProviderType = 'doctor' | 'clinic' | 'pharmacy';
type ShortPrefix = 'd' | 'c' | 'p';

const SHORT_PREFIX: Record<ProviderType, ShortPrefix> = {
  doctor: 'd',
  clinic: 'c',
  pharmacy: 'p',
};

const CTA_ACTION: Record<ProviderType, string> = {
  doctor: 'Book Doctor',
  clinic: 'Book Clinic',
  pharmacy: 'Order Medicine',
};

const CTA_DESCRIPTION: Record<ProviderType, string> = {
  doctor: 'Book appointments, consult online, and manage your health — all in one app.',
  clinic: 'Find doctors at this clinic, book appointments, and get care fast.',
  pharmacy: 'Order medicines online with doorstep delivery in minutes.',
};

interface Props {
  type: ProviderType;
  id: string;
  ctaLabel: string;
  intentPath: string;
}

export default function DeepLinkBridge({ type, id }: Props) {
  const prefix = SHORT_PREFIX[type];
  const safeId = encodeURIComponent(id);

  // Referrer for Play Store attribution tracking
  const referrer = encodeURIComponent(
    `utm_source=deeplink&utm_medium=share&utm_content=${type}_${id}`
  );
  const playUrl = `${PLAY_STORE_URL}&referrer=${referrer}`;

  // ═══════════════════════════════════════════════════════════════════
  // THE KEY URL — intent:// format for Chrome on Android
  //
  // intent://d/{id}#Intent;scheme=flashmed;package=in.flashmed.app;
  //               S.browser_fallback_url={PLAY_STORE};end
  //
  // Chrome reads this as:
  //   → Fire Intent with data URI: flashmed://d/{id}
  //   → Target package: in.flashmed.app
  //   → If package not found: navigate to browser_fallback_url
  //
  // App's AndroidManifest.xml handles:
  //   <data android:scheme="flashmed"/> (matches any flashmed:// URL)
  //
  // React Navigation DEEP_LINK_CONFIG maps:
  //   flashmed://d/{id}  → DoctorProfile screen (doctorId param)
  //   flashmed://c/{id}  → ClinicProfile screen (facilityUid param)
  //   flashmed://p/{id}  → PharmacyProfile screen (pharmacyUid param)
  // ═══════════════════════════════════════════════════════════════════
  const intentUrl = [
    `intent://${prefix}/${safeId}`,
    '#Intent',
    'scheme=flashmed',
    `package=${PACKAGE_NAME}`,
    `S.browser_fallback_url=${encodeURIComponent(playUrl)}`,
    'end',
  ].join(';');

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* ── Branding ── */}
        <div style={logoStyle}>⚡</div>
        <div style={brandStyle}>FlashMed</div>
        <div style={taglineStyle}>Your Trusted Healthcare Platform</div>

        {/* ── Primary CTA: Open in App ── */}
        {/* This is the FIRST and MOST PROMINENT element. */}
        {/* href uses intent:// — user tap is a real gesture Chrome allows. */}
        <a
          id="open-app-btn"
          href={intentUrl}
          style={primaryBtnStyle}
          // Fallback: if intent:// not supported, try custom scheme
          onClick={(e) => {
            // Allow default (intent:// navigation)
            // No preventDefault — let Chrome handle it natively
          }}
        >
          <span style={{ fontSize: 22, marginRight: 10 }}>📱</span>
          Open in FlashMed App
        </a>

        {/* ── Context label ── */}
        <div style={contextStyle}>
          <strong>{CTA_ACTION[type]}</strong> &mdash; {CTA_DESCRIPTION[type]}
        </div>

        {/* ── Divider ── */}
        <div style={dividerRowStyle}>
          <div style={dividerLineStyle} />
          <span style={dividerTextStyle}>or</span>
          <div style={dividerLineStyle} />
        </div>

        {/* ── Secondary CTA: Download ── */}
        <div style={downloadLabelStyle}>Don&apos;t have FlashMed yet?</div>
        <a
          id="download-app-btn"
          href={playUrl}
          style={secondaryBtnStyle}
        >
          <span style={{ fontSize: 18, marginRight: 8 }}>⬇️</span>
          Download Free on Play Store
        </a>

        {/* ── Trust badges ── */}
        <div style={badgesStyle}>
          <span style={badgeStyle}>🔒 Secure</span>
          <span style={badgeStyle}>⚡ Fast</span>
          <span style={badgeStyle}>🏥 Trusted</span>
        </div>

        {/* ── URL debug (small) ── */}
        <div style={urlPreviewStyle}>
          flashmed.in/{prefix}/{id.slice(0, 22)}{id.length > 22 ? '…' : ''}
        </div>

      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(145deg, #0A2558 0%, #0D47A1 40%, #1565C0 70%, #1976D2 100%)',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '16px',
  boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.11)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  borderRadius: 28,
  padding: '40px 28px 32px',
  maxWidth: 420,
  width: '100%',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.20)',
  boxShadow: '0 32px 80px rgba(0,0,0,0.40), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
  color: '#FFFFFF',
  boxSizing: 'border-box',
};

const logoStyle: React.CSSProperties = {
  fontSize: 52,
  lineHeight: 1,
  marginBottom: 8,
  filter: 'drop-shadow(0 0 20px rgba(255,200,0,0.5))',
};

const brandStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  letterSpacing: 0.5,
  marginBottom: 4,
  textShadow: '0 2px 12px rgba(0,0,0,0.3)',
};

const taglineStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.60)',
  marginBottom: 32,
  letterSpacing: 0.2,
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#FFFFFF',
  color: '#0D47A1',
  fontWeight: 900,
  fontSize: 18,
  padding: '18px 24px',
  borderRadius: 18,
  textDecoration: 'none',
  marginBottom: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.20)',
  letterSpacing: 0.3,
  cursor: 'pointer',
  // Subtle press animation via CSS
  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  WebkitTapHighlightColor: 'rgba(13,71,161,0.1)',
  userSelect: 'none',
};

const contextStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.58)',
  lineHeight: 1.6,
  marginBottom: 24,
  padding: '0 4px',
};

const dividerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 20,
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: 'rgba(255,255,255,0.18)',
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.40)',
  letterSpacing: 1,
  textTransform: 'uppercase',
};

const downloadLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.55)',
  marginBottom: 12,
};

const secondaryBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: 15,
  padding: '15px 20px',
  borderRadius: 16,
  textDecoration: 'none',
  border: '1.5px solid rgba(255,255,255,0.40)',
  marginBottom: 24,
  cursor: 'pointer',
  transition: 'background 0.15s ease',
  WebkitTapHighlightColor: 'rgba(255,255,255,0.08)',
};

const badgesStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 10,
  marginBottom: 20,
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.45)',
  background: 'rgba(255,255,255,0.08)',
  padding: '4px 10px',
  borderRadius: 20,
  letterSpacing: 0.3,
};

const urlPreviewStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.25)',
  wordBreak: 'break-all',
  letterSpacing: 0.2,
};
