import type { EarningRow, PartnerJob } from '@/constants/demo';
import { DEMO_EARNINGS } from '@/constants/demo';
import type { PartnerProfile } from '@/constants/app';
import { PAYOUT_SCHEDULE } from '@/features/earnings/constants/earnings.premium';
import { netEarningPaise } from '@/features/home/lib/home.greeting';
import type { PayoutDetailView, PayoutJobLine, PayoutStatus } from '@/features/payout/types/payout.types';

const DEMO_BATCH_LINES: Record<string, PayoutJobLine[]> = {
  e5: [
    { bookingRef: 'QM-72834501', title: 'Deep clean · Meera P.', netPaise: 31400, date: '28 May' },
    { bookingRef: 'QM-72934502', title: 'Regular clean · Arjun K.', netPaise: 22400, date: '29 May' },
    { bookingRef: 'QM-73034503', title: 'Kitchen focus · Divya R.', netPaise: 35900, date: '30 May' },
    { bookingRef: 'QM-72490109', title: 'Regular clean · Kiran S.', netPaise: 22400, date: '1 Jun' },
    { bookingRef: 'QM-70234505', title: 'Utensils · Rohan T.', netPaise: 15900, date: '2 Jun' },
  ],
  e6: [
    { bookingRef: 'QM-71923401', title: 'Regular clean · Priya N.', netPaise: 26900, date: '19 May' },
    { bookingRef: 'QM-72123402', title: 'Deep clean · Suresh V.', netPaise: 40400, date: '21 May' },
    { bookingRef: 'QM-72423403', title: 'Kitchen focus · Lakshmi D.', netPaise: 31200, date: '24 May' },
  ],
};

const DEMO_BATCH_META: Record<
  string,
  { utr: string; batchPeriod: string; processedLabel: string; status: PayoutStatus }
> = {
  e5: {
    utr: 'QMPT8839201847',
    batchPeriod: '26 May – 2 Jun',
    processedLabel: '3 Jun · 7:42 PM',
    status: 'sent',
  },
  e6: {
    utr: 'QMPT7721084551',
    batchPeriod: '19 May – 25 May',
    processedLabel: '27 May · 8:15 PM',
    status: 'sent',
  },
};

export function maskUpi(upiId?: string): string {
  if (!upiId?.trim()) return 'UPI not set';
  const [name, bank] = upiId.split('@');
  if (!bank) return upiId;
  const masked = name.length <= 4 ? '••••' : `${name.slice(0, 2)}••••${name.slice(-2)}`;
  return `${masked}@${bank}`;
}

function grossFromNet(netPaise: number): number {
  return Math.round(netPaise / 0.9);
}

function feeFromGross(grossPaise: number, netPaise: number): number {
  return grossPaise - netPaise;
}

function linesFromCredits(rows: EarningRow[]): PayoutJobLine[] {
  return rows
    .filter((r) => r.kind === 'credit')
    .map((r) => ({
      bookingRef: r.subtitle,
      title: r.title,
      netPaise: r.amountPaise,
      date: r.date,
    }));
}

function upcomingLines(jobs: PartnerJob[]): PayoutJobLine[] {
  const weekCredits = DEMO_EARNINGS.filter(
    (r) => r.kind === 'credit' && (r.date === 'Today' || r.date === 'Yesterday'),
  );
  const lines = linesFromCredits(weekCredits);

  const completedPending = jobs.filter((j) => j.status === 'completed');
  for (const job of completedPending) {
    const alreadyListed = lines.some((l) => l.bookingRef === job.bookingRef);
    const inLedger = DEMO_EARNINGS.some((r) => r.subtitle === job.bookingRef && r.kind === 'credit');
    if (!alreadyListed && !inLedger) {
      const serviceShort = job.service.replace(/\s*·\s*[\d.]+h$/i, '').trim();
      lines.push({
        bookingRef: job.bookingRef,
        title: `${serviceShort} · ${job.customerName}`,
        netPaise: netEarningPaise(job.amountPaise),
        date: job.visitDate,
      });
    }
  }

  return lines;
}

export function getPayoutEarningRow(id: string): EarningRow | null {
  return DEMO_EARNINGS.find((r) => r.id === id && r.kind === 'payout') ?? null;
}

export function buildUpcomingPayout(profile: PartnerProfile | null, jobs: PartnerJob[]): PayoutDetailView {
  const lines = upcomingLines(jobs);
  const netPaise = lines.reduce((sum, l) => sum + l.netPaise, 0);
  const grossPaise = grossFromNet(netPaise);
  const feePaise = feeFromGross(grossPaise, netPaise);

  return {
    id: 'upcoming',
    status: 'scheduled',
    title: 'Next weekly payout',
    amountPaise: netPaise,
    upiMask: maskUpi(profile?.upiId),
    batchPeriod: 'This week · in progress',
    scheduledLabel: `Next ${PAYOUT_SCHEDULE.day} · ${PAYOUT_SCHEDULE.window}`,
    lines,
    grossPaise,
    feePaise,
    netPaise,
  };
}

export function buildPayoutDetail(
  id: string,
  profile: PartnerProfile | null,
  jobs: PartnerJob[],
): PayoutDetailView | null {
  if (id === 'upcoming') return buildUpcomingPayout(profile, jobs);

  const row = getPayoutEarningRow(id);
  if (!row) return null;

  const meta = DEMO_BATCH_META[id];
  const lines = DEMO_BATCH_LINES[id] ?? [];
  const netPaise = Math.abs(row.amountPaise);
  const grossPaise = grossFromNet(netPaise);
  const feePaise = feeFromGross(grossPaise, netPaise);

  return {
    id,
    status: meta?.status ?? 'sent',
    title: row.title,
    amountPaise: netPaise,
    upiMask: maskUpi(profile?.upiId ?? row.subtitle.replace('UPI ', '')),
    batchPeriod: meta?.batchPeriod ?? row.date,
    processedLabel: meta?.processedLabel ?? row.date,
    utr: meta?.utr,
    lines,
    grossPaise,
    feePaise,
    netPaise,
  };
}

export function latestPayoutId(): string {
  const payout = DEMO_EARNINGS.find((r) => r.kind === 'payout');
  return payout?.id ?? 'e5';
}
