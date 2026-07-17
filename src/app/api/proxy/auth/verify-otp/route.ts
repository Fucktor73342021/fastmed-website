import { NextRequest } from 'next/server';
import { proxyToBackend, jsonError, setCookieToken } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, sessionId, purpose } = body;

    if (!phone || !/^\d{10}$/.test(String(phone).trim())) return jsonError('Invalid phone', 400);
    if (!otp || !/^\d{4,6}$/.test(String(otp).trim())) return jsonError('Invalid OTP format', 400);

    const upstream = await proxyToBackend({
      path: '/api/auth/verify-otp',
      method: 'POST',
      body: { phone: String(phone).trim(), otp: String(otp).trim(), sessionId, purpose },
    });

    const data = await upstream.json().catch(() => ({ error: 'Verification failed' }));

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Incorrect OTP' }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If it's a login, set the cookie
    if (purpose === 'login' && data.token) {
      const baseRes = new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      return setCookieToken(baseRes, data.token);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

