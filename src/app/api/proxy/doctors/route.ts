import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get('specialization') || '';
    const qs = specialization ? `?specialization=${encodeURIComponent(specialization)}` : '';

    const upstream = await proxyToBackend({
      path: `/api/doctors${qs}`,
      method: 'GET',
      token,
    });

    const data = await upstream.json().catch(() => ({ doctors: [] }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        // Cache doctor list for 5 min
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

