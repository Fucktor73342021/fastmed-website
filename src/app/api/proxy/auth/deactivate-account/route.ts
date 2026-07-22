import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized — please log in first', 401);

    const body = await req.json().catch(() => ({}));

    const upstream = await proxyToBackend({
      path: '/api/auth/deactivate-account',
      method: 'POST',
      token,
      body: { reason: body.reason || 'User requested via web delete-account page' },
    });

    const data = await upstream.json().catch(() => ({ error: 'Server error' }));

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}
