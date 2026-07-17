import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const body = await req.json();
    const { bloodGroup, patientName, hospital } = body;

    const VALID_BG = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
    if (!bloodGroup || !VALID_BG.has(bloodGroup)) return jsonError('Invalid blood group', 400);
    if (!patientName?.trim()) return jsonError('Patient name is required', 400);
    if (!hospital?.trim()) return jsonError('Hospital name is required', 400);

    const idemKey = `sos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const upstream = await proxyToBackend({
      path: '/api/blood/sos',
      method: 'POST',
      token,
      idempotencyKey: idemKey,
      body: {
        bloodGroup,
        patientName: patientName.trim(),
        patientPhone: body.patientPhone?.trim(),
        hospital: hospital.trim(),
        district: body.district?.trim() || undefined,
        units: Math.max(1, Math.min(20, Number(body.units) || 1)),
        urgency: ['URGENT', 'CRITICAL', 'NORMAL'].includes(body.urgency) ? body.urgency : 'URGENT',
        note: body.note?.trim()?.slice(0, 500) || undefined,
        requesterId: body.requesterId,
        requesterName: body.requesterName?.trim(),
      },
    });

    const data = await upstream.json().catch(() => ({ error: 'SOS failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

