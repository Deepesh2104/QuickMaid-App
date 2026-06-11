import type { EarningRow } from '@/constants/demo';
import type { PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';

export type EarningsFilter = 'all' | 'credits' | 'payouts' | 'this_week';

const WEEK_DATES = new Set(['Today', 'Yesterday']);

export function formatRsSigned(paise: number): string {
  const n = paise / 100;
  const prefix = paise < 0 ? '-' : '+';
  return `${prefix}₹${Math.abs(n).toLocaleString('en-IN')}`;
}

export function earningsCredits(rows: EarningRow[]): EarningRow[] {
  return rows.filter((r) => r.kind === 'credit');
}

export function earningsPayouts(rows: EarningRow[]): EarningRow[] {
  return rows.filter((r) => r.kind === 'payout');
}

export function earningsCreditTotal(rows: EarningRow[]): number {
  return earningsCredits(rows).reduce((sum, r) => sum + r.amountPaise, 0);
}

export function earningsPayoutTotal(rows: EarningRow[]): number {
  return Math.abs(earningsPayouts(rows).reduce((sum, r) => sum + r.amountPaise, 0));
}

/** Net job credits earned this week (excludes payouts — those are transfers, not earnings). */
export function earningsWeekNet(rows: EarningRow[]): number {
  return earningsCreditTotal(filterEarnings(rows, 'this_week'));
}

export function earningsGrossFromNet(netPaise: number): number {
  return Math.round(netPaise / 0.9);
}

export function earningsFeeAmount(grossPaise: number): number {
  return grossPaise - netEarningPaise(grossPaise);
}

export function filterEarnings(rows: EarningRow[], filter: EarningsFilter): EarningRow[] {
  switch (filter) {
    case 'credits':
      return rows.filter((r) => r.kind === 'credit');
    case 'payouts':
      return rows.filter((r) => r.kind === 'payout');
    case 'this_week':
      return rows.filter((r) => WEEK_DATES.has(r.date) || r.date.includes('Jun'));
    default:
      return rows;
  }
}

export function earningsFilterCount(rows: EarningRow[], filter: EarningsFilter): number {
  return filterEarnings(rows, filter).length;
}

export function groupEarningsByDay(rows: EarningRow[]): { label: string; rows: EarningRow[] }[] {
  const order = ['Today', 'Yesterday'];
  const buckets = new Map<string, EarningRow[]>();

  for (const row of rows) {
    const key = order.includes(row.date) ? row.date : 'Earlier';
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  }

  const groups: { label: string; rows: EarningRow[] }[] = [];
  for (const label of [...order, 'Earlier']) {
    const list = buckets.get(label);
    if (list?.length) groups.push({ label, rows: list });
  }
  return groups;
}

export function pendingFromJobs(jobs: PartnerJob[]): number {
  const completed = jobs.filter((j) => j.status === 'completed');
  return completed.reduce((sum, j) => sum + netEarningPaise(j.amountPaise), 0);
}

export function scheduledEarnings(jobs: PartnerJob[]): number {
  const active = jobs.filter((j) => j.status === 'accepted' || j.status === 'in_progress');
  return active.reduce((sum, j) => sum + netEarningPaise(j.amountPaise), 0);
}

export function weekGoalPct(netPaise: number, goalPaise: number): number {
  if (goalPaise <= 0) return 0;
  return Math.min(100, Math.round((netPaise / goalPaise) * 100));
}

export function nextPayoutEstimate(creditNet: number, pendingCompleted: number): number {
  return creditNet + pendingCompleted;
}

function earningTitleFromJob(job: PartnerJob): string {
  const serviceShort = job.service.replace(/\s*·\s*[\d.]+h$/i, '').trim();
  return `${serviceShort} · ${job.customerName}`;
}

export function earningRowFromJob(job: PartnerJob): EarningRow {
  return {
    id: `job-${job.id}`,
    title: earningTitleFromJob(job),
    subtitle: job.bookingRef,
    amountPaise: netEarningPaise(job.amountPaise),
    kind: 'credit',
    date: job.visitDate,
  };
}

export function findEarningForJob(job: PartnerJob, rows: EarningRow[]): EarningRow | null {
  const byRef = rows.find((r) => r.subtitle === job.bookingRef && r.kind === 'credit');
  if (byRef) return byRef;
  if (job.status === 'completed') return earningRowFromJob(job);
  return null;
}
