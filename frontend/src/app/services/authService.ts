import { LoginRequest, RegisterRequest, AuthResponse, GuestRequest } from '../types/auth';
import { BASE_URL } from '../config';

const publicHeaders: HeadersInit = {
  'Content-Type': 'application/json',
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
