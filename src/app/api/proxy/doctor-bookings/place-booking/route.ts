import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const body = await req.json();
    const { doctorId, doctorName, patientName, symptoms } = body;

    if (!doctorId) return jsonError('Doctor ID is required', 400);
    if (!patientName?.trim()) return jsonError('Patient name is required', 400);
    if (!symptoms?.trim()) return jsonError('Symptoms description is required', 400);

    const idemKey = req.headers.get('x-idempotency-key') ||
      `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const upstream = await proxyToBackend({
      path: '/api/doctor-bookings/place-booking',
      method: 'POST',
      token,
      idempotencyKey: idemKey,
      body: {
        doctorId,
        doctorName: doctorName?.trim(),
        patientName: patientName.trim(),
        patientPhone: body.patientPhone?.trim(),
        symptoms: symptoms.trim().slice(0, 1000),
        preferredDate: body.preferredDate || undefined,
        preferredTime: body.preferredTime || undefined,
        note: body.note?.trim()?.slice(0, 500) || undefined,
        customerId: body.customerId,
        customerName: body.customerName?.trim(),
      },
    });

    const data = await upstream.json().catch(() => ({ error: 'Booking failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

