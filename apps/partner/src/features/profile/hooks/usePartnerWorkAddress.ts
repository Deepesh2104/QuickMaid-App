import { useCallback, useMemo } from 'react';

import type { PartnerSavedAddress } from '@/constants/app';
import { usePartner } from '@/context/PartnerContext';
import {
  getDefaultPartnerAddress,
  getWorkAddressLine,
  getWorkAddressTitle,
  normalizePartnerAddresses,
  profileWithAddresses,
  selectDefaultAddress,
  upsertPartnerAddress,
} from '@/features/profile/lib/address.utils';

export function usePartnerWorkAddress() {
  const { profile, updateProfile } = usePartner();

  const addresses = useMemo(() => normalizePartnerAddresses(profile), [profile]);
  const defaultAddress = useMemo(() => getDefaultPartnerAddress(profile), [profile]);
  const workTitle = useMemo(() => getWorkAddressTitle(profile), [profile]);
  const workLine = useMemo(() => getWorkAddressLine(profile), [profile]);

  const selectAddress = useCallback(
    async (addr: PartnerSavedAddress) => {
      if (!profile || addr.isDefault) return;
      const next = selectDefaultAddress(addresses, addr.id);
      await updateProfile(profileWithAddresses(profile, next));
    },
    [profile, addresses, updateProfile],
  );

  const saveAddress = useCallback(
    async (input: Omit<PartnerSavedAddress, 'isDefault'> & { isDefault?: boolean }) => {
      if (!profile) return;
      const next = upsertPartnerAddress(addresses, input);
      await updateProfile(profileWithAddresses(profile, next));
    },
    [profile, addresses, updateProfile],
  );

  return {
    addresses,
    defaultAddress,
    workTitle,
    workLine,
    selectAddress,
    saveAddress,
  };
}
