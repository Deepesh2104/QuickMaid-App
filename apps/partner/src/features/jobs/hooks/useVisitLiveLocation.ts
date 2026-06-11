import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  appendVisitLocationPing,
  getVisitLocationPings,
  subscribeVisitLocationChanged,
} from '@/features/jobs/lib/visit-location.storage';

export type LiveLocationState = {
  sharing: boolean;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  coordsLabel: string | null;
  elapsedSec: number;
  pingCount: number;
};

export function useVisitLiveLocation(
  jobId: string,
  active: boolean,
  meta?: { bookingRef?: string; partnerName?: string },
) {
  const [state, setState] = useState<LiveLocationState>({
    sharing: false,
    loading: false,
    error: null,
    lastUpdated: null,
    coordsLabel: null,
    elapsedSec: 0,
    pingCount: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const refreshPingCount = useCallback(async () => {
    const pings = await getVisitLocationPings(jobId);
    setState((s) => ({ ...s, pingCount: pings.length }));
  }, [jobId]);

  useEffect(() => {
    void refreshPingCount();
    return subscribeVisitLocationChanged(() => void refreshPingCount());
  }, [jobId, refreshPingCount]);

  const stop = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState((s) => ({ ...s, sharing: false, loading: false }));
  }, []);

  const recordPing = useCallback(
    async (lat: number, lng: number) => {
      await appendVisitLocationPing(jobId, lat, lng, meta?.bookingRef, meta?.partnerName);
      const label = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setState((s) => ({
        ...s,
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        coordsLabel: label,
      }));
    },
    [jobId, meta?.bookingRef, meta?.partnerName],
  );

  const start = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'Location permission chahiye — settings se allow karo',
      }));
      return;
    }

    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    await recordPing(pos.coords.latitude, pos.coords.longitude);
    setState((s) => ({
      ...s,
      sharing: true,
      loading: false,
      error: null,
      elapsedSec: 0,
    }));

    timerRef.current = setInterval(() => {
      setState((s) => ({ ...s, elapsedSec: s.elapsedSec + 1 }));
    }, 1000);

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 25, timeInterval: 15000 },
      (update) => {
        void recordPing(update.coords.latitude, update.coords.longitude);
      },
    );
  }, [recordPing]);

  useEffect(() => {
    if (!active) stop();
    return () => stop();
  }, [active, stop]);

  return { ...state, start, stop };
};
