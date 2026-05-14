import { ApiUser } from '../types/auth';

// Matches user_id: 'user-001' used across all dummyTargets
export const dummyUser: ApiUser = {
  id: 'user-001',
  google_id: null,
  temp_id: null,
  is_guest: false,
  username: 'budisantoso',
  name: 'Budi Santoso',
  email: 'budi@example.com',
  fcm_token: null,
  last_active: '2026-05-14T08:00:00.000Z',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-05-14T08:00:00.000Z',
};

// Dummy credentials for development bypass
export const DUMMY_CREDENTIALS = {
  email: 'budi@example.com',
  password: 'password123',
};
