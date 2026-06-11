import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BOOKING_STATUS_APPLIED_KEY,
  BOOKING_STATUS_BRIDGE_KEY,
} from '../../../../shared/booking-status-bridge';
import { BOOKING_PARTNER_BRIDGE_KEY } from '../../../../shared/booking-bridge';
import { VISIT_COMPLETE_BRIDGE_KEY } from '../../../../shared/visit-complete-bridge';
import { VISIT_LOCATION_BRIDGE_KEY } from '../../../../shared/visit-location-bridge';
import { STORAGE_KEYS } from '@/constants/app';
import { clearAppLockSettings } from '@/features/security/lib/appLock.storage';
import { clearSession, getUserProfile } from '@/lib/storage';

async function removeRegisteredUser(phone: string): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.registeredUsers);
  if (!raw) return;
  try {
    const map = JSON.parse(raw) as Record<string, unknown>;
    delete map[phone];
    await AsyncStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(map));
  } catch {
    // ignore parse errors
  }
}

/** Demo: wipe all local customer data and end session. */
export async function deleteUserAccount(): Promise<void> {
  const profile = await getUserProfile();
  if (profile?.phone) {
    await removeRegisteredUser(profile.phone);
  }

  await AsyncStorage.multiRemove([
    STORAGE_KEYS.profileAccount,
    STORAGE_KEYS.userBookings,
    STORAGE_KEYS.bookingOverrides,
    STORAGE_KEYS.paymentHistory,
    STORAGE_KEYS.notificationsInbox,
    STORAGE_KEYS.notificationsRead,
    STORAGE_KEYS.pendingVisitComplete,
    STORAGE_KEYS.plusLastSubscription,
    STORAGE_KEYS.checkoutDraft,
    STORAGE_KEYS.referralLedger,
    STORAGE_KEYS.supportTickets,
    STORAGE_KEYS.bookingDisputes,
    STORAGE_KEYS.walletTransactions,
    STORAGE_KEYS.couponWallet,
    STORAGE_KEYS.pendingCoupon,
    BOOKING_PARTNER_BRIDGE_KEY,
    BOOKING_STATUS_BRIDGE_KEY,
    BOOKING_STATUS_APPLIED_KEY,
    VISIT_COMPLETE_BRIDGE_KEY,
    VISIT_LOCATION_BRIDGE_KEY,
    '@qm/push_device_token_v1',
  ]);

  await clearAppLockSettings();
  await clearSession();
}
