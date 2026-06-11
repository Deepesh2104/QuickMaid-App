import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { PartnerAppPreferences } from '../types/settings.types';

export const DEFAULT_PARTNER_PREFERENCES: PartnerAppPreferences = {
  language: 'en',
  autoAssignOffers: true,
  jobAlerts: true,
  payoutAlerts: true,
  kycAlerts: true,
  hapticFeedback: true,
};

export async function getPartnerPreferences(): Promise<PartnerAppPreferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.partnerPreferences);
  if (!raw) return { ...DEFAULT_PARTNER_PREFERENCES };
  try {
    return { ...DEFAULT_PARTNER_PREFERENCES, ...(JSON.parse(raw) as Partial<PartnerAppPreferences>) };
  } catch {
    return { ...DEFAULT_PARTNER_PREFERENCES };
  }
}

export async function savePartnerPreferences(prefs: PartnerAppPreferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.partnerPreferences, JSON.stringify(prefs));
}
