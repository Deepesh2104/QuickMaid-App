import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DemoBooking } from '@/constants/demo';
import {
  VISIT_COMPLETE_BRIDGE_KEY,
  type VisitCompleteBridgePayload,
} from '../../../../shared/visit-complete-bridge';

import { completeBookingById, getBookingById } from '@/features/checkout/lib/bookings.core.storage';

export type VisitCompletePayload = VisitCompleteBridgePayload;

export async function setPendingVisitComplete(payload: VisitCompletePayload): Promise<void> {
  await AsyncStorage.setItem(VISIT_COMPLETE_BRIDGE_KEY, JSON.stringify(payload));
}

export async function consumePendingVisitComplete(): Promise<VisitCompletePayload | null> {
  try {
    const raw = await AsyncStorage.getItem(VISIT_COMPLETE_BRIDGE_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(VISIT_COMPLETE_BRIDGE_KEY);
    return JSON.parse(raw) as VisitCompletePayload;
  } catch {
    return null;
  }
}

/** Called when maid enters correct OTP on partner app (demo: manual trigger) */
export async function verifyMaidCompletionOtp(
  bookingId: string,
  otp: string,
): Promise<{ ok: true; booking: DemoBooking } | { ok: false; error: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) return { ok: false, error: 'Booking not found' };
  if (booking.status !== 'upcoming') return { ok: false, error: 'This visit is already closed' };
  if (!booking.completionOtp) return { ok: false, error: 'No completion OTP on this booking' };

  const entered = otp.replace(/\D/g, '').trim();
  if (entered !== booking.completionOtp) {
    return { ok: false, error: 'Invalid OTP. Ask your pro to enter the code you shared.' };
  }

  const completed = await completeBookingById(bookingId);
  if (!completed) return { ok: false, error: 'Could not update booking' };

  await setPendingVisitComplete({
    bookingId: completed.id,
    maidName: completed.maid,
    service: completed.service,
    completedAt: completed.completedAt ?? new Date().toISOString(),
  });

  return { ok: true, booking: completed };
}
