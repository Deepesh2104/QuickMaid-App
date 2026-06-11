import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { PartnerProfile, PartnerRuntimeState } from '@/constants/app';
import { emitDispatchEvent } from '@/features/jobs/lib/dispatch.events';
import { notifyUnlistedPendingOffers } from '@/features/jobs/lib/dispatch.notifications';
import {
  getPartnerProfile,
  getPartnerState,
  savePartnerProfile,
  savePartnerState,
} from '@/lib/storage';

interface PartnerContextValue {
  profile: PartnerProfile | null;
  state: PartnerRuntimeState;
  loading: boolean;
  refresh: () => Promise<void>;
  setOnline: (online: boolean) => Promise<void>;
  updateProfile: (patch: Partial<PartnerProfile>) => Promise<void>;
}

const PartnerContext = createContext<PartnerContextValue | null>(null);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [state, setState] = useState<PartnerRuntimeState>({
    isOnline: false,
    todayEarningsPaise: 0,
    weekJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [p, s] = await Promise.all([getPartnerProfile(), getPartnerState()]);
    setProfile(p);
    setState(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setOnline = useCallback(
    async (online: boolean) => {
      const next = { ...state, isOnline: online };
      setState(next);
      await savePartnerState(next);
      if (online) {
        emitDispatchEvent({ type: 'online_pulse' });
        await notifyUnlistedPendingOffers();
      }
    },
    [state],
  );

  const updateProfile = useCallback(
    async (patch: Partial<PartnerProfile>) => {
      if (!profile) return;
      const next = { ...profile, ...patch };
      setProfile(next);
      await savePartnerProfile(next);
    },
    [profile],
  );

  const value = useMemo(
    () => ({ profile, state, loading, refresh, setOnline, updateProfile }),
    [profile, state, loading, refresh, setOnline, updateProfile],
  );

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used within PartnerProvider');
  return ctx;
}
