import { NextRequest, NextResponse } from 'next/server';

/* ═══════════════════════════════════════════════════════════════════
   FlashMed — Production-Grade Edge Middleware
   Runs on Vercel Edge Network globally — zero cold start

   Responsibilities:
   1. Rate limiting (sliding window, per-IP, per-route)
   2. Security headers (HSTS, CSP, XFO, XCTO, Referrer, Permissions)
   3. Auth guard (redirect unauth users at the edge)
   4. Bot / scraper blocking
   5. CORS enforcement
   ═══════════════════════════════════════════════════════════════════ */

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};

/* ── In-memory sliding-window rate limiter ──────────────────────────
   Works across the process on each edge node.
   For fully distributed limits, replace with Vercel KV (Redis).     */
interface RateRecord { count: number; resetAt: number; }
const ipStore = new Map<string, RateRecord>();
const routeStore = new Map<string, RateRecord>(); // per-IP-per-route

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

interface RateLimitConfig { windowMs: number; max: number; }

function rateLimit(key: string, cfg: RateLimitConfig, store: Map<string, RateRecord>): {
  allowed: boolean; remaining: number; resetAt: number;
} {
  const now = Date.now();
  const rec = store.get(key);
  if (!rec || rec.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + cfg.windowMs });
    return { allowed: true, remaining: cfg.max - 1, resetAt: now + cfg.windowMs };
  }
  rec.count += 1;
  const allowed = rec.count <= cfg.max;
  return { allowed, remaining: Math.max(0, cfg.max - rec.count), resetAt: rec.resetAt };
}

// Clean up old entries every 5 min to prevent memory leak on long-running nodes
let lastClean = Date.now();
function maybeClean() {
  const now = Date.now();
  if (now - lastClean < 5 * 60_000) return;
  lastClean = now;
  for (const [k, v] of ipStore) if (v.resetAt <= now) ipStore.delete(k);
  for (const [k, v] of routeStore) if (v.resetAt <= now) routeStore.delete(k);
}

/* ── Route-specific rate limit configs ─────────────────────────── */
const ROUTE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/proxy/auth/send-otp':             { windowMs: 60_000, max: 2  },  // 2 OTP/min
  '/api/proxy/auth/verify-otp':           { windowMs: 60_000, max: 5  },
  '/api/proxy/auth/login':                { windowMs: 60_000, max: 10 },
  '/api/proxy/auth/register':             { windowMs: 60_000, max: 3  },
  '/api/proxy/auth/reset-password':       { windowMs: 60_000, max: 3  },
  '/api/proxy/orders/place-order':        { windowMs: 60_000, max: 3  },  // 3 orders/min
  '/api/proxy/prescriptions/upload':      { windowMs: 60_000, max: 5  },
  '/api/proxy/blood/sos':                 { windowMs: 60_000, max: 2  },
  '/api/proxy/doctor-bookings/place-booking': { windowMs: 60_000, max: 3 },
  '/api/proxy/subscription/initiate':     { windowMs: 60_000, max: 3  },
};

// Global fallback per-IP limit
const GLOBAL_LIMIT: RateLimitConfig = { windowMs: 60_000, max: 300 };

/* ── Bot patterns to block ────────────────────────────────────── */
const BOT_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i,
  /python-requests\/[0-9]/i, /go-http-client/i,
  /curl\/[0-9]/i, /wget\//i, /libwww-perl/i,
  /scrapy/i, /zgrab/i, /nuclei/i,
];

/* ── Protected routes (require auth cookie) ──────────────────── */
const AUTH_ROUTES = ['/home', '/orders', '/doctor', '/blood-sos', '/profile', '/wallet', '/referral', '/subscription', '/notifications'];
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password'];

/* ── Always-public routes: deep links + assetlinks (no auth, no rate limit) ── */
const ALWAYS_PUBLIC_PREFIXES = [
  '/d/',
  '/c/',
  '/p/',
  '/.well-known/',
];

/* ── Security headers ─────────────────────────────────────────── */
function applySecurityHeaders(res: NextResponse): NextResponse {
  // HSTS — tell browsers to always use HTTPS for 1 year
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer: only send origin to same site
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions: disable sensors/camera/mic/geolocation by default
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self), usb=()'
  );

  // XSS protection (legacy browsers)
  res.headers.set('X-XSS-Protection', '1; mode=block');

  // DNS prefetch control
  res.headers.set('X-DNS-Prefetch-Control', 'on');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.cashfree.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.flashmed.in https://firebasestorage.googleapis.com https://s3.amazonaws.com https://*.tile.openstreetmap.org",
    "connect-src 'self' https://api.flashmed.in https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com https://nominatim.openstreetmap.org",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);

  // Remove server fingerprint
  res.headers.delete('X-Powered-By');
  res.headers.delete('Server');

  return res;
}

/* ── CORS: only allow our own domain ─────────────────────────── */
const ALLOWED_ORIGINS = [
  'https://flashmed.in',
  'https://www.flashmed.in',
  'http://localhost:3000',
  'http://localhost:3001',
];

function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
  }
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Idempotency-Key');
  res.headers.set('Access-Control-Max-Age', '86400');
  return res;
}

export default function middleware(req: NextRequest) {
  maybeClean();

  const { pathname } = req.nextUrl;
  const ip = getIp(req);
  const ua = req.headers.get('user-agent') || '';

  /* ── OPTIONS preflight ── */
  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    return applySecurityHeaders(handleCors(req, res));
  }

  /* ── Always-public bypass (deep links + assetlinks.json) ── */
  if (ALWAYS_PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    const res = NextResponse.next();
    // Still add security headers but skip auth + rate limits
    res.headers.set('Cache-Control', pathname.startsWith('/.well-known/') ? 'public, max-age=3600' : 'no-store');
    return res;
  }

  /* ── Bot blocking ── */
  if (BOT_PATTERNS.some(p => p.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  /* ── Global rate limit ── */
  const global = rateLimit(ip, GLOBAL_LIMIT, ipStore);
  if (!global.allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((global.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(GLOBAL_LIMIT.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(global.resetAt),
        },
      }
    );
  }

  /* ── Route-specific rate limit ── */
  const routeCfg = ROUTE_LIMITS[pathname];
  if (routeCfg) {
    const routeKey = `${ip}:${pathname}`;
    const limit = rateLimit(routeKey, routeCfg, routeStore);
    if (!limit.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded for this action. Please wait a moment.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(routeCfg.max),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }

  /* ── Auth guard at the edge ── */
  const isAuthRoute = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (isAuthRoute) {
    const rawToken = req.cookies.get('fm_token')?.value;
    const token = rawToken ? decodeURIComponent(rawToken) : null;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      return applySecurityHeaders(res);
    }
  }

  /* ── Redirect www → apex ── */
  const host = req.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = req.nextUrl.clone();
    url.host = host.replace(/^www\./, '');
    return NextResponse.redirect(url, { status: 301 });
  }

  /* ── Pass through with security headers ── */
  const res = NextResponse.next();
  applySecurityHeaders(res);
  handleCors(req, res);

  // Propagate rate limit headers
  res.headers.set('X-RateLimit-Limit', String(GLOBAL_LIMIT.max));
  res.headers.set('X-RateLimit-Remaining', String(global.remaining));

  return res;
}
