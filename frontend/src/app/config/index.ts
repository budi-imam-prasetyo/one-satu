export const BASE_URL = 'https://api.tago.app/v1'; // TODO: replace with real base URL

export const getAuthHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('tago_access_token')}`,
});

export const delay = (ms = 600) => new Promise<void>(resolve => setTimeout(resolve, ms));
