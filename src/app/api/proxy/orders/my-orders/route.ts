import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const upstream = await proxyToBackend({
      path: '/api/orders/my-orders',
      method: 'GET',
      token,
    });

    const data = await upstream.json().catch(() => ({ error: 'Failed to fetch orders' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 30s — Firestore real-time handles the rest
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

