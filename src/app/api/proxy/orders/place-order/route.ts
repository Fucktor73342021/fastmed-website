import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized — please log in', 401);

    const body = await req.json();
    const { prescriptionUri, coordinates, address, note, deliveryPhone, paymentMethod,
            orderServiceType, customerName, customerPhone,
            labPreferredDate, labPreferredSlot } = body;

    // Required field validation
    if (!prescriptionUri || typeof prescriptionUri !== 'string') {
      return jsonError('Prescription upload is required', 400);
    }
    if (!address?.houseNo && !address?.locality) {
      return jsonError('Delivery address is required', 400);
    }
    if (orderServiceType === 'pharmacy' && !coordinates?.latitude) {
      return jsonError('GPS location is required for pharmacy orders', 400);
    }

    // Validate coordinates are real numbers (prevent NaN crashes)
    if (coordinates) {
      const lat = Number(coordinates.latitude);
      const lng = Number(coordinates.longitude);
      if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        return jsonError('Invalid GPS coordinates', 400);
      }
    }

    // Server-side idempotency key (prevents double-submit even if client doesn't send one)
    const idempotencyKey = req.headers.get('x-idempotency-key') ||
      `web_${orderServiceType || 'phm'}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const upstream = await proxyToBackend({
      path: '/api/orders/place-order',
      method: 'POST',
      token,
      idempotencyKey,
      body: {
        prescriptionUri,
        coordinates: coordinates ? { latitude: Number(coordinates.latitude), longitude: Number(coordinates.longitude) } : null,
        address: {
          houseNo: String(address.houseNo || '').trim(),
          locality: String(address.locality || '').trim(),
          landmark: String(address.landmark || '').trim(),
          pinCode: String(address.pinCode || '').trim(),
          district: String(address.district || '').trim(),
        },
        note: note ? String(note).trim().slice(0, 500) : undefined,
        deliveryPhone: deliveryPhone ? String(deliveryPhone).trim() : undefined,
        paymentMethod: paymentMethod || 'online',
        orderServiceType: orderServiceType || 'pharmacy',
        customerName: customerName ? String(customerName).trim() : undefined,
        customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
        labPreferredDate: labPreferredDate || undefined,
        labPreferredSlot: labPreferredSlot || undefined,
      },
    });

    const data = await upstream.json().catch(() => ({ error: 'Order placement failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out — please try again', 504);
    console.error('[place-order proxy]', err);
    return jsonError('Internal server error', 500);
  }
}

