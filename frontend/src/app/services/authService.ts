import { LoginRequest, RegisterRequest, AuthResponse, GuestRequest } from '../types/auth';
import { BASE_URL } from '../config';

const publicHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

const decodeBase64Url = (input: string): string => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4;
  const padded = pad ? normalized + '='.repeat(4 - pad) : normalized;
  return atob(padded);
};

export const getAccessTokenPayload = (): Record<string, unknown> | null => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (leewaySeconds = 30): boolean => {
  const payload = getAccessTokenPayload();
  const exp = typeof payload?.exp === 'number' ? payload.exp : null;
  if (!exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds + leewaySeconds;
};

const getErrorMessage = async (res: Response): Promise<string> => {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const json = await res.json().catch(() => null);
    if (json) {
      return json.message ?? json.error ?? json.detail ?? json.title ?? `request failed: ${res.status}`;
    }
  }
  const text = await res.text().catch(() => '');
  return text || `request failed: ${res.status}`;
};

/** POST /auth/login — authenticate and receive tokens */
export const loginUser = async (body: LoginRequest): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: publicHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const json = await res.json();
  localStorage.setItem('access_token', json.access_token);
  if (json.refresh_token) {
    localStorage.setItem('refresh_token', json.refresh_token);
  }
  return json as AuthResponse;
};

/** POST /auth/register — create a new account */
export const registerUser = async (body: RegisterRequest): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: publicHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const json = await res.json();
  localStorage.setItem('access_token', json.access_token);
  if (json.refresh_token) {
    localStorage.setItem('refresh_token', json.refresh_token);
  }
  return json as AuthResponse;
};

/** POST /auth/guest — create or reuse a guest session */
export const guestSession = async (body: GuestRequest): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/guest`, {
    method: 'POST',
    headers: publicHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const json = await res.json();
  localStorage.setItem('access_token', json.access_token);
  if (json.refresh_token) {
    localStorage.setItem('refresh_token', json.refresh_token);
  }
  return json as AuthResponse;
};