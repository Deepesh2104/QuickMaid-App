import { useCallback, useMemo } from 'react';

import { useTranslation } from '@/i18n/LanguageProvider';
import { useProfileAccount } from '@/features/profile/hooks/useProfileAccount';
import { getAddressDisplayLabel } from '@/features/profile/lib/profile.utils';
import type { SavedAddress } from '@/features/profile/types/profile.types';

export function useHomeDeliveryAddress() {
  const { t } = useTranslation();
  const { account, loading, refresh, upsertAddress } = useProfileAccount();

  const addresses = account?.addresses ?? [];

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0],
    [addresses],
  );

  const deliverTitle = defaultAddress
    ? getAddressDisplayLabel(defaultAddress)
    : account
      ? t('home.addAddress')
      : 'Raipur';

  const deliverLine = defaultAddress
    ? [defaultAddress.line.split(',')[0]?.trim() ?? defaultAddress.street, defaultAddress.zone]
        .filter(Boolean)
        .join(' · ')
    : t('home.tapPickMap');

  const selectAddress = useCallback(
    async (addr: SavedAddress) => {
      if (addr.isDefault) return;
      await upsertAddress({ ...addr, isDefault: true });
      await refresh();
    },
    [upsertAddress, refresh],
  );

  return {
    addresses,
    defaultAddress,
    deliverTitle,
    deliverLine,
    selectAddress,
    refresh,
    loading: loading && !account,
  };
}
