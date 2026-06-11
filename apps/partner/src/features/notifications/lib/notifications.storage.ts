import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import { DEMO_NOTIFICATIONS, type PartnerNotification } from '@/constants/demo';

import type { AppNotification } from '../types/notification.types';

async function getReadIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.notificationsRead);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

async function getStored(): Promise<PartnerNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.notificationsInbox);
    if (!raw) return [];
    return JSON.parse(raw) as PartnerNotification[];
  } catch {
    return [];
  }
}

function withReadState(items: PartnerNotification[], readIds: Set<string>): AppNotification[] {
  return items.map((n) => ({ ...n, read: readIds.has(n.id) }));
}

export async function getNotifications(): Promise<AppNotification[]> {
  const [stored, readIds] = await Promise.all([getStored(), getReadIds()]);
  const demoIds = new Set(DEMO_NOTIFICATIONS.map((n) => n.id));
  const uniqueStored = stored.filter((n) => !demoIds.has(n.id));
  const merged = withReadState([...uniqueStored, ...DEMO_NOTIFICATIONS], readIds);

  return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUnreadCount(): Promise<number> {
  const all = await getNotifications();
  return all.filter((n) => !n.read).length;
}

export async function getNotificationById(id: string): Promise<AppNotification | null> {
  const all = await getNotifications();
  return all.find((n) => n.id === id) ?? null;
}

export async function markNotificationRead(id: string): Promise<void> {
  const readIds = await getReadIds();
  readIds.add(id);
  await AsyncStorage.setItem(STORAGE_KEYS.notificationsRead, JSON.stringify([...readIds]));
}

export async function markAllNotificationsRead(ids: string[]): Promise<void> {
  const readIds = await getReadIds();
  ids.forEach((id) => readIds.add(id));
  await AsyncStorage.setItem(STORAGE_KEYS.notificationsRead, JSON.stringify([...readIds]));
}
