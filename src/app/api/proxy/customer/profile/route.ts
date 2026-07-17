import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const upstream = await proxyToBackend({ path: '/api/customer/profile', method: 'GET', token });
    const data = await upstream.json().catch(() => ({ error: 'Failed to load profile' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=60' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const body = await req.json();

    // Sanitize name
    if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
      return jsonError('Name cannot be empty', 400);
    }

    // Validate blood group
    const VALID_BG = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '', undefined]);
    if (!VALID_BG.has(body.bloodGroup)) return jsonError('Invalid blood group', 400);

    const upstream = await proxyToBackend({
      path: '/api/customer/profile',
      method: 'PUT',
      token,
      body,
    });

    const data = await upstream.json().catch(() => ({ error: 'Update failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

