import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_BOOKINGS, type DemoBooking } from '@/constants/demo';
import { STORAGE_KEYS } from '@/constants/app';
import { addPaymentRecord } from '@/features/payment/lib/payment.storage';
import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';

import type { PlacedOrder } from '../types/checkout.types';

type BookingOverride = Partial<DemoBooking>;

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

function applyOverride(booking: DemoBooking, overrides: Record<string, BookingOverride>): DemoBooking {
  const patch = overrides[booking.id];
  return patch ? { ...booking, ...patch } : booking;
}

export async function getStoredBookings(): Promise<PlacedOrder[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.userBookings);
    if (!raw) return [];
    return JSON.parse(raw) as PlacedOrder[];
  } catch {
    return [];
  }
}

export async function addStoredBooking(order: PlacedOrder): Promise<void> {
  const existing = await getStoredBookings();
  await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify([order, ...existing]));
}

export async function getBookingById(id: string): Promise<DemoBooking | undefined> {
  const all = await getAllBookings();
  return all.find((b) => b.id === id);
}

export async function patchBookingById(
  id: string,
  patch: BookingOverride,
): Promise<DemoBooking | null> {
  const stored = await getStoredBookings();
  const idx = stored.findIndex((b) => b.id === id);

  if (idx >= 0) {
    const updated: PlacedOrder = { ...stored[idx], ...patch };
    stored[idx] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify(stored));
    const overrides = await getOverrides();
    return applyOverride(orderToDemo(updated), overrides);
  }

  const demo = DEMO_BOOKINGS.find((b) => b.id === id);
  if (!demo) return null;

  await setOverride(id, patch);
  const overrides = await getOverrides();
  return applyOverride(demo, overrides);
}

export async function rescheduleBookingById(
  id: string,
  patch: {
    visitDate: string;
    visitDateLabel: string;
    slotId: string;
    slotLabel: string;
    time: string;
    rescheduledAt: string;
  },
): Promise<DemoBooking | null> {
  const stored = await getStoredBookings();
  const idx = stored.findIndex((b) => b.id === id);

  if (idx >= 0) {
    const updated: PlacedOrder = {
      ...stored[idx],
      date: patch.visitDateLabel,
      time: patch.time,
      visitDate: patch.visitDate,
      slotId: patch.slotId,
      slotLabel: patch.slotLabel,
      rescheduledAt: patch.rescheduledAt,
    };
    stored[idx] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify(stored));
    const overrides = await getOverrides();
    return applyOverride(orderToDemo(updated), overrides);
  }

  const demo = DEMO_BOOKINGS.find((b) => b.id === id);
  if (!demo || demo.status !== 'upcoming') return null;

  await setOverride(id, {
    date: patch.visitDateLabel,
    time: patch.time,
    visitDate: patch.visitDate,
    slotId: patch.slotId,
    slotLabel: patch.slotLabel,
    rescheduledAt: patch.rescheduledAt,
  });

  const overrides = await getOverrides();
  return applyOverride(demo, overrides);
}

export async function cancelBookingById(
  id: string,
  patch: {
    cancelReason: string;
    refundAmount: number;
    refundTxnId: string;
    walletRefund: number;
    gatewayRefund: number;
    paymentLabel: string;
    bookingRef?: string;
  },
): Promise<DemoBooking | null> {
  const now = new Date().toISOString();
  const cancelFields = {
    status: 'cancelled' as const,
    cancelledAt: now,
    cancelReason: patch.cancelReason,
    refundAmount: patch.refundAmount,
    refundStatus: 'processing' as const,
    refundTxnId: patch.refundTxnId,
  };

  if (patch.walletRefund > 0) {
    const account = await getProfileAccount();
    await saveProfileAccount({
      ...account,
      walletBalance: account.walletBalance + patch.walletRefund,
    });
  }

  if (patch.gatewayRefund > 0) {
    await addPaymentRecord({
      id: patch.refundTxnId,
      gateway: 'razorpay',
      orderId: patch.bookingRef ?? id,
      paymentId: patch.refundTxnId,
      bookingRef: patch.bookingRef,
      amount: patch.gatewayRefund,
      walletUsed: 0,
      mode: 'upi',
      methodLabel: `${patch.paymentLabel} · Refund`,
      status: 'refunded',
      createdAt: now,
    });
  }

  const stored = await getStoredBookings();
  const idx = stored.findIndex((b) => b.id === id);

  if (idx >= 0) {
    const updated: PlacedOrder = { ...stored[idx], ...cancelFields };
    stored[idx] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify(stored));
    const overrides = await getOverrides();
    return applyOverride(orderToDemo(updated), overrides);
  }

  const demo = DEMO_BOOKINGS.find((b) => b.id === id);
  if (!demo || demo.status !== 'upcoming') return null;

  await setOverride(id, cancelFields);
  const overrides = await getOverrides();
  return applyOverride(demo, overrides);
}

export async function completeBookingById(id: string): Promise<DemoBooking | null> {
  const now = new Date().toISOString();
  const stored = await getStoredBookings();
  const idx = stored.findIndex((b) => b.id === id);

  if (idx >= 0) {
    const updated: PlacedOrder = {
      ...stored[idx],
      status: 'completed',
      otpVerifiedAt: now,
      completedAt: now,
    };
    stored[idx] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.userBookings, JSON.stringify(stored));
    const overrides = await getOverrides();
    return applyOverride(orderToDemo(updated), overrides);
  }

  const demo = DEMO_BOOKINGS.find((b) => b.id === id);
  if (!demo) return null;

  await setOverride(id, {
    status: 'completed',
    otpVerifiedAt: now,
    completedAt: now,
  });

  const overrides = await getOverrides();
  return applyOverride(demo, overrides);
}

export async function getAllBookings(): Promise<DemoBooking[]> {
  const [stored, overrides] = await Promise.all([getStoredBookings(), getOverrides()]);
  const userAsDemo: DemoBooking[] = stored.map((o) => applyOverride(orderToDemo(o), overrides));
  const demoIds = new Set(DEMO_BOOKINGS.map((b) => b.id));
  const uniqueUser = userAsDemo.filter((b) => !demoIds.has(b.id));
  const demoMerged = DEMO_BOOKINGS.map((b) => applyOverride(b, overrides));
  return [...uniqueUser, ...demoMerged];
}
