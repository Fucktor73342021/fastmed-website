import { NextRequest } from 'next/server';
import { proxyToBackend, jsonError, setCookieToken } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password, otp, sessionId, email, age, gender, bloodGroup } = body;

    if (!name?.trim()) return jsonError('Name is required', 400);
    if (!phone || !/^\d{10}$/.test(String(phone).trim())) return jsonError('Invalid phone', 400);
    if (!password || String(password).length < 6) return jsonError('Password too short (min 6 chars)', 400);
    if (!otp) return jsonError('OTP is required', 400);

    const upstream = await proxyToBackend({
      path: '/api/auth/register',
      method: 'POST',
      body: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        password,
        email: email?.trim() || undefined,
        age: age || undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || undefined,
        role: 'customer',
        otp: String(otp).trim(),
        sessionId,
      },
    });

    const data = await upstream.json().catch(() => ({ error: 'Registration failed' }));
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Registration failed' }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const baseRes = new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCookieToken(baseRes, data.token);
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

