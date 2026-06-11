import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_PARTNER_PREFERENCES,
  getPartnerPreferences,
  savePartnerPreferences,
} from '@/features/settings/lib/settings.storage';
import type { PartnerAppPreferences } from '@/features/settings/types/settings.types';

export function usePartnerPreferences() {
  const [prefs, setPrefs] = useState<PartnerAppPreferences>(DEFAULT_PARTNER_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getPartnerPreferences();
    setPrefs(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update = useCallback(async (patch: Partial<PartnerAppPreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    await savePartnerPreferences(next);
  }, [prefs]);

  return { prefs, loading, refresh, update };
}
