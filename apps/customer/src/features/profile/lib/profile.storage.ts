import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { ProfileAccountData } from '../types/profile.types';
import { normalizeAddress } from './profile.utils';

const DEFAULT_ACCOUNT: ProfileAccountData = {
  addresses: [
    normalizeAddress({
      id: 'a1',
      label: 'Home',
      flatNo: 'Flat 204',
      building: 'Green Valley',
      street: 'Sector 5, Shankar Nagar',
      landmark: 'Near City Mall',
      zone: 'Shankar Nagar',
      pincode: '492001',
      city: 'Raipur',
      gateCode: '4421',
      contactPhone: '',
      isDefault: true,
      line: '',
    }),
    normalizeAddress({
      id: 'a2',
      label: 'Office',
      flatNo: '3rd Floor',
      building: 'Magneto Mall',
      street: 'G.E. Road',
      landmark: 'Opposite Telibandha Lake',
      zone: 'Telibandha',
      pincode: '492001',
      city: 'Raipur',
      isDefault: false,
      line: '',
    }),
  ],
  payments: [
    {
      id: 'p1',
      type: 'upi',
      label: 'Google Pay',
      detail: 'priya****@okaxis',
      isDefault: true,
      icon: 'phone-portrait-outline',
    },
    {
      id: 'p2',
      type: 'card',
      label: 'HDFC Debit',
      detail: '•••• 4821',
      isDefault: false,
      icon: 'card-outline',
    },
  ],
  walletBalance: 150,
  notificationPrefs: { booking: true, offers: true, pro: true, sms: false },
  bookingPrefs: {
    preferredSlot: 'morning',
    preferredSlotLabel: 'Mon–Sat · 8–11 AM',
    favoriteMaidName: 'Sunita Devi',
  },
  emergencyContact: {
    name: 'Rahul Sharma',
    phone: '9876501234',
    relation: 'Spouse',
  },
  visitAccess: {
    gateCode: '4421',
    hasPets: false,
    petNotes: '',
    parkingNotes: 'Basement slot B-12',
    visitInstructions: 'Call on arrival · Security will guide',
  },
  communication: {
    whatsappOptIn: true,
    preferredChannel: 'whatsapp',
  },
  permissions: {
    locationGranted: false,
    notificationsGranted: false,
  },
  plan: { type: 'plus', label: 'QuickMaid Plus · Monthly' },
  language: 'en',
  referralCode: 'PRIYA100',
  memberSince: 'Mar 2025',
  isPlusMember: true,
  plusVisitsLeft: 8,
  plusRenewDate: '1 Jul 2026',
  visits: 12,
  rating: '4.9',
  saved: '₹840',
  referrals: 2,
  supportTickets: 0,
  csat: 4.9,
  savedServiceIds: ['deep', 'monthly'],
};

function mergeAccount(parsed: Partial<ProfileAccountData>): ProfileAccountData {
  const merged = {
    ...DEFAULT_ACCOUNT,
    ...parsed,
    notificationPrefs: { ...DEFAULT_ACCOUNT.notificationPrefs, ...parsed.notificationPrefs },
    bookingPrefs: { ...DEFAULT_ACCOUNT.bookingPrefs, ...parsed.bookingPrefs },
    emergencyContact: { ...DEFAULT_ACCOUNT.emergencyContact, ...parsed.emergencyContact },
    visitAccess: { ...DEFAULT_ACCOUNT.visitAccess, ...parsed.visitAccess },
    communication: { ...DEFAULT_ACCOUNT.communication, ...parsed.communication },
    permissions: { ...DEFAULT_ACCOUNT.permissions, ...parsed.permissions },
    plan: { ...DEFAULT_ACCOUNT.plan, ...parsed.plan },
    savedServiceIds: parsed.savedServiceIds ?? DEFAULT_ACCOUNT.savedServiceIds,
  };
  merged.addresses = (parsed.addresses ?? DEFAULT_ACCOUNT.addresses).map((a) =>
    normalizeAddress({ ...a, id: a.id }),
  );
  return merged;
}

export async function getProfileAccount(): Promise<ProfileAccountData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.profileAccount);
  if (!raw) return { ...DEFAULT_ACCOUNT };
  try {
    return mergeAccount(JSON.parse(raw) as Partial<ProfileAccountData>);
  } catch {
    return { ...DEFAULT_ACCOUNT };
  }
}

const profileListeners = new Set<() => void>();

export function subscribeProfileAccount(listener: () => void): () => void {
  profileListeners.add(listener);
  return () => profileListeners.delete(listener);
}

function notifyProfileAccount() {
  profileListeners.forEach((fn) => fn());
}

export async function saveProfileAccount(data: ProfileAccountData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.profileAccount, JSON.stringify(data));
  notifyProfileAccount();
}

export async function patchProfileAccount(patch: Partial<ProfileAccountData>): Promise<ProfileAccountData> {
  const current = await getProfileAccount();
  const next = { ...current, ...patch };
  await saveProfileAccount(next);
  return next;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}
