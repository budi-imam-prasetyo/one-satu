export interface ApiUser {
  id: string;
  google_id: string | null;
  temp_id: string | null;
  is_guest: boolean;
  username: string | null;
  name: string;
  email: string | null;
  fcm_token: string | null;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tempId?: string | null;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  tempId?: string | null;
}

export interface GuestRequest {
  tempId?: string | null;
}

export interface AuthResponse {
  user: ApiUser;
  access_token: string;
  refresh_token: string | null;
}
