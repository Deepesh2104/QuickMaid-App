import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { AppLockSettings } from '../types/appLock.types';
import { DEFAULT_APP_LOCK_SETTINGS } from '../types/appLock.types';

const listeners = new Set<() => void>();

export function subscribeAppLockSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((fn) => fn());
}

export async function getAppLockSettings(): Promise<AppLockSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.appLockSettings);
  if (!raw) return { ...DEFAULT_APP_LOCK_SETTINGS };
  try {
    const parsed = JSON.parse(raw) as AppLockSettings;
    return { ...DEFAULT_APP_LOCK_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_APP_LOCK_SETTINGS };
  }
}

export async function saveAppLockSettings(settings: AppLockSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.appLockSettings, JSON.stringify(settings));
  notify();
}

export async function clearAppLockSettings(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.appLockSettings);
  notify();
}
