import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { PartnerJob } from '@/constants/demo';
import {
  BOOKING_PARTNER_BRIDGE_KEY,
  type BookingPartnerBridgePayload,
  parsePartnerBookingDeepLink,
} from '../../../../shared/booking-bridge';
import { emitDispatchEvent } from '@/features/jobs/lib/dispatch.events';
import { notifyNewManualOffer } from '@/features/jobs/lib/dispatch.notifications';
import { notifyPartnerJobsChanged } from '@/features/jobs/lib/jobs.events';
import { getPartnerState } from '@/lib/storage';
import { getPartnerJobs, savePartnerJobs } from '@/features/jobs/lib/jobs.storage';

export type { BookingPartnerBridgePayload };
export { parsePartnerBookingDeepLink };

async function readBridge(): Promise<BookingPartnerBridgePayload[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_PARTNER_BRIDGE_KEY);
    return raw ? (JSON.parse(raw) as BookingPartnerBridgePayload[]) : [];
  } catch {
    return [];
  }
}

async function writeBridge(rows: BookingPartnerBridgePayload[]): Promise<void> {
  await AsyncStorage.setItem(BOOKING_PARTNER_BRIDGE_KEY, JSON.stringify(rows));
}

export function bridgePayloadToPartnerJob(payload: BookingPartnerBridgePayload): PartnerJob {
  return {
    id: `cb_${payload.id}`,
    bookingRef: payload.bookingRef,
    customerName: payload.customerName ?? 'Customer',
    customerPhone: payload.customerPhone,
    service: payload.service,
    address: payload.address,
    zone: payload.zone ?? 'Shankar Nagar',
    slotLabel: payload.slotLabel ?? 'Flexible',
    visitDate: payload.visitDate?.includes('Today')
      ? 'Today'
      : payload.visitDate?.includes('Tomorrow')
        ? 'Tomorrow'
        : payload.visitDate || 'Upcoming',
    amountPaise: payload.amountPaise,
    status: 'pending',
    distanceKm: 2.8,
    completionOtp: payload.completionOtp ?? DEMO_VISIT_COMPLETION_OTP,
    customerBookingId: payload.id,
    customerPublicId: payload.customerPublicId,
    customerPreferredMaidName: payload.maidName,
    customerPreferredMaidId: payload.maidId,
  };
}

export async function ingestBookingBridgePayload(
  payload: BookingPartnerBridgePayload,
): Promise<PartnerJob | null> {
  const jobs = await getPartnerJobs();
  const exists = jobs.some(
    (j) => j.bookingRef === payload.bookingRef || j.customerBookingId === payload.id,
  );
  if (exists) return null;

  const job = bridgePayloadToPartnerJob(payload);
  await savePartnerJobs([job, ...jobs]);
  const { isOnline } = await getPartnerState();
  if (isOnline) {
    await notifyNewManualOffer(job);
    emitDispatchEvent({ type: 'new_offer', jobId: job.id, bookingRef: job.bookingRef });
  }

  const bridge = await readBridge();
  const idx = bridge.findIndex((b) => b.id === payload.id);
  if (idx >= 0) {
    bridge[idx] = { ...bridge[idx], consumed: true };
    await writeBridge(bridge);
  }

  return job;
}

/** Pull unconsumed customer bookings from shared bridge into partner pending jobs. */
export async function syncCustomerBookingBridge(): Promise<number> {
  const bridge = await readBridge();
  let added = 0;
  for (const row of bridge) {
    if (row.consumed) continue;
    const job = await ingestBookingBridgePayload(row);
    if (job) {
      row.consumed = true;
      added += 1;
    }
  }
  if (added) {
    await writeBridge(bridge);
    notifyPartnerJobsChanged();
  }
  return added;
}

export async function handlePartnerBookingDeepLink(url: string): Promise<PartnerJob | null> {
  const payload = parsePartnerBookingDeepLink(url);
  if (!payload) return null;
  return ingestBookingBridgePayload(payload);
}
