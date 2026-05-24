import {
  ApiTarget,
  ApiTransaction,
  CreateTargetRequest,
  UpdateTargetRequest,
  PatchTargetRequest,
  CreateTransactionRequest,
  UpdateScheduleRequest,
  DashboardStats,
  TargetResponse,
} from '../types/target';
import { dummyTargets } from '../data/dummyTargets';
import { BASE_URL, getAuthHeaders, delay } from '../config';
import { calculateEstimatedDeadline } from '../utils/calculations';

/**
 * Convert base64 data URL to Blob
 * @param dataURL Base64 encoded data URL (e.g., "data:image/png;base64,iVBORw0K...")
 */
function dataURLtoBlob(dataURL: string): Blob {
  if (!dataURL.includes(',')) {
    throw new Error('Invalid data URL format');
  }
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(data);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Get auth headers for multipart requests (no Content-Type header needed)
 */
function getAuthHeadersMultipart() {
  const token = localStorage.getItem('access_token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Note: ContentType NOT set for multipart; browser will set it with boundary
  };
}

/** GET /targets — fetch all targets for the current user */
export const fetchTargets = async (status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED'): Promise<TargetResponse[]> => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${BASE_URL}/api/targets${query}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`fetchTargets failed: ${res.status}`);
  const json = await res.json();
  return json.data as TargetResponse[];
};

/** GET /targets/stats — fetch dashboard stats for the current user */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch(`${BASE_URL}/api/targets/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`fetchDashboardStats failed: ${res.status}`);
  const json = await res.json();
  return json.data as DashboardStats;
};

/** GET /targets/:id — fetch a single target with its schedule and transactions */
export const fetchTarget = async (id: string): Promise<ApiTarget> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${id}`, {
  //   method: 'GET',
  //   headers: getAuthHeaders(),
  // });
  // if (!res.ok) throw new Error(`fetchTarget failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTarget;
  // ─────────────────────────────────────────────────────────────────────────

  await delay(300);
  const target = dummyTargets.find(t => t.id === id);
  if (!target) throw new Error(`Target ${id} not found`);
  return target;
};

/** POST /targets — create a new target */
export const createTarget = async (
  name: string,
  targetAmount: number,
  savingAmount: number,
  savingSchedule: 'daily' | 'weekly' | 'monthly',
  imageBase64?: string,
  deadline?: string
): Promise<ApiTarget> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // Calculate deadline if not provided
  const finalDeadline = deadline || calculateEstimatedDeadline(targetAmount, savingAmount, savingSchedule);

  // Build FormData for multipart upload
  const formData = new FormData();
  formData.append('title', name);
  formData.append('targetAmount', targetAmount.toString());
  formData.append('frequencyAmount', savingAmount.toString());
  formData.append('frequency', savingSchedule.toUpperCase()); // DAILY, WEEKLY, MONTHLY
  formData.append('deadline', finalDeadline.split('T')[0]); // Convert ISO to YYYY-MM-DD

  // Convert base64 image to Blob and append as file
  if (imageBase64) {
    try {
      const blob = dataURLtoBlob(imageBase64);
      formData.append('image', blob, 'target-image.png');
    } catch (err) {
      console.error('Failed to convert image:', err);
      // Continue without image if conversion fails
    }
  }

  const res = await fetch(`${BASE_URL}/api/targets`, {
    method: 'POST',
    headers: getAuthHeadersMultipart(),
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`createTarget failed: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  return json.data as ApiTarget;
};

/** PUT /targets/:id — fully update a target */
export const updateTarget = async (id: string, body: UpdateTargetRequest): Promise<ApiTarget> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${id}`, {
  //   method: 'PUT',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`updateTarget failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTarget;
  // ─────────────────────────────────────────────────────────────────────────

  const existing = dummyTargets.find(t => t.id === id);
  if (!existing) throw new Error(`Target ${id} not found`);
  return { ...existing, ...body, updated_at: new Date().toISOString() };
};

/** PATCH /targets/:id — partially update a target */
export const patchTarget = async (id: string, body: PatchTargetRequest): Promise<ApiTarget> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${id}`, {
  //   method: 'PATCH',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`patchTarget failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTarget;
  // ─────────────────────────────────────────────────────────────────────────

  const existing = dummyTargets.find(t => t.id === id);
  if (!existing) throw new Error(`Target ${id} not found`);
  return { ...existing, ...body, updated_at: new Date().toISOString() };
};

/** DELETE /targets/:id — delete a target */
export const deleteTarget = async (id: string): Promise<void> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${id}`, {
  //   method: 'DELETE',
  //   headers: getAuthHeaders(),
  // });
  // if (!res.ok) throw new Error(`deleteTarget failed: ${res.status}`);
  // ─────────────────────────────────────────────────────────────────────────
};

/** POST /targets/:targetId/transactions — record a deposit or withdrawal */
export const createTransaction = async (
  targetId: string,
  body: CreateTransactionRequest
): Promise<ApiTransaction> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${targetId}/transactions`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`createTransaction failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTransaction;
  // ─────────────────────────────────────────────────────────────────────────

  const now = new Date().toISOString();
  return {
    id: `tx-${Date.now()}`,
    target_id: targetId,
    type: body.type,
    amount: body.amount,
    note: body.note ?? null,
    created_at: now,
  };
};

/** PATCH /targets/:targetId/schedule — update saving schedule */
export const updateSchedule = async (targetId: string, body: UpdateScheduleRequest): Promise<void> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets/${targetId}/schedule`, {
  //   method: 'PATCH',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`updateSchedule failed: ${res.status}`);
  // ─────────────────────────────────────────────────────────────────────────
};
