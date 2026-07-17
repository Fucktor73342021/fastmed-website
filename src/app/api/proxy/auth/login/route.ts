import { NextRequest } from 'next/server';
import { proxyToBackend, jsonError, setCookieToken } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || typeof phone !== 'string' || !/^\d{10}$/.test(phone.trim())) {
      return jsonError('Invalid phone number', 400);
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return jsonError('Invalid password', 400);
    }

    const upstream = await proxyToBackend({
      path: '/api/auth/login',
      method: 'POST',
      body: { phone: phone.trim(), password },
    });

    const data = await upstream.json().catch(() => ({ error: 'Server error' }));

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Login failed' }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Block non-customer roles
    const role = data.user?.role;
    if (role && ['seller', 'pharmacy', 'delivery', 'delivery_partner', 'admin'].includes(role)) {
      return jsonError('This portal is for customers only.', 403);
    }

    // Set HTTP-only cookie for the token
    const baseRes = new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCookieToken(baseRes, data.token);
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

