import axios from 'axios';
import { BASE_URL } from '../config';
import { NotificationResponse } from '../types/notification';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const fetchNotifications = async (): Promise<NotificationResponse[]> => {
  const res = await api.get<NotificationResponse[]>('/api/notifications');
  return res.data;
};

export const markNotificationRead = async (id: string): Promise<NotificationResponse> => {
  const res = await api.patch<NotificationResponse>(`/api/notifications/${id}/read`);
  return res.data;
};

export const updateFcmToken = async (token: string): Promise<void> => {
  await api.patch('/api/users/fcm-token', null, { params: { token } });
};
