export interface ApiSchedule {
  id: string;
  target_id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  amount: number;
  next_run: string;
  last_run: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiTransaction {
  id: string;
  target_id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  note: string | null;
  created_at: string;
}

export interface ApiNotification {
  id: string;
  user_id: string;
  target_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  sent_at: string;
}

export interface ApiTarget {
  id: string;
  user_id: string;
  name: string;
  // description: string | null;
  image_url: string | null;
  status: 'active' | 'paused' | 'completed';
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  // schedule: ApiSchedule | null;
  transactions: ApiTransaction[];
}

export type TargetStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type TargetFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface TargetResponse {
  id: string;
  userId: string;
  title: string;
  imageUrl: string | null;
  status: TargetStatus;
  targetAmount: number;
  currentAmount: number;
  frequency: TargetFrequency;
  frequencyAmount: number;
  deadline: string | null;
}

export interface DashboardStats {
  totalSavings: number;
  totalTargets: number;
  totalCompleted: number;
}

// ─── Request Body Types ────────────────────────────────────────────────────

export interface CreateTargetRequest {
  name: string;
  description?: string;
  image_url?: string;
  target_amount: number;
  deadline?: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    amount: number;
    is_active: boolean;
  };
}

export interface UpdateTargetRequest {
  name?: string;
  description?: string;
  image_url?: string;
  target_amount?: number;
  status?: 'active' | 'paused' | 'completed';
  deadline?: string;
}

export interface PatchTargetRequest {
  status?: 'active' | 'paused' | 'completed';
  current_amount?: number;
}

export interface CreateTransactionRequest {
  type: 'deposit' | 'withdraw';
  amount: number;
  note?: string;
}

export interface UpdateScheduleRequest {
  frequency?: 'daily' | 'weekly' | 'monthly';
  amount?: number;
  next_run?: string;
  is_active?: boolean;
}
