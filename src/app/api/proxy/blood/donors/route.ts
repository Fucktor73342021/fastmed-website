import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get('bloodGroup') || '';
    const district = searchParams.get('district') || '';

    const VALID_BG = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']);
    if (!VALID_BG.has(bloodGroup)) return jsonError('Invalid blood group', 400);

    const qs = new URLSearchParams();
    if (bloodGroup) qs.set('bloodGroup', bloodGroup);
    if (district) qs.set('district', district);

    const upstream = await proxyToBackend({
      path: `/api/blood/donors?${qs.toString()}`,
      method: 'GET',
      token,
    });

    const data = await upstream.json().catch(() => ({ donors: [] }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=120, stale-while-revalidate=300',
      },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

