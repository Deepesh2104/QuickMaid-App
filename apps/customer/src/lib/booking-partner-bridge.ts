import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

import type { PlacedOrder } from '@/features/checkout/types/checkout.types';
import {
  BOOKING_PARTNER_BRIDGE_KEY,
  type BookingPartnerBridgePayload,
  bookingAmountPaise,
  buildPartnerBookingDeepLink,
} from '../../shared/booking-bridge';

async function readBridge(): Promise<BookingPartnerBridgePayload[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_PARTNER_BRIDGE_KEY);
    return raw ? (JSON.parse(raw) as BookingPartnerBridgePayload[]) : [];
  } catch {
    return [];
  }
}

function orderToBridge(
  order: PlacedOrder,
  customer?: { name?: string; phone?: string; publicId?: string },
): BookingPartnerBridgePayload {
  return {
    id: order.id,
    bookingRef: order.bookingRef,
    service: order.service,
    address: order.address,
    customerName: customer?.name?.trim() || 'Customer',
    customerPhone: customer?.phone,
    customerPublicId: customer?.publicId,
    zone: undefined,
    slotLabel: order.slotLabel ?? order.time,
    visitDate: order.date,
    amountPaise: bookingAmountPaise(order.priceNum),
    completionOtp: order.completionOtp,
    maidId: order.maidId,
    maidName: order.maid,
    createdAt: order.createdAt,
    consumed: false,
  };
}

/** Demo: enqueue booking for partner app + try deep link handoff. */
export async function pushBookingToPartnerBridge(
  order: PlacedOrder,
  customer?: { name?: string; phone?: string; publicId?: string },
): Promise<void> {
  const payload = orderToBridge(order, customer);
  const bridge = await readBridge();
  if (!bridge.some((b) => b.id === payload.id)) {
    await AsyncStorage.setItem(
      BOOKING_PARTNER_BRIDGE_KEY,
      JSON.stringify([payload, ...bridge]),
    );
  }

  const deeplink = buildPartnerBookingDeepLink(payload);
  try {
    const can = await Linking.canOpenURL(deeplink);
    if (can) await Linking.openURL(deeplink);
  } catch {
    // Partner app not installed — bridge queue still available on shared storage (simulator/web).
  }
}
