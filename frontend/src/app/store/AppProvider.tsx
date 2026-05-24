import React, { createContext, useContext, useState, useEffect } from 'react';
import * as targetService from '../services/targetService';
import * as authService from '../services/authService';
import { ApiTarget, TargetResponse } from '../types/target';
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
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdraw';
};

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  date: string;
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
  }) => Promise<void>;
  deleteTarget: (id: string) => Promise<void>;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
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

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tago_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Selamat datang di TaGo!', read: false, date: new Date().toISOString() },
  ]);

  const guestTempKey = 'guest_temp_id';

  const loadTargets = async () => {
    setIsLoading(true);
    try {
      const apiTargets = await targetService.fetchTargets();
      setTargets(apiTargets.map(mapTargetResponse));
    } catch (err) {
      console.error('Failed to load targets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    localStorage.removeItem(guestTempKey);
    await loadTargets();
  };

  const logout = () => {
    setUser(null);
    setTargets([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(guestTempKey);
  };

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
          id: Date.now().toString(),
          message: `Selamat! Target "${target.name}" telah tercapai! 🎉`,
          read: false,
          date: new Date().toISOString(),
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
    }
  ) => {
    // ── API call (uncomment when backend is ready) ─────────────────────────
    // await targetService.updateTarget(id, { ... });
    // await targetService.updateSchedule(id, { ... });
    // ──────────────────────────────────────────────────────────────────────

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
    // ── API call (uncomment when backend is ready) ─────────────────────────
    // await targetService.deleteTarget(id);
    // ──────────────────────────────────────────────────────────────────────

    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

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
