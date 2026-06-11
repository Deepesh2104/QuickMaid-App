import type { JobStatus, PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';

export type HistoryFilter = 'completed' | 'all';

const HISTORY_STATUSES: JobStatus[] = ['completed', 'declined'];

export function historyJobs(jobs: PartnerJob[], filter: HistoryFilter): PartnerJob[] {
  const pool = jobs.filter((j) => HISTORY_STATUSES.includes(j.status));
  if (filter === 'completed') {
    return pool.filter((j) => j.status === 'completed');
  }
  return pool;
}

export function sortHistoryJobs(jobs: PartnerJob[]): PartnerJob[] {
  const order: Record<string, number> = { Today: 0, Tomorrow: 1 };
  return [...jobs].sort((a, b) => {
    const dayA = order[a.visitDate] ?? 2;
    const dayB = order[b.visitDate] ?? 2;
    if (dayA !== dayB) return dayA - dayB;
    return b.id.localeCompare(a.id);
  });
}

export function historyTotalEarnings(jobs: PartnerJob[]): number {
  return jobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, j) => sum + netEarningPaise(j.amountPaise), 0);
}
