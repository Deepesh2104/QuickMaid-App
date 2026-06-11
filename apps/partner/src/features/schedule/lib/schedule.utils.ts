import type { PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';

export type ScheduleFilter = 'all' | 'today' | 'in_progress' | 'this_week';

const VISIT_ORDER: Record<string, number> = {
  Today: 0,
  Tomorrow: 1,
};

function visitSortKey(date: string) {
  return VISIT_ORDER[date] ?? 2;
}

export function sortScheduleJobs(jobs: PartnerJob[]): PartnerJob[] {
  return [...jobs].sort((a, b) => {
    const dayDiff = visitSortKey(a.visitDate) - visitSortKey(b.visitDate);
    if (dayDiff !== 0) return dayDiff;

    const liveA = a.status === 'in_progress' ? 0 : 1;
    const liveB = b.status === 'in_progress' ? 0 : 1;
    if (liveA !== liveB) return liveA - liveB;

    const distA = a.distanceKm ?? 99;
    const distB = b.distanceKm ?? 99;
    return distA - distB;
  });
}

export function filterScheduleJobs(jobs: PartnerJob[], filter: ScheduleFilter): PartnerJob[] {
  const sorted = sortScheduleJobs(jobs);
  switch (filter) {
    case 'today':
      return sorted.filter((j) => j.visitDate.toLowerCase().includes('today'));
    case 'in_progress':
      return sorted.filter((j) => j.status === 'in_progress');
    case 'this_week':
      return sorted.filter(
        (j) =>
          j.visitDate === 'Today' ||
          j.visitDate === 'Tomorrow' ||
          /\bJun\b/i.test(j.visitDate) ||
          /\bSun\b/i.test(j.visitDate),
      );
    default:
      return sorted;
  }
}

export function scheduleFilterCount(jobs: PartnerJob[], filter: ScheduleFilter): number {
  return filterScheduleJobs(jobs, filter).length;
}

export interface ScheduleSlotGroup {
  label: string;
  sub: string;
  jobs: PartnerJob[];
}

const SLOT_GROUPS: { id: string; label: string; sub: string; match: (job: PartnerJob) => boolean }[] = [
  {
    id: 'morning',
    label: 'Morning window',
    sub: 'Mon–Sat · 8–11 AM',
    match: (j) => j.slotLabel.includes('8–11') || j.slotLabel.includes('8-11'),
  },
  {
    id: 'afternoon',
    label: 'Afternoon window',
    sub: 'Mon–Sat · 2–5 PM',
    match: (j) => j.slotLabel.includes('2–5') || j.slotLabel.includes('2-5'),
  },
  {
    id: 'sunday',
    label: 'Sunday window',
    sub: 'Sun · 8–11 AM',
    match: (j) => j.slotLabel.toLowerCase().includes('sun'),
  },
];

export function groupScheduleBySlot(jobs: PartnerJob[]): ScheduleSlotGroup[] {
  const groups: ScheduleSlotGroup[] = [];

  for (const slot of SLOT_GROUPS) {
    const list = sortScheduleJobs(jobs.filter(slot.match));
    if (list.length) groups.push({ label: slot.label, sub: slot.sub, jobs: list });
  }

  const matched = new Set(groups.flatMap((g) => g.jobs.map((j) => j.id)));
  const other = sortScheduleJobs(jobs.filter((j) => !matched.has(j.id)));
  if (other.length) {
    groups.push({ label: 'Other visits', sub: 'Outside preferred windows', jobs: other });
  }

  return groups;
}

export function groupScheduleByVisit(jobs: PartnerJob[]): { label: string; jobs: PartnerJob[] }[] {
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
    if (list?.length) groups.push({ label, jobs: sortScheduleJobs(list) });
  }
  return groups;
}

export function scheduleWeekEarnings(jobs: PartnerJob[]): number {
  return jobs.reduce((sum, j) => sum + netEarningPaise(j.amountPaise), 0);
}

export function scheduleTodayCount(jobs: PartnerJob[]): number {
  return jobs.filter((j) => j.visitDate.toLowerCase().includes('today')).length;
}

export function scheduleInProgressCount(jobs: PartnerJob[]): number {
  return jobs.filter((j) => j.status === 'in_progress').length;
}

export function scheduleNextJob(jobs: PartnerJob[]): PartnerJob | null {
  return sortScheduleJobs(jobs)[0] ?? null;
}

export function weekGlanceDots(jobs: PartnerJob[]): boolean[] {
  const hasToday = jobs.some((j) => j.visitDate.toLowerCase().includes('today'));
  const hasTomorrow = jobs.some((j) => j.visitDate.toLowerCase().includes('tomorrow'));
  const hasMidWeek = jobs.some((j) => !['Today', 'Tomorrow'].includes(j.visitDate));
  return [true, hasToday || hasMidWeek, hasToday || hasTomorrow, hasMidWeek, hasMidWeek, hasMidWeek, hasTomorrow || hasMidWeek];
}

export function scheduleWeekGoalPct(earningsPaise: number, goalPaise: number): number {
  if (goalPaise <= 0) return 0;
  return Math.min(100, Math.round((earningsPaise / goalPaise) * 100));
}

export function sortCompletedJobs(jobs: PartnerJob[]): PartnerJob[] {
  return [...jobs].sort((a, b) => {
    const order = { Today: 0, Tomorrow: 1 };
    const dayA = order[a.visitDate as keyof typeof order] ?? 2;
    const dayB = order[b.visitDate as keyof typeof order] ?? 2;
    return dayA - dayB;
  });
}
