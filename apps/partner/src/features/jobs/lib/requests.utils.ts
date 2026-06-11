import type { PartnerProfile } from '@/constants/app';
import type { PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';
import { buildDispatchOffers } from '@/features/jobs/lib/dispatch.utils';

export type RequestFilter = 'all' | 'today' | 'nearby' | 'high_pay';

const NEARBY_KM = 3;
const HIGH_PAY_PAISE = 40_000;

export function sortPendingJobs(jobs: PartnerJob[]): PartnerJob[] {
  return [...jobs].sort((a, b) => {
    const distA = a.distanceKm ?? 99;
    const distB = b.distanceKm ?? 99;
    if (distA !== distB) return distA - distB;
    return netEarningPaise(b.amountPaise) - netEarningPaise(a.amountPaise);
  });
}

export function filterPendingJobs(jobs: PartnerJob[], filter: RequestFilter): PartnerJob[] {
  const sorted = sortPendingJobs(jobs);
  switch (filter) {
    case 'today':
      return sorted.filter((j) => j.visitDate.toLowerCase().includes('today'));
    case 'nearby':
      return sorted.filter((j) => (j.distanceKm ?? 99) <= NEARBY_KM);
    case 'high_pay':
      return sorted.filter((j) => netEarningPaise(j.amountPaise) >= HIGH_PAY_PAISE);
    default:
      return sorted;
  }
}

export function getBestMatchJob(
  jobs: PartnerJob[],
  profile?: PartnerProfile | null,
  isOnline = true,
  scheduled: PartnerJob[] = [],
): PartnerJob | null {
  if (profile != null) {
    return buildDispatchOffers(jobs, scheduled, profile, isOnline)[0] ?? null;
  }
  return sortPendingJobs(jobs)[0] ?? null;
}

export function groupPendingByVisit(jobs: PartnerJob[]): { label: string; jobs: PartnerJob[] }[] {
  const order = ['Today', 'Tomorrow'];
  const buckets = new Map<string, PartnerJob[]>();

  for (const job of jobs) {
    const key = order.includes(job.visitDate) ? job.visitDate : 'Upcoming';
    const list = buckets.get(key) ?? [];
    list.push(job);
    buckets.set(key, list);
  }

  const groups: { label: string; jobs: PartnerJob[] }[] = [];
  for (const label of [...order, 'Upcoming']) {
    const list = buckets.get(label);
    if (list?.length) groups.push({ label, jobs: list });
  }
  return groups;
}

export function filterCount(jobs: PartnerJob[], filter: RequestFilter): number {
  return filterPendingJobs(jobs, filter).length;
}

export function responseMinutesLeft(jobId: string): number {
  const hash = jobId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return 8 + (hash % 10);
}
