import { useCallback, useEffect, useState } from 'react';

import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';
import { isServiceSaved, toggleSavedServiceIds } from '../lib/saved.services';

let cachedIds: string[] | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function refreshCache() {
  const account = await getProfileAccount();
  cachedIds = account.savedServiceIds ?? [];
  notify();
}

export function invalidateSavedServicesCache() {
  cachedIds = null;
}

export function useSavedServices() {
  const [ids, setIds] = useState<string[]>(cachedIds ?? []);

  useEffect(() => {
    const listener = () => setIds(cachedIds ?? []);
    listeners.add(listener);
    if (cachedIds == null) void refreshCache();
    else setIds(cachedIds);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(async (serviceId: string) => {
    const account = await getProfileAccount();
    const next = toggleSavedServiceIds(account.savedServiceIds ?? [], serviceId);
    await saveProfileAccount({ ...account, savedServiceIds: next });
    cachedIds = next;
    notify();
  }, []);

  return {
    savedIds: ids,
    isSaved: (serviceId: string) => isServiceSaved(ids, serviceId),
    toggle,
    refresh: refreshCache,
  };
}
