import { HOME_SERVICES, type ServiceItem } from '@/constants/services';

export function resolveSavedServices(ids: string[]): ServiceItem[] {
  const set = new Set(ids);
  return HOME_SERVICES.filter((s) => set.has(s.id));
}

export function isServiceSaved(ids: string[], serviceId: string): boolean {
  return ids.includes(serviceId);
}

export function toggleSavedServiceIds(ids: string[], serviceId: string): string[] {
  if (ids.includes(serviceId)) return ids.filter((id) => id !== serviceId);
  return [serviceId, ...ids];
}
