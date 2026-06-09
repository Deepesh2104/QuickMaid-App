import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
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

/** Demo: wipe local customer data and end session. */
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
    STORAGE_KEYS.appLockSettings,
  ]);

  await clearSession();
}
