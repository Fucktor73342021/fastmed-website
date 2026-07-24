import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || 'https://medicine-app-backend-production.up.railway.app';
  const slug = 'best-pharmacy-in-dhuliyan';
  const url = `${backendUrl}/api/marketing/articles/${slug}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    const text = await res.text();
    return NextResponse.json({
      backendUrl,
      url,
      status: res.status,
      ok: res.ok,
      responsePreview: text.substring(0, 200),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      backendUrl,
      url,
      error: String(err),
    }, { status: 500 });
  }
}
