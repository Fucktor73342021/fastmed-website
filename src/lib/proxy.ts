/**
 * Shared proxy utility — used by all /api/proxy/* routes.
 * Forwards requests to api.flashmed.in server-side so the real
 * backend URL is never exposed in the browser network tab.
 */

const BACKEND = process.env.BACKEND_URL || 'https://api.flashmed.in';
const TIMEOUT_MS = 20_000;

export interface ProxyOptions {
  path: string;
  method: string;
  body?: unknown;
  token?: string | null;
  idempotencyKey?: string | null;
  isFormData?: boolean;
  formData?: FormData;
}

export async function proxyToBackend(opts: ProxyOptions): Promise<Response> {
  const { path, method, body, token, idempotencyKey, isFormData, formData } = opts;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  headers['X-Forwarded-From'] = 'flashmed-web';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND}${path}`, {
      method,
      headers,
      body: isFormData ? formData : (body ? JSON.stringify(body) : undefined),
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export function extractToken(req: Request): string | null {
  // 1. HTTP-only cookie (preferred — set by login proxy)
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieMatch = cookieHeader.match(/fm_token=([^;]+)/);
  if (cookieMatch?.[1]) return cookieMatch[1];

  // 2. Authorization header fallback (for API clients / mobile hybrid)
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);

  return null;
}

export function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function setCookieToken(res: Response, token: string): Response {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieVal = [
    `fm_token=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${60 * 60 * 24 * 30}`, // 30 days
    isProd ? 'Secure' : '',
  ].filter(Boolean).join('; ');

  const headers = new Headers(res.headers);
  headers.set('Set-Cookie', cookieVal);
  return new Response(res.body, { status: res.status, headers });
}

export function clearCookieToken(): Response {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  headers.set('Set-Cookie', 'fm_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
