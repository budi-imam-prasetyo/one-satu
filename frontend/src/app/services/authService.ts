import { LoginRequest, RegisterRequest, AuthResponse, ApiUser } from '../types/auth';
import { dummyUser } from '../data/dummyUser';
import { BASE_URL, getAuthHeaders, delay } from '../config';

/** POST /auth/login — authenticate and receive tokens */
export const loginUser = async (body: LoginRequest): Promise<AuthResponse> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`login failed: ${res.status}`);
  // const json = await res.json();
  // localStorage.setItem('tago_access_token', json.data.access_token);
  // localStorage.setItem('tago_refresh_token', json.data.refresh_token);
  // return json.data as AuthResponse;
  // ─────────────────────────────────────────────────────────────────────────

  await delay(800);
  return {
    user: dummyUser,
    access_token: 'dummy-access-token',
    refresh_token: 'dummy-refresh-token',
  };
};

/** POST /auth/register — create a new account */
export const registerUser = async (body: RegisterRequest): Promise<AuthResponse> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`register failed: ${res.status}`);
  // const json = await res.json();
  // localStorage.setItem('tago_access_token', json.data.access_token);
  // localStorage.setItem('tago_refresh_token', json.data.refresh_token);
  // return json.data as AuthResponse;
  // ─────────────────────────────────────────────────────────────────────────

  await delay(1000);
  const now = new Date().toISOString();
  const newUser: ApiUser = {
    id: `user-${Date.now()}`,
    google_id: null,
    temp_id: null,
    is_guest: false,
    username: body.username,
    name: body.name,
    email: body.email,
    fcm_token: null,
    last_active: now,
    created_at: now,
    updated_at: now,
  };
  return {
    user: newUser,
    access_token: 'dummy-access-token',
    refresh_token: 'dummy-refresh-token',
  };
};
