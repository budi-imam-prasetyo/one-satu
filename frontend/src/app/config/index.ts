export const BASE_URL = 'https://api.tago.app/v1'; // TODO: replace with real base URL

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const delay = (ms = 600) => new Promise<void>(resolve => setTimeout(resolve, ms));
