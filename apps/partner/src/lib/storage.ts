import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PartnerGender, PartnerProfile, PartnerRuntimeState } from '../constants/app';
import { ACCOUNT_DELETION_GRACE_DAYS, STORAGE_KEYS } from '../constants/app';
import { DEFAULT_PARTNER_PROFILE } from '../constants/demo';
import { fillPartnerProfileGaps, profileSnapshotChanged } from './profile-fill';
import {
  dobFromMaidId,
  fullNameFromParts,
  generateMaidId,
  isLegacyMaidId,
  isLegacyShortMaidId,
  isValidMaidId,
} from './quickmaid-ids';

type RegisteredMap = Record<string, PartnerProfile>;

const DEFAULT_STATE: PartnerRuntimeState = {
  isOnline: false,
  todayEarningsPaise: 44900,
  weekJobs: 6,
};

const DELETION_GRACE_MS = ACCOUNT_DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000;

export function accountDeletionPurgeAt(requestedAt: string): Date {
  return new Date(new Date(requestedAt).getTime() + DELETION_GRACE_MS);
}

export function isWithinDeletionGracePeriod(profile: PartnerProfile): boolean {
  if (!profile.deletionRequestedAt) return false;
  return Date.now() < accountDeletionPurgeAt(profile.deletionRequestedAt).getTime();
}

async function getRegisteredMap(): Promise<RegisteredMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.registeredPartners);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RegisteredMap;
  } catch {
    return {};
  }
}

export async function getOnboardingDone(): Promise<boolean> {
  return (await AsyncStorage.getItem(STORAGE_KEYS.onboardingDone)) === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingDone, 'true');
}

export async function getAuthComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(STORAGE_KEYS.authComplete)) === 'true';
}

export async function setAuthComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.authComplete, 'true');
}

function normalizePartnerProfile(raw: PartnerProfile): PartnerProfile {
  const filled = fillPartnerProfileGaps(raw);
  const parts = filled.name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const firstName = filled.firstName?.trim() || parts[0] || 'Partner';
  const lastName = filled.lastName?.trim() || (parts.length > 1 ? parts.slice(1).join(' ') : '');
  let dateOfBirth = filled.dateOfBirth?.trim() ?? '';
  if (!dateOfBirth) {
    dateOfBirth = dobFromMaidId(filled.publicId) ?? '';
  }
  let publicId = filled.publicId?.trim();
  if (publicId && (isLegacyMaidId(publicId) || isLegacyShortMaidId(publicId))) {
    publicId = generateMaidId(firstName, lastName, dateOfBirth);
  } else if (!publicId || !isValidMaidId(publicId)) {
    publicId = generateMaidId(firstName, lastName, dateOfBirth);
  }
  return {
    ...filled,
    firstName,
    lastName,
    name: filled.name?.trim() || fullNameFromParts(firstName, lastName),
    dateOfBirth,
    publicId,
  };
}

export async function getPartnerProfile(): Promise<PartnerProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerProfile);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PartnerProfile;
    const normalized = normalizePartnerProfile(parsed);
    if (profileSnapshotChanged(parsed, normalized)) {
      await AsyncStorage.setItem(STORAGE_KEYS.partnerProfile, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return null;
  }
}

export async function savePartnerProfile(profile: PartnerProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.partnerProfile, JSON.stringify(profile));
}

/** Dev / QA: reset KYC status on active session + registered phone record. */
export async function resetPartnerKycToPending(): Promise<PartnerProfile | null> {
  const profile = await getPartnerProfile();
  if (!profile) return null;

  const updated: PartnerProfile = { ...profile, kycStatus: 'pending' };
  await savePartnerProfile(updated);

  const map = await getRegisteredMap();
  if (map[profile.phone]) {
    map[profile.phone] = { ...map[profile.phone], kycStatus: 'pending' };
    await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));
  }

  return updated;
}

async function purgePartnerAccountPermanently(phone: string): Promise<void> {
  const map = await getRegisteredMap();
  delete map[phone];
  await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.authComplete,
    STORAGE_KEYS.partnerProfile,
    STORAGE_KEYS.partnerState,
    STORAGE_KEYS.kycDraft,
    STORAGE_KEYS.partnerJobs,
    STORAGE_KEYS.supportTickets,
    STORAGE_KEYS.notificationsRead,
    STORAGE_KEYS.notificationsInbox,
  ]);
}

async function purgeExpiredDeletionIfNeeded(phone: string, profile: PartnerProfile): Promise<boolean> {
  if (!profile.deletionRequestedAt) return false;
  if (isWithinDeletionGracePeriod(profile)) return false;
  await purgePartnerAccountPermanently(phone);
  return true;
}

export async function getRegisteredPartner(phone: string): Promise<PartnerProfile | null> {
  const map = await getRegisteredMap();
  const profile = map[phone];
  if (!profile) return null;
  if (await purgeExpiredDeletionIfNeeded(phone, profile)) return null;
  const normalized = normalizePartnerProfile(profile);
  if (profileSnapshotChanged(profile, normalized)) {
    map[phone] = normalized;
    await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));
  }
  return normalized;
}

export async function isReturningPartner(phone: string): Promise<boolean> {
  const p = await getRegisteredPartner(phone);
  return Boolean(p?.name?.trim() && p.phone === phone);
}

export async function registerPartner(profile: PartnerProfile): Promise<void> {
  const map = await getRegisteredMap();
  map[profile.phone] = profile;
  await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));
}

export async function signInExistingPartner(phone: string): Promise<PartnerProfile | null> {
  const profile = await getRegisteredPartner(phone);
  if (!profile) return null;

  let activeProfile = profile;
  if (profile.deletionRequestedAt && isWithinDeletionGracePeriod(profile)) {
    activeProfile = { ...profile, deletionRequestedAt: undefined };
    const map = await getRegisteredMap();
    map[phone] = activeProfile;
    await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));
  }

  await savePartnerProfile(activeProfile);
  await setAuthComplete();
  return activeProfile;
}

export async function completePartnerRegistration(profile: PartnerProfile): Promise<void> {
  await savePartnerProfile(profile);
  await registerPartner(profile);
  await setAuthComplete();
}

export async function getPartnerState(): Promise<PartnerRuntimeState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerState);
  if (!raw) return DEFAULT_STATE;
  try {
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as PartnerRuntimeState) };
  } catch {
    return DEFAULT_STATE;
  }
}

export async function savePartnerState(state: PartnerRuntimeState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.partnerState, JSON.stringify(state));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEYS.authComplete, STORAGE_KEYS.partnerProfile]);
}

/**
 * Soft-delete: marks account for purge after ACCOUNT_DELETION_GRACE_DAYS.
 * Session cleared immediately; login within grace period auto-restores the account.
 */
export async function deletePartnerAccount(phone: string): Promise<void> {
  const map = await getRegisteredMap();
  const sessionProfile = await getPartnerProfile();
  const profile = map[phone] ?? (sessionProfile?.phone === phone ? sessionProfile : null);
  if (!profile) {
    await clearSession();
    return;
  }

  const marked: PartnerProfile = {
    ...profile,
    deletionRequestedAt: new Date().toISOString(),
  };
  map[phone] = marked;
  await AsyncStorage.setItem(STORAGE_KEYS.registeredPartners, JSON.stringify(map));

  const state = await getPartnerState();
  await savePartnerState({ ...state, isOnline: false });

  await clearSession();
}

export async function getInitialRoute(): Promise<'/(auth)/onboarding' | '/(auth)/login' | '/(tabs)'> {
  const [onboardingDone, authComplete] = await Promise.all([getOnboardingDone(), getAuthComplete()]);
  if (authComplete) return '/(tabs)';
  if (onboardingDone) return '/(auth)/login';
  return '/(auth)/onboarding';
}

export function seedProfileFromApply(input: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: PartnerGender;
  maritalStatus?: PartnerProfile['maritalStatus'];
  email?: string;
  phone: string;
  alternatePhone?: string;
  zone: string;
  addressLine: string;
  landmark?: string;
  pincode: string;
  skills: string[];
  languages?: string[];
  experienceYears?: string;
  travelMode?: PartnerProfile['travelMode'];
  workRadiusKm?: number;
  bio?: string;
  emergencyContact?: PartnerProfile['emergencyContact'];
  upiId?: string;
  preferredSlotIds?: string[];
  referredByCode?: string;
}): PartnerProfile {
  const zone = input.zone.trim();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const registeredAt = new Date();
  return {
    ...DEFAULT_PARTNER_PROFILE,
    name: fullNameFromParts(firstName, lastName),
    firstName,
    lastName,
    dateOfBirth: input.dateOfBirth.trim(),
    gender: input.gender,
    maritalStatus: input.maritalStatus,
    email: input.email?.trim() || undefined,
    phone: input.phone,
    alternatePhone: input.alternatePhone?.trim() || undefined,
    zone,
    skills: input.skills,
    languages: input.languages?.length ? input.languages : ['Hindi'],
    experienceYears: input.experienceYears,
    travelMode: input.travelMode,
    workRadiusKm: input.workRadiusKm,
    bio: input.bio?.trim() || undefined,
    emergencyContact: input.emergencyContact,
    upiId: input.upiId?.trim() || undefined,
    addresses: [
      {
        id: `addr-${Date.now().toString(36)}`,
        label: 'Home',
        line: input.addressLine.trim(),
        landmark: input.landmark?.trim() || undefined,
        zone,
        pincode: input.pincode.trim(),
        isDefault: true,
      },
    ],
    kycStatus: 'pending',
    preferredSlotIds: input.preferredSlotIds?.length
      ? input.preferredSlotIds
      : ['morning', 'afternoon', 'sunday'],
    publicId: generateMaidId(firstName, lastName, input.dateOfBirth, registeredAt),
    memberSince: registeredAt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    referredByCode: input.referredByCode?.trim() || undefined,
  };
}
