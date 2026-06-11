import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import { DEMO_JOBS, MANUAL_ACCEPT_DECLINE_TEST_IDS, type JobStatus, type PartnerJob } from '@/constants/demo';
import { notifyPartnerJobsChanged } from '@/features/jobs/lib/jobs.events';

function mergeStoredWithDemo(stored: PartnerJob[]): PartnerJob[] {
  const demoById = new Map(DEMO_JOBS.map((j) => [j.id, j]));
  const synced = stored.map((job) => {
    const demo = demoById.get(job.id);
    if (!demo) return job;
    const userTouched =
      job.status === 'accepted' ||
      job.status === 'in_progress' ||
      job.status === 'completed' ||
      job.status === 'declined';
    return { ...demo, status: userTouched ? job.status : demo.status };
  });
  const syncedIds = new Set(synced.map((j) => j.id));
  const additions = DEMO_JOBS.filter((j) => !syncedIds.has(j.id));
  return additions.length ? [...synced, ...additions] : synced;
}

/** Read-only merge — never writes (avoids racing over accepted status). */
export async function getPartnerJobs(): Promise<PartnerJob[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerJobs);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEYS.partnerJobs, JSON.stringify(DEMO_JOBS));
      return [...DEMO_JOBS];
    }
    const stored = JSON.parse(raw) as PartnerJob[];
    return mergeStoredWithDemo(stored);
  } catch {
    return [...DEMO_JOBS];
  }
}

/** Persist demo seed additions once (e.g. after app update). */
export async function syncPartnerJobsWithDemo(): Promise<PartnerJob[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerJobs);
  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEYS.partnerJobs, JSON.stringify(DEMO_JOBS));
    return [...DEMO_JOBS];
  }
  const stored = JSON.parse(raw) as PartnerJob[];
  const merged = mergeStoredWithDemo(stored);
  const storedIds = new Set(stored.map((j) => j.id));
  const hasNewDemoJobs = DEMO_JOBS.some((j) => !storedIds.has(j.id));
  if (hasNewDemoJobs || merged.length !== stored.length) {
    await savePartnerJobs(merged);
  }
  return merged;
}

export async function savePartnerJobs(jobs: PartnerJob[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.partnerJobs, JSON.stringify(jobs));
  // Defer so callers can apply optimistic UI before background refresh runs.
  queueMicrotask(() => notifyPartnerJobsChanged());
}

/** Demo: restore all jobs to seed data (pending offers come back). */
export async function resetPartnerJobsToDemo(): Promise<PartnerJob[]> {
  const fresh = [...DEMO_JOBS];
  await savePartnerJobs(fresh);
  return fresh;
}

/** Demo: sirf Accept/Decline test jobs (j9, j10) wapas pending. */
export async function resetAcceptDeclineTestJobs(): Promise<PartnerJob[]> {
  const demoById = new Map(DEMO_JOBS.map((j) => [j.id, j]));
  const jobs = await getPartnerJobs();
  const next = jobs.map((job) => {
    if (!MANUAL_ACCEPT_DECLINE_TEST_IDS.includes(job.id as (typeof MANUAL_ACCEPT_DECLINE_TEST_IDS)[number])) {
      return job;
    }
    const demo = demoById.get(job.id);
    return demo ? { ...demo, status: 'pending' as const } : job;
  });
  await savePartnerJobs(next);
  return next;
}

export async function getPartnerJobById(id: string): Promise<PartnerJob | null> {
  const jobs = await getPartnerJobs();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function patchPartnerJob(
  id: string,
  patch: Partial<PartnerJob>,
): Promise<PartnerJob | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerJobs);
  const stored = raw ? (JSON.parse(raw) as PartnerJob[]) : [...DEMO_JOBS];
  const jobs = mergeStoredWithDemo(stored);
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx < 0) return null;

  const next = [...jobs];
  next[idx] = { ...next[idx], ...patch };
  await savePartnerJobs(next);
  return next[idx];
}

export async function updatePartnerJobStatus(
  id: string,
  status: JobStatus,
  patch?: Partial<Pick<PartnerJob, 'declineReason'>>,
): Promise<PartnerJob | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerJobs);
  const stored = raw ? (JSON.parse(raw) as PartnerJob[]) : [...DEMO_JOBS];
  const jobs = mergeStoredWithDemo(stored);
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx < 0) return null;

  const next = [...jobs];
  next[idx] = { ...next[idx], status, ...patch };
  await savePartnerJobs(next);
  return next[idx];
}
