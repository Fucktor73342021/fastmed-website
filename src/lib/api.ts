const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';
const TIMEOUT_MS = 15000;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fm_token');
}

export function setToken(token: string) {
  localStorage.setItem('fm_token', token);
  // Also set a cookie so the edge middleware auth guard can read it
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `fm_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=604800${secure}`;
}

export function clearToken() {
  localStorage.removeItem('fm_token');
  localStorage.removeItem('fm_user');
  // Clear the cookie too
  document.cookie = 'fm_token=; Path=/; Max-Age=0; SameSite=Lax';
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (requireAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || `Server error ${res.status}`);
    return data as T;
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') throw new Error('Request timed out. Please check your connection.');
    throw err;
  }
}

export async function uploadPrescription(file: File, token: string): Promise<{ prescriptionUri: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${BASE_URL}/api/prescriptions/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export const api = {
  get: <T>(path: string, auth = true) => request<T>(path, { method: 'GET' }, auth),
  post: <T>(path: string, body: unknown, auth = true) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, auth),
  put: <T>(path: string, body: unknown, auth = true) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, auth),
  delete: <T>(path: string, auth = true) => request<T>(path, { method: 'DELETE' }, auth),
};

export default api;
