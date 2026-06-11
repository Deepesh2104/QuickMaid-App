import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  VISIT_LOCATION_BRIDGE_KEY,
  type VisitLocationBridgeStore,
} from '../../../../shared/visit-location-bridge';

const KEY = '@qmp/visit_location_pings_v1';

export interface VisitLocationPing {
  jobId: string;
  lat: number;
  lng: number;
  recordedAt: string;
}

type PingStore = Record<string, VisitLocationPing[]>;

const listeners = new Set<() => void>();

export function subscribeVisitLocationChanged(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notifyVisitLocationChanged(): void {
  listeners.forEach((cb) => cb());
}

async function readStore(): Promise<PingStore> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PingStore) : {};
  } catch {
    return {};
  }
}

export async function appendVisitLocationPing(
  jobId: string,
  lat: number,
  lng: number,
  bookingRef?: string,
  partnerName?: string,
): Promise<VisitLocationPing> {
  const store = await readStore();
  const ping: VisitLocationPing = {
    jobId,
    lat,
    lng,
    recordedAt: new Date().toISOString(),
  };
  const list = store[jobId] ?? [];
  store[jobId] = [...list, ping].slice(-120);
  await AsyncStorage.setItem(KEY, JSON.stringify(store));

  if (bookingRef) {
    try {
      const raw = await AsyncStorage.getItem(VISIT_LOCATION_BRIDGE_KEY);
      const bridge: VisitLocationBridgeStore = raw ? JSON.parse(raw) : {};
      bridge[bookingRef] = {
        bookingRef,
        jobId,
        lat,
        lng,
        recordedAt: ping.recordedAt,
        partnerName,
      };
      await AsyncStorage.setItem(VISIT_LOCATION_BRIDGE_KEY, JSON.stringify(bridge));
    } catch {
      /* bridge optional */
    }
  }

  notifyVisitLocationChanged();
  return ping;
}

export async function getVisitLocationPings(jobId: string): Promise<VisitLocationPing[]> {
  const store = await readStore();
  return store[jobId] ?? [];
}

export async function getLatestVisitLocationPing(jobId: string): Promise<VisitLocationPing | null> {
  const list = await getVisitLocationPings(jobId);
  return list.length ? list[list.length - 1] : null;
}
