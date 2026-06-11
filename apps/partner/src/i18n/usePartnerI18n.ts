import { useCallback } from 'react';

import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';

import { type PartnerStringKey, translatePartner } from './partner.strings';

export function usePartnerI18n() {
  const { prefs } = usePartnerPreferences();
  const t = useCallback(
    (key: PartnerStringKey) => translatePartner(prefs.language, key),
    [prefs.language],
  );
  return { t, language: prefs.language };
}
