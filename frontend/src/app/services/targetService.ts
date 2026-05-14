import {
  ApiTarget,
  ApiTransaction,
  CreateTargetRequest,
  UpdateTargetRequest,
  PatchTargetRequest,
  CreateTransactionRequest,
  UpdateScheduleRequest,
} from '../types/target';
import { dummyTargets } from '../data/dummyTargets';
import { BASE_URL, getAuthHeaders, delay } from '../config';

/** GET /targets — fetch all targets for the current user */
export const fetchTargets = async (): Promise<ApiTarget[]> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets`, {
  //   method: 'GET',
  //   headers: getAuthHeaders(),
  // });
  // if (!res.ok) throw new Error(`fetchTargets failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTarget[];
  // ─────────────────────────────────────────────────────────────────────────

  await delay();
  return dummyTargets;
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
export const createTarget = async (body: CreateTargetRequest): Promise<ApiTarget> => {
  // ── Real API call (uncomment when backend is ready) ──────────────────────
  // const res = await fetch(`${BASE_URL}/targets`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(body),
  // });
  // if (!res.ok) throw new Error(`createTarget failed: ${res.status}`);
  // const json = await res.json();
  // return json.data as ApiTarget;
  // ─────────────────────────────────────────────────────────────────────────

  const now = new Date().toISOString();
  const id = `target-${Date.now()}`;
  return {
    id,
    user_id: 'user-001',
    name: body.name,
    description: body.description ?? null,
    image_url: body.image_url ?? null,
    status: 'active',
    target_amount: body.target_amount,
    current_amount: 0,
    deadline: body.deadline ?? null,
    created_at: now,
    updated_at: now,
    schedule: body.schedule
      ? {
          id: `sched-${Date.now()}`,
          target_id: id,
          frequency: body.schedule.frequency,
          amount: body.schedule.amount,
          next_run: now.split('T')[0],
          last_run: null,
          is_active: body.schedule.is_active,
          created_at: now,
        }
      : null,
    transactions: [],
  };
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
