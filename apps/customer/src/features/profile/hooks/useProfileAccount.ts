import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UserProfile } from '@/constants/app';
import { getUserProfile, registerUser, saveUserProfile } from '@/lib/storage';

import { getProfileCompletion } from '../lib/profile.completion';
import { getProfileAccount, newId, saveProfileAccount } from '../lib/profile.storage';
import { normalizeAddress } from '../lib/profile.utils';
import type {
  BookingPrefs,
  CommunicationPrefs,
  EmergencyContact,
  NotificationPrefs,
  PaymentMethod,
  ProfileAccountData,
  SavedAddress,
  VisitAccess,
} from '../types/profile.types';

export function useProfileAccount() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [p, a] = await Promise.all([getUserProfile(), getProfileAccount()]);
    setProfile(p);
    setAccount(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persistAccount = useCallback(async (next: ProfileAccountData) => {
    setAccount(next);
    await saveProfileAccount(next);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!profile) return;
      const next = { ...profile, ...patch };
      setProfile(next);
      await saveUserProfile(next);
      await registerUser(next);
    },
    [profile],
  );

  const upsertAddress = useCallback(
    async (addr: Omit<SavedAddress, 'id' | 'line'> & { id?: string; line?: string }) => {
      if (!account) return;
      const addresses = [...account.addresses];
      const idx = addr.id ? addresses.findIndex((a) => a.id === addr.id) : -1;
      const id = addr.id ?? newId('addr');
      const entry = normalizeAddress({ ...addr, id });
      if (idx >= 0) addresses[idx] = entry;
      else addresses.push(entry);
      const normalized = addr.isDefault
        ? addresses.map((a) => ({ ...a, isDefault: a.id === id }))
        : addresses;
      await persistAccount({ ...account, addresses: normalized });
    },
    [account, persistAccount],
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      if (!account) return;
      let addresses = account.addresses.filter((a) => a.id !== id);
      if (addresses.length && !addresses.some((a) => a.isDefault)) {
        addresses = addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
      }
      await persistAccount({ ...account, addresses });
    },
    [account, persistAccount],
  );

  const upsertPayment = useCallback(
    async (pm: Omit<PaymentMethod, 'id'> & { id?: string }) => {
      if (!account) return;
      const payments = [...account.payments];
      const idx = pm.id ? payments.findIndex((p) => p.id === pm.id) : -1;
      const id = pm.id ?? newId('pay');
      const entry: PaymentMethod = { id, type: pm.type, label: pm.label, detail: pm.detail, isDefault: pm.isDefault, icon: pm.icon };
      if (idx >= 0) payments[idx] = entry;
      else payments.push(entry);
      const normalized = pm.isDefault
        ? payments.map((p) => ({ ...p, isDefault: p.id === id }))
        : payments;
      await persistAccount({ ...account, payments: normalized });
    },
    [account, persistAccount],
  );

  const deletePayment = useCallback(
    async (id: string) => {
      if (!account) return;
      let payments = account.payments.filter((p) => p.id !== id);
      if (payments.length && !payments.some((p) => p.isDefault)) {
        payments = payments.map((p, i) => ({ ...p, isDefault: i === 0 }));
      }
      await persistAccount({ ...account, payments });
    },
    [account, persistAccount],
  );

  const topUpWallet = useCallback(
    async (amount: number) => {
      if (!account || amount <= 0) return;
      await persistAccount({ ...account, walletBalance: account.walletBalance + amount });
    },
    [account, persistAccount],
  );

  const setNotificationPrefs = useCallback(
    async (prefs: NotificationPrefs) => {
      if (!account) return;
      await persistAccount({ ...account, notificationPrefs: prefs });
    },
    [account, persistAccount],
  );

  const setLanguage = useCallback(
    async (language: 'en' | 'hi') => {
      if (!account) return;
      await persistAccount({ ...account, language });
    },
    [account, persistAccount],
  );

  const setBookingPrefs = useCallback(
    async (bookingPrefs: BookingPrefs) => {
      if (!account) return;
      await persistAccount({ ...account, bookingPrefs });
    },
    [account, persistAccount],
  );

  const setEmergencyContact = useCallback(
    async (emergencyContact: EmergencyContact) => {
      if (!account) return;
      await persistAccount({ ...account, emergencyContact });
    },
    [account, persistAccount],
  );

  const setVisitAccess = useCallback(
    async (visitAccess: VisitAccess) => {
      if (!account) return;
      await persistAccount({ ...account, visitAccess });
    },
    [account, persistAccount],
  );

  const setCommunication = useCallback(
    async (communication: CommunicationPrefs) => {
      if (!account) return;
      await persistAccount({ ...account, communication });
    },
    [account, persistAccount],
  );

  const setPermissions = useCallback(
    async (permissions: Partial<ProfileAccountData['permissions']>) => {
      if (!account) return;
      await persistAccount({ ...account, permissions: { ...account.permissions, ...permissions } });
    },
    [account, persistAccount],
  );

  const completion = useMemo(
    () => (account ? getProfileCompletion(profile, account) : { percent: 0, missing: [], total: 13, done: 0 }),
    [profile, account],
  );

  return {
    profile,
    account,
    loading,
    refresh,
    completion,
    updateProfile,
    upsertAddress,
    deleteAddress,
    upsertPayment,
    deletePayment,
    topUpWallet,
    setNotificationPrefs,
    setLanguage,
    setBookingPrefs,
    setEmergencyContact,
    setVisitAccess,
    setCommunication,
    setPermissions,
  };
}
