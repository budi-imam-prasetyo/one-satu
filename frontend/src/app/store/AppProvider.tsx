import React, { createContext, useContext, useState, useEffect } from 'react';
import * as targetService from '../services/targetService';
import { ApiTarget, TargetResponse, TargetDetailResponse, TargetFrequency } from '../types/target';
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
  login: (user: User) => void;
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

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Selamat datang di TaGo!', read: false, date: new Date().toISOString() },
  ]);

  useEffect(() => {
    localStorage.setItem('tago_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setTargets(prev => prev.map(t => ({ ...t, isGuest: false })));
  };

  const logout = () => {
    setUser(null);
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
      setTargets(prev => [mapApiTarget(created), ...prev]);
      return;
    }

    const estimatedDeadline = calculateEstimatedDeadline(
      targetData.targetAmount,
      targetData.savingAmount,
      targetData.savingSchedule
    );
    const newTarget: Target = {
      ...targetData,
      id: `target-${Date.now()}`,
      currentAmount: 0,
      history: [],
      estimatedDeadline,
      status: 'active',
    };
    setTargets(prev => [newTarget, ...prev]);
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