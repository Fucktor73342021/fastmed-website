import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, sessionId, newPassword } = body;

    if (!phone || !/^\d{10}$/.test(String(phone).trim())) return jsonError('Invalid phone', 400);
    if (!otp) return jsonError('OTP is required', 400);
    if (!newPassword || String(newPassword).length < 6) return jsonError('New password too short (min 6)', 400);

    const upstream = await proxyToBackend({
      path: '/api/auth/reset-password',
      method: 'POST',
      body: { phone: String(phone).trim(), otp: String(otp).trim(), sessionId, newPassword },
    });

    const data = await upstream.json().catch(() => ({ error: 'Reset failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

