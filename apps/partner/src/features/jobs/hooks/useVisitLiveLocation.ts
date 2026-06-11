import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

export type LiveLocationState = {
  sharing: boolean;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  coordsLabel: string | null;
  elapsedSec: number;
};

export function useVisitLiveLocation(active: boolean) {
  const [state, setState] = useState<LiveLocationState>({
    sharing: false,
    loading: false,
    error: null,
    lastUpdated: null,
    coordsLabel: null,
    elapsedSec: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const stop = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState((s) => ({ ...s, sharing: false, loading: false }));
  }, []);

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
    const label = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
    setState({
      sharing: true,
      loading: false,
      error: null,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      coordsLabel: label,
      elapsedSec: 0,
    });

    timerRef.current = setInterval(() => {
      setState((s) => ({ ...s, elapsedSec: s.elapsedSec + 1 }));
    }, 1000);

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 25, timeInterval: 15000 },
      (update) => {
        setState((s) => ({
          ...s,
          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          coordsLabel: `${update.coords.latitude.toFixed(4)}, ${update.coords.longitude.toFixed(4)}`,
        }));
      },
    );
  }, []);

  useEffect(() => {
    if (!active) stop();
    return () => stop();
  }, [active, stop]);

  return { ...state, start, stop };
}
