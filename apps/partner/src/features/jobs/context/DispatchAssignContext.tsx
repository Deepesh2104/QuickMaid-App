import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { usePartner } from '@/context/PartnerContext';
import { useAutoAssignDispatch } from '@/features/jobs/hooks/useAutoAssignDispatch';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';
import type { PartnerJob } from '@/constants/demo';

interface DispatchAssignContextValue {
  lastAssigned: PartnerJob | null;
  bannerMinimized: boolean;
  minimizeBanner: () => void;
  expandBanner: () => void;
  dismiss: () => void;
}

const DispatchAssignContext = createContext<DispatchAssignContextValue | null>(null);

/** Runs auto-assign on any tab when online — single instance avoids double booking. */
export function DispatchAssignProvider({ children }: { children: ReactNode }) {
  const { profile, state } = usePartner();
  const { pending, active, refresh } = usePartnerJobs();
  const { prefs } = usePartnerPreferences();
  const { lastAssigned, bannerMinimized, minimizeBanner, expandBanner, dismiss } = useAutoAssignDispatch({
    enabled: prefs.autoAssignOffers,
    pending,
    scheduled: active,
    profile,
    isOnline: state.isOnline,
    refresh,
    haptic: prefs.hapticFeedback,
  });

  const value = useMemo(
    () => ({ lastAssigned, bannerMinimized, minimizeBanner, expandBanner, dismiss }),
    [lastAssigned, bannerMinimized, minimizeBanner, expandBanner, dismiss],
  );

  return <DispatchAssignContext.Provider value={value}>{children}</DispatchAssignContext.Provider>;
}

const FALLBACK: DispatchAssignContextValue = {
  lastAssigned: null,
  bannerMinimized: false,
  minimizeBanner: () => {},
  expandBanner: () => {},
  dismiss: () => {},
};

export function useDispatchAssign() {
  return useContext(DispatchAssignContext) ?? FALLBACK;
}
