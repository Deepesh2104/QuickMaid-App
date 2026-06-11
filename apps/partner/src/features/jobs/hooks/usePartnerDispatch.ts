import { useMemo } from 'react';

import type { PartnerProfile } from '@/constants/app';
import type { PartnerJob } from '@/constants/demo';
import {
  buildDispatchOffers,
  getPrimaryDispatchOffer,
  type DispatchOffer,
} from '@/features/jobs/lib/dispatch.utils';

export function usePartnerDispatch(
  pending: PartnerJob[],
  scheduled: PartnerJob[],
  profile: PartnerProfile | null,
  isOnline: boolean,
) {
  const offers = useMemo(
    () => buildDispatchOffers(pending, scheduled, profile, isOnline),
    [pending, scheduled, profile, isOnline],
  );

  const primaryOffer = useMemo(
    () => getPrimaryDispatchOffer(pending, scheduled, profile, isOnline),
    [pending, scheduled, profile, isOnline],
  );

  const moreOffers = useMemo(() => {
    if (!primaryOffer) return offers;
    return offers.filter((o) => o.id !== primaryOffer.id);
  }, [offers, primaryOffer]);

  return { offers, primaryOffer, moreOffers, offerCount: offers.length };
}

export type { DispatchOffer };
