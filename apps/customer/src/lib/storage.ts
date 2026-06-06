import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS, UserProfile } from '../constants/app';

type RegisteredUsersMap = Record<string, UserProfile>;

async function getRegisteredUsersMap(): Promise<RegisteredUsersMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.registeredUsers);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RegisteredUsersMap;
  } catch {
    return {};
  }
}

export async function getOnboardingDone(): Promise<boolean> {
  const v = await AsyncStorage.getItem(STORAGE_KEYS.onboardingDone);
  return v === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingDone, 'true');
}

export async function getAuthComplete(): Promise<boolean> {
  const v = await AsyncStorage.getItem(STORAGE_KEYS.authComplete);
  return v === 'true';
}

export async function setAuthComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.authComplete, 'true');
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
}

export async function getRegisteredUser(phone: string): Promise<UserProfile | null> {
  if (!phone) return null;
  const map = await getRegisteredUsersMap();
  return map[phone] ?? null;
}

export async function isReturningUser(phone: string): Promise<boolean> {
  const user = await getRegisteredUser(phone);
  return Boolean(user?.name?.trim() && user.phone === phone);
}

export async function registerUser(profile: UserProfile): Promise<void> {
  const map = await getRegisteredUsersMap();
  map[profile.phone] = profile;
  await AsyncStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(map));
}

/** Existing user: restore session and go to home. */
export async function signInExistingUser(phone: string): Promise<UserProfile | null> {
  const profile = await getRegisteredUser(phone);
  if (!profile) return null;
  await saveUserProfile(profile);
  await setAuthComplete();
  return profile;
}

/** New user: save profile and register phone for future sign-ins. */
export async function completeRegistration(profile: UserProfile): Promise<void> {
  await saveUserProfile(profile);
  await registerUser(profile);
  await setAuthComplete();
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.authComplete,
    STORAGE_KEYS.userProfile,
  ]);
}

export async function getInitialRoute(): Promise<'/(auth)/onboarding' | '/(auth)/login' | '/(tabs)'> {
  const [onboardingDone, authComplete] = await Promise.all([
    getOnboardingDone(),
    getAuthComplete(),
  ]);

  if (authComplete) return '/(tabs)';
  if (onboardingDone) return '/(auth)/login';
  return '/(auth)/onboarding';
}
