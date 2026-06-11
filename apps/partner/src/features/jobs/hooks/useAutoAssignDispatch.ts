import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PartnerProfile } from '@/constants/app';
import type { PartnerJob } from '@/constants/demo';
import { autoAssignPrimaryOffer } from '@/features/jobs/lib/dispatch.assign';
import { notifyJobAutoAssigned } from '@/features/jobs/lib/dispatch.notifications';
import { useRealtimeDispatch } from '@/features/jobs/hooks/useRealtimeDispatch';

const ASSIGN_COOLDOWN_MS = 4000;

interface UseAutoAssignDispatchOptions {
  enabled: boolean;
  pending: PartnerJob[];
  scheduled: PartnerJob[];
  profile: PartnerProfile | null;
  isOnline: boolean;
  refresh: () => Promise<void>;
  haptic?: boolean;
}

export function useAutoAssignDispatch({
  enabled,
  pending,
  scheduled,
  profile,
  isOnline,
  refresh,
  haptic = true,
}: UseAutoAssignDispatchOptions) {
  const [lastAssigned, setLastAssigned] = useState<PartnerJob | null>(null);
  const [bannerMinimized, setBannerMinimized] = useState(false);
  const running = useRef(false);
  const lastRunAt = useRef(0);

  const runAssign = useCallback(async () => {
    if (!enabled || !isOnline || running.current) return null;

    const now = Date.now();
    if (now - lastRunAt.current < ASSIGN_COOLDOWN_MS) return null;

    running.current = true;
    try {
      const assigned = await autoAssignPrimaryOffer(pending, scheduled, profile, isOnline);
      lastRunAt.current = Date.now();
      if (assigned) {
        setLastAssigned(assigned);
        setBannerMinimized(false);
        if (haptic) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        await notifyJobAutoAssigned(assigned);
        await refresh();
      }
      return assigned;
    } finally {
      running.current = false;
    }
  }, [enabled, pending, scheduled, profile, isOnline, refresh, haptic]);

  useFocusEffect(
    useCallback(() => {
      void runAssign();
    }, [runAssign]),
  );

  useEffect(() => {
    if (!enabled || !isOnline) return;
    const t = setTimeout(() => void runAssign(), 800);
    return () => clearTimeout(t);
  }, [enabled, isOnline, pending.length, runAssign]);

  useRealtimeDispatch(() => void runAssign(), enabled && isOnline);

  useEffect(() => {
    if (!enabled || !isOnline) return;
    const pulse = setInterval(() => void runAssign(), 12_000);
    return () => clearInterval(pulse);
  }, [enabled, isOnline, runAssign]);

  const minimizeBanner = useCallback(() => setBannerMinimized(true), []);
  const expandBanner = useCallback(() => setBannerMinimized(false), []);
  const dismiss = useCallback(() => {
    setLastAssigned(null);
    setBannerMinimized(false);
  }, []);

  return {
    lastAssigned,
    bannerMinimized,
    minimizeBanner,
    expandBanner,
    dismiss,
    runAssign,
  };
}
