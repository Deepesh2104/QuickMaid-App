import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PartnerJob } from '@/constants/demo';
import {
  BOOKING_STATUS_APPLIED_KEY,
  BOOKING_STATUS_BRIDGE_KEY,
  type BookingStatusAppliedStore,
  type BookingStatusBridgeEntry,
  type BookingStatusBridgeStore,
} from '../../../../shared/booking-status-bridge';
import { appendPartnerNotification } from '@/features/notifications/lib/notifications.storage';
import { getPartnerJobs, patchPartnerJob, updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';

async function readStore(): Promise<BookingStatusBridgeStore> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_STATUS_BRIDGE_KEY);
    return raw ? (JSON.parse(raw) as BookingStatusBridgeStore) : {};
  } catch {
    return {};
  }
}

async function writeStore(store: BookingStatusBridgeStore): Promise<void> {
  await AsyncStorage.setItem(BOOKING_STATUS_BRIDGE_KEY, JSON.stringify(store));
}

async function readApplied(): Promise<BookingStatusAppliedStore> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_STATUS_APPLIED_KEY);
    return raw ? (JSON.parse(raw) as BookingStatusAppliedStore) : {};
  } catch {
    return {};
  }
}

async function writeApplied(applied: BookingStatusAppliedStore): Promise<void> {
  await AsyncStorage.setItem(BOOKING_STATUS_APPLIED_KEY, JSON.stringify(applied));
}

export async function getBookingStatusForRef(
  bookingRef: string,
): Promise<BookingStatusBridgeEntry | null> {
  const store = await readStore();
  return store[bookingRef] ?? null;
}

export async function getCustomerBridgeEvents(): Promise<BookingStatusBridgeEntry[]> {
  const store = await readStore();
  return Object.values(store).filter(
    (e) => e.event === 'customer_cancelled' || e.event === 'customer_rescheduled',
  );
}

export async function publishPartnerBookingStatus(
  entry: Omit<BookingStatusBridgeEntry, 'updatedAt'> & { updatedAt?: string },
): Promise<void> {
  const store = await readStore();
  const full: BookingStatusBridgeEntry = {
    ...entry,
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
  };
  store[entry.bookingRef] = full;
  await writeStore(store);
}

export function partnerStatusFromJob(
  job: PartnerJob,
  event: BookingStatusBridgeEntry['event'],
  partnerName?: string,
  extra?: Partial<BookingStatusBridgeEntry>,
): BookingStatusBridgeEntry {
  return {
    bookingRef: job.bookingRef,
    customerBookingId: job.customerBookingId,
    partnerJobId: job.id,
    event,
    partnerName,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

/** Apply customer cancel / reschedule events to partner jobs. */
export async function syncJobsFromCustomerStatusBridge(): Promise<number> {
  const [store, applied, jobs] = await Promise.all([readStore(), readApplied(), getPartnerJobs()]);
  let changes = 0;
  const nextApplied = { ...applied };

  for (const job of jobs) {
    const entry = store[job.bookingRef];
    if (!entry) continue;
    if (nextApplied[`partner:${job.bookingRef}`] === entry.updatedAt) continue;

    if (
      entry.event === 'customer_cancelled' &&
      (job.status === 'pending' || job.status === 'accepted' || job.status === 'in_progress')
    ) {
      await updatePartnerJobStatus(job.id, 'declined', {
        declineReason: entry.cancelReason ?? 'Customer cancelled booking',
      });
      await appendPartnerNotification({
        id: `cust-cancel-${job.bookingRef}-${entry.updatedAt}`,
        kind: 'system',
        title: 'Customer ne cancel kiya',
        body: `${job.service} · ${job.bookingRef}`,
        detail: entry.cancelReason ?? 'Customer cancelled this booking via app',
        time: 'Just now',
        createdAt: entry.updatedAt,
        jobId: job.id,
      });
      changes += 1;
      nextApplied[`partner:${job.bookingRef}`] = entry.updatedAt;
    }

    if (
      entry.event === 'customer_rescheduled' &&
      (job.status === 'pending' || job.status === 'accepted' || job.status === 'in_progress')
    ) {
      const patched = await patchPartnerJob(job.id, {
        visitDate: entry.visitDate ?? job.visitDate,
        slotLabel: entry.slotLabel ?? job.slotLabel,
      });
      if (patched) {
        await appendPartnerNotification({
          id: `cust-resched-${job.bookingRef}-${entry.updatedAt}`,
          kind: 'system',
          title: 'Customer ne reschedule kiya',
          body: `${patched.visitDate} · ${patched.slotLabel}`,
          detail: `${job.bookingRef} · ${job.customerName} updated visit slot`,
          time: 'Just now',
          createdAt: entry.updatedAt,
          jobId: job.id,
        });
        changes += 1;
      }
      nextApplied[`partner:${job.bookingRef}`] = entry.updatedAt;
    }
  }

  if (changes) await writeApplied(nextApplied);
  return changes;
}
