import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import { DEMO_JOBS, type JobStatus, type PartnerJob } from '@/constants/demo';

export async function getPartnerJobs(): Promise<PartnerJob[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerJobs);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEYS.partnerJobs, JSON.stringify(DEMO_JOBS));
      return [...DEMO_JOBS];
    }
    const stored = JSON.parse(raw) as PartnerJob[];
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
    const merged = additions.length ? [...synced, ...additions] : synced;
    if (additions.length > 0 || synced.length !== stored.length) {
      await savePartnerJobs(merged);
    }
    return merged;
  } catch {
    return [...DEMO_JOBS];
  }
}

export async function savePartnerJobs(jobs: PartnerJob[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.partnerJobs, JSON.stringify(jobs));
}

export async function getPartnerJobById(id: string): Promise<PartnerJob | null> {
  const jobs = await getPartnerJobs();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function updatePartnerJobStatus(
  id: string,
  status: JobStatus,
  patch?: Partial<Pick<PartnerJob, 'declineReason'>>,
): Promise<PartnerJob | null> {
  const jobs = await getPartnerJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx < 0) return null;

  const next = [...jobs];
  next[idx] = { ...next[idx], status, ...patch };
  await savePartnerJobs(next);
  return next[idx];
}
