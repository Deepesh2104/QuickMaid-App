import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/constants/app';

import type { AppLockSettings } from '../types/appLock.types';
import { DEFAULT_APP_LOCK_SETTINGS } from '../types/appLock.types';

const PIN_SECURE_KEY = '@qm/secure/app_lock_pin_hash';

const listeners = new Set<() => void>();

export function subscribeAppLockSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((fn) => fn());
}

async function readPinHash(): Promise<string | undefined> {
  try {
    const hash = await SecureStore.getItemAsync(PIN_SECURE_KEY);
    return hash ?? undefined;
  } catch {
    return undefined;
  }
}

async function writePinHash(pinHash?: string): Promise<void> {
  if (!pinHash) {
    await SecureStore.deleteItemAsync(PIN_SECURE_KEY).catch(() => {});
    return;
  }
  await SecureStore.setItemAsync(PIN_SECURE_KEY, pinHash);
}

export async function getAppLockSettings(): Promise<AppLockSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.appLockSettings);
  let base = { ...DEFAULT_APP_LOCK_SETTINGS };
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AppLockSettings;
      base = { ...DEFAULT_APP_LOCK_SETTINGS, ...parsed };
    } catch {
      // ignore
    }
  }
  const secureHash = await readPinHash();
  const legacyHash = base.pinHash;
  return {
    ...base,
    pinHash: secureHash ?? legacyHash,
  };
}

export async function saveAppLockSettings(settings: AppLockSettings): Promise<void> {
  const { pinHash, ...prefs } = settings;
  await AsyncStorage.setItem(STORAGE_KEYS.appLockSettings, JSON.stringify(prefs));
  await writePinHash(pinHash);
  notify();
}

export async function clearAppLockSettings(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.appLockSettings);
  await writePinHash(undefined);
  notify();
}
