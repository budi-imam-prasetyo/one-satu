import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as targetService from '../services/targetService';
import * as authService from '../services/authService';
import * as notificationService from '../services/notificationService';
import { ApiTarget, TargetResponse, TargetDetailResponse, TargetFrequency } from '../types/target';
import { NotificationItem, NotificationResponse } from '../types/notification';
import { BASE_URL } from '../config';
import { onForegroundMessage, requestFcmToken } from '../../lib/firebase';
import { toast } from 'sonner';

import { calculateEstimatedDeadline } from '../utils/calculations';

// ─── App-layer types (camelCase, used throughout UI) ──────────────────────

export type Target = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  savingAmount: number;
  savingSchedule: 'daily' | 'weekly' | 'monthly';
  estimatedDeadline: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  status: 'active' | 'paused' | 'completed';
  deadline?: string;
  image?: string;
  isGuest?: boolean;
  history: Transaction[];
  progressPercent?: number;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdraw';
};

export type User = {
  id: string;
  name: string;
  username?: string;
  email: string;
};

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => void;
  targets: Target[];
  addTarget: (target: Omit<Target, 'id' | 'currentAmount' | 'history' | 'estimatedDeadline' | 'status'>) => Promise<void>;
  updateTarget: (id: string, amount: number, type: 'deposit' | 'withdraw') => Promise<void>;
  editTarget: (id: string, data: {
    name: string;
    targetAmount: number;
    savingAmount: number;
    savingSchedule: 'daily' | 'weekly' | 'monthly';
    reminderEnabled: boolean;
    reminderTime?: string;
    image?: string;
    originalImage?: string;
  }) => Promise<void>;
  deleteTarget: (id: string) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
}

const mapApiTarget = (t: ApiTarget): Target => ({
  id: t.id,
  name: t.name,
  targetAmount: t.target_amount,
  currentAmount: t.current_amount,
  savingAmount: t.schedule?.amount ?? 0,
  savingSchedule: t.schedule?.frequency ?? 'monthly',
  estimatedDeadline: calculateEstimatedDeadline(
    t.target_amount,
    t.schedule?.amount ?? 0,
    t.schedule?.frequency ?? 'monthly'
  ),
  reminderEnabled: t.schedule?.is_active ?? false,
  status: t.status,
  deadline: t.deadline ?? undefined,
  image: t.image_url ?? undefined,
  isGuest: false,
  history: (t.transactions ?? []).map(tx => ({
    id: tx.id,
    date: tx.created_at,
    amount: tx.amount,
    type: tx.type,
  })),
});

const mapTargetResponse = (t: TargetResponse): Target => {
  const savingSchedule = t.frequency.toLowerCase() as 'daily' | 'weekly' | 'monthly';
  return {
    id: t.id,
    name: t.title,
    targetAmount: t.targetAmount,
    currentAmount: t.currentAmount,
    savingAmount: t.frequencyAmount,
    savingSchedule,
    estimatedDeadline: calculateEstimatedDeadline(
      t.targetAmount,
      t.frequencyAmount,
      savingSchedule
    ),
    reminderEnabled: false,
    status: t.status.toLowerCase() as 'active' | 'paused' | 'completed',
    deadline: t.deadline ?? undefined,
    image: t.imageUrl ?? undefined,
    isGuest: false,
    history: [],
  };
};

const mapTargetDetailResponse = (t: TargetDetailResponse, existing?: Target): Target => {
  const savingSchedule = t.frequency.toLowerCase() as 'daily' | 'weekly' | 'monthly';
  return {
    id: t.id,
    name: t.title,
    targetAmount: t.targetAmount,
    currentAmount: t.currentAmount,
    savingAmount: t.frequencyAmount,
    savingSchedule,
    estimatedDeadline: t.deadline
      ? new Date(t.deadline).toISOString()
      : calculateEstimatedDeadline(t.targetAmount, t.frequencyAmount, savingSchedule),
    reminderEnabled: existing?.reminderEnabled ?? false,
    reminderTime: existing?.reminderTime,
    status: t.status.toLowerCase() as 'active' | 'paused' | 'completed',
    deadline: t.deadline ?? undefined,
    image: t.imageUrl ?? undefined,
    isGuest: existing?.isGuest ?? false,
    history: existing?.history ?? [],
    progressPercent: t.progressPercent,
  };
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tago_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const sseRef = useRef<EventSource | null>(null);

  const guestTempKey = 'guest_temp_id';

  const mapNotificationResponse = (n: NotificationResponse): NotificationItem => ({
    id: n.id,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    sentAt: n.sentAt,
  });

  const upsertNotification = useCallback((incoming: NotificationItem) => {
    setNotifications((prev) => {
      const index = prev.findIndex((n) => n.id === incoming.id);
      if (index === -1) return [incoming, ...prev];
      const next = [...prev];
      next[index] = { ...prev[index], ...incoming };
      return next;
    });
  }, []);

  const closeSse = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    closeSse();
    setUser(null);
    setTargets([]);
    setNotifications([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('fcm_token');
    localStorage.removeItem(guestTempKey);
    localStorage.removeItem('tago_user');
  }, [closeSse]);

  const loadTargets = useCallback(async () => {
    setIsLoading(true);
    try {
      if (authService.isAccessTokenExpired()) {
        logout();
        return;
      }
      const apiTargets = await targetService.fetchTargets();
      setTargets(apiTargets.map(mapTargetResponse));
    } catch (err) {
      console.error('Failed to load targets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (userData: User) => {
    setUser(userData);
    localStorage.setItem('tago_user', JSON.stringify(userData));
    localStorage.removeItem(guestTempKey);
    await loadTargets();
  }, [loadTargets]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const items = await notificationService.fetchNotifications();
      setNotifications(items.map(mapNotificationResponse));
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    loadTargets();
  }, [loadTargets]);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user, loadNotifications]);

  useEffect(() => {
    if (!user) {
      closeSse();
      return;
    }

    if (sseRef.current) return;

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    const sseUrl = `${BASE_URL}/api/notifications/subscribe?token=${encodeURIComponent(accessToken)}`;
    const source = new EventSource(sseUrl, {
      withCredentials: true,
    });
    sseRef.current = source;

    source.addEventListener('notification', (event) => {
      try {
        const parsed = JSON.parse((event as MessageEvent).data) as NotificationResponse;
        upsertNotification(mapNotificationResponse(parsed));
      } catch (err) {
        console.error('Failed to parse notification SSE:', err);
      }
    });

    source.onerror = () => {
      closeSse();
    };

    return () => {
      closeSse();
    };
  }, [user, closeSse, upsertNotification]);

  const syncFcmToken = useCallback(async () => {
    const token = await requestFcmToken();
    if (!token) return;
    const storedToken = localStorage.getItem('fcm_token');
    if (token === storedToken) return;
    await notificationService.updateFcmToken(token);
    localStorage.setItem('fcm_token', token);
  }, []);

  useEffect(() => {
    if (!user) return;

    const refreshToken = () => {
      syncFcmToken().catch((err) => console.error('Failed to sync FCM token:', err));
    };

    refreshToken();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshToken();
      }
    };

    window.addEventListener('focus', refreshToken);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', refreshToken);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user, syncFcmToken]);

  useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};
    const setup = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const title = payload?.notification?.title ?? 'Notifikasi baru';
        const message = payload?.notification?.body ?? '';
        toast(title, { description: message });
      });
    };

    setup();
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const checkToken = () => {
      if (authService.isAccessTokenExpired()) {
        logout();
      }
    };
    checkToken();
    const intervalId = window.setInterval(checkToken, 60_000);
    return () => window.clearInterval(intervalId);
  }, [logout]);

  const ensureGuestSession = async () => {
    const existingTempId = localStorage.getItem(guestTempKey);
    const hasToken = !!localStorage.getItem('access_token');
    if (existingTempId && hasToken) {
      return existingTempId;
    }

    const { user: guestUser } = await authService.guestSession({
      tempId: existingTempId ?? undefined,
    });

    const tempId = (guestUser as { temp_id?: string; tempId?: string }).temp_id
      ?? (guestUser as { temp_id?: string; tempId?: string }).tempId
      ?? existingTempId
      ?? null;

    if (tempId) {
      localStorage.setItem(guestTempKey, tempId);
    }
    return tempId;
  };

  const addTarget = async (
    targetData: Omit<Target, 'id' | 'currentAmount' | 'history' | 'estimatedDeadline' | 'status'>
  ) => {
    if (user) {
      const created = await targetService.createTarget(
        targetData.name,
        targetData.targetAmount,
        targetData.savingAmount,
        targetData.savingSchedule,
        targetData.image,
        targetData.deadline
      );
      setTargets(prev => [mapTargetResponse(created), ...prev]);
      return;
    }

    await ensureGuestSession();

    const created = await targetService.createTarget(
      targetData.name,
      targetData.targetAmount,
      targetData.savingAmount,
      targetData.savingSchedule,
      targetData.image,
      targetData.deadline
    );

    setTargets(prev => [
      { ...mapTargetResponse(created), isGuest: true },
      ...prev,
    ]);
  };

  const updateTarget = async (id: string, amount: number, type: 'deposit' | 'withdraw') => {
    // ── API call (uncomment when backend is ready) ─────────────────────────
    // await targetService.createTransaction(id, { type, amount });
    // const updated = await targetService.patchTarget(id, { ... });
    // setTargets(prev => prev.map(t => t.id === id ? mapApiTarget(updated) : t));
    // ──────────────────────────────────────────────────────────────────────

    setTargets(prev => prev.map(target => {
      if (target.id !== id) return target;
      const newAmount = type === 'deposit'
        ? target.currentAmount + amount
        : target.currentAmount - amount;
      if (target.currentAmount < target.targetAmount && newAmount >= target.targetAmount) {
        setNotifications(n => [{
          id: `local-${Date.now()}`,
          title: 'Target tercapai',
          message: `Selamat! Target "${target.name}" telah tercapai! 🎉`,
          isRead: false,
          sentAt: new Date().toISOString(),
        }, ...n]);
      }
      return {
        ...target,
        currentAmount: newAmount,
        status: newAmount >= target.targetAmount ? 'completed' : 'active',
        history: [{
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          amount,
          type,
        }, ...target.history],
      };
    }));
  };

  const editTarget = async (
    id: string,
    data: {
      name: string;
      targetAmount: number;
      savingAmount: number;
      savingSchedule: 'daily' | 'weekly' | 'monthly';
      reminderEnabled: boolean;
      reminderTime?: string;
      image?: string;
      originalImage?: string;
    }
  ) => {
    if (user) {
      const deadline = calculateEstimatedDeadline(
        data.targetAmount,
        data.savingAmount,
        data.savingSchedule
      ).split('T')[0];

      const normalizedImage = data.image?.trim() || '';
      const normalizedOriginal = data.originalImage?.trim() || '';
      const isSameImage = normalizedImage && normalizedImage === normalizedOriginal;
      const isNewImage = normalizedImage.startsWith('data:');

      const updated = await targetService.updateTarget(id, {
        title: data.name,
        targetAmount: data.targetAmount,
        frequencyAmount: data.savingAmount,
        frequency: data.savingSchedule.toUpperCase() as TargetFrequency,
        deadline,
        imageUrl: isSameImage ? normalizedImage : undefined,
        imageBase64: isNewImage ? normalizedImage : undefined,
      });

      setTargets(prev => prev.map(target => (
        target.id === id ? mapTargetDetailResponse(updated, target) : target
      )));
      return;
    }

    setTargets(prev => prev.map(target => {
      if (target.id !== id) return target;
      return {
        ...target,
        name: data.name,
        targetAmount: data.targetAmount,
        savingAmount: data.savingAmount,
        savingSchedule: data.savingSchedule,
        reminderEnabled: data.reminderEnabled,
        reminderTime: data.reminderTime,
        image: data.image,
        estimatedDeadline: calculateEstimatedDeadline(
          data.targetAmount,
          data.savingAmount,
          data.savingSchedule
        ),
      };
    }));
  };

  const deleteTarget = async (id: string) => {
    if (user) {
      await targetService.deleteTarget(id);
    }
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = useCallback(async (id: string) => {
    if (id.startsWith('local-')) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      return;
    }

    try {
      const updated = await notificationService.markNotificationRead(id);
      upsertNotification(mapNotificationResponse(updated));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  }, [upsertNotification]);

  return (
    <AppContext.Provider value={{
      user, isLoading, login, logout,
      targets, addTarget, updateTarget, editTarget, deleteTarget,
      notifications, markNotificationRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};