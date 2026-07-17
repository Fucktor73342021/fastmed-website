import { NextRequest } from 'next/server';
import { proxyToBackend, extractToken, jsonError } from '@/lib/proxy';

export const runtime = 'nodejs'; // multipart/form-data needs Node.js runtime

export async function POST(req: NextRequest) {
  try {
    const token = extractToken(req);
    if (!token) return jsonError('Unauthorized', 401);

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonError('Expected multipart/form-data', 400);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return jsonError('No file provided', 400);

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      return jsonError('Invalid file type. Allowed: JPG, PNG, WEBP, PDF', 415);
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return jsonError('File too large. Maximum size is 10 MB', 413);
    }

    const upstream = await proxyToBackend({
      path: '/api/prescriptions/upload',
      method: 'POST',
      token,
      isFormData: true,
      formData: formData as FormData,
    });

    const data = await upstream.json().catch(() => ({ error: 'Upload failed' }));
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') return jsonError('Upload timed out', 504);
    return jsonError('Internal server error', 500);
  }
}

