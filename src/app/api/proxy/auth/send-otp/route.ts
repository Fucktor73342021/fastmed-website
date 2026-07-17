import { NextRequest } from 'next/server';
import { proxyToBackend, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, purpose } = body;

    if (!phone || !/^\d{10}$/.test(String(phone).trim())) {
      return jsonError('Invalid phone number', 400);
    }
    const validPurposes = ['login', 'register', 'forgot_password'];
    if (!validPurposes.includes(purpose)) {
      return jsonError('Invalid purpose', 400);
    }

    const upstream = await proxyToBackend({
      path: '/api/auth/send-otp',
      method: 'POST',
      body: { phone: String(phone).trim(), purpose },
    });

    const data = await upstream.json().catch(() => ({ error: 'Failed to send OTP' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

