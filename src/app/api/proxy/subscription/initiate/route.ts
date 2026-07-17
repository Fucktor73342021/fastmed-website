import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'edge';

const VALID_PLANS = new Set(['monthly', 'quarterly', 'yearly']);
const PLAN_PRICES: Record<string, number> = { monthly: 99, quarterly: 249, yearly: 799 };

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const body = await req.json();
    const { planId, planName, amount } = body;

    if (!planId || !VALID_PLANS.has(planId)) return jsonError('Invalid subscription plan', 400);

    // Server-side price verification — never trust client-sent price
    const expectedPrice = PLAN_PRICES[planId];
    if (!expectedPrice) return jsonError('Plan not found', 404);

    const upstream = await proxyToBackend({
      path: '/api/subscription/initiate',
      method: 'POST',
      token,
      body: {
        planId,
        planName: planName?.trim(),
        amount: expectedPrice, // use server price, not client price
      },
    });

    const data = await upstream.json().catch(() => ({ error: 'Payment initiation failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Request timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

