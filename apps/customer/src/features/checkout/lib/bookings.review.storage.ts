import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_BOOKINGS, type DemoBooking } from '@/constants/demo';
import { STORAGE_KEYS } from '@/constants/app';
import { publishCustomerBookingStatus } from '@/lib/booking-status-bridge.storage';
import { getUserProfile } from '@/lib/storage';

import type { PlacedOrder } from '../types/checkout.types';

import {
  getStoredBookings,
} from './bookings.core.storage';

type BookingOverride = Partial<DemoBooking>;

async function getOverrides(): Promise<Record<string, BookingOverride>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.bookingOverrides);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BookingOverride>;
  } catch {
    return {};
  }
}

async function setOverride(id: string, patch: BookingOverride): Promise<void> {
  const overrides = await getOverrides();
  overrides[id] = { ...overrides[id], ...patch };
  await AsyncStorage.setItem(STORAGE_KEYS.bookingOverrides, JSON.stringify(overrides));
}

function orderToDemo(o: PlacedOrder): DemoBooking {
  return {
    id: o.id,
    service: o.service,
    icon: o.icon,
    date: o.date,
    time: o.time,
    maid: o.maid,
    price: o.price,
    status: o.status,
    address: o.address,
    bookingRef: o.bookingRef,
    duration: o.duration,
    maidId: o.maidId,
    maidRating: o.maidRating,
    maidJobs: o.maidJobs,
    completionOtp: o.completionOtp,
    maidAssignedAt: o.maidAssignedAt,
    partnerReassignPending: o.partnerReassignPending,
    lastDeclinedPartner: o.lastDeclinedPartner,
    otpVerifiedAt: o.otpVerifiedAt,
    completedAt: o.completedAt,
    visitDate: o.visitDate,
    slotId: o.slotId,
    slotLabel: o.slotLabel,
    rescheduledAt: o.rescheduledAt,
    amountPaid: o.amountPaid,
    walletUsed: o.walletUsed,
    paymentLabel: o.paymentLabel,
    cancelledAt: o.cancelledAt,
    cancelReason: o.cancelReason,
    refundAmount: o.refundAmount,
    refundStatus: o.refundStatus,
    refundTxnId: o.refundTxnId,
    reviewRating: o.reviewRating,
    reviewText: o.reviewText,
    reviewTags: o.reviewTags,
    reviewedAt: o.reviewedAt,
  };
}

function applyOverride(booking: DemoBooking, overrides: Record<string, BookingOverride>): DemoBooking {
  const patch = overrides[booking.id];
  return patch ? { ...booking, ...patch } : booking;
}

async function publishCustomerRatedBridge(
  booking: { id: string; bookingRef: string; service: string },
  review: { rating: number; text?: string; tags: string[] },
  reviewedAt: string,
): Promise<void> {
  const profile = await getUserProfile();
  const customerName = profile?.name?.trim() || 'Customer';
  await publishCustomerBookingStatus({
    bookingRef: booking.bookingRef,
    customerBookingId: booking.id,
    event: 'customer_rated',
    reviewRating: review.rating,
    reviewText: review.text?.trim() || undefined,
    reviewTags: review.tags,
    customerName,
    service: booking.service,
    updatedAt: reviewedAt,
  });
}

export async function submitBookingReview(
  id: string,
  review: { rating: number; text?: string; tags: string[] },
): Promise<DemoBooking | null> {
  const now = new Date().toISOString();
  const reviewFields = {
    reviewRating: review.rating,
    reviewText: review.text?.trim() || undefined,
    reviewTags: review.tags,
    reviewedAt: now,
  };

  const stored = await getStoredBookings();
  const idx = stored.findIndex((b) => b.id === id);

  if (idx >= 0) {
    if (stored[idx].status !== 'completed' || stored[idx].reviewedAt) return null;
    const updated: PlacedOrder = { ...stored[idx], ...reviewFields };
    stored[idx] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify(stored));
    await publishCustomerRatedBridge(updated, review, now);
    const overrides = await getOverrides();
    return applyOverride(orderToDemo(updated), overrides);
  }

  const demo = DEMO_BOOKINGS.find((b) => b.id === id);
  if (!demo || demo.status !== 'completed') return null;

  const overrides = await getOverrides();
  const merged = applyOverride(demo, overrides);
  if (merged.reviewedAt) return null;

  await setOverride(id, reviewFields);
  await publishCustomerRatedBridge(
    { id: demo.id, bookingRef: demo.bookingRef ?? demo.id, service: demo.service },
    review,
    now,
  );
  const nextOverrides = await getOverrides();
  return applyOverride(demo, nextOverrides);
}
