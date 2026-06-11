import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  VISIT_LOCATION_BRIDGE_KEY,
  type VisitLocationBridgeEntry,
} from '../../shared/visit-location-bridge';

export type { VisitLocationBridgeEntry };

export async function getPartnerLiveLocation(
  bookingRef: string,
): Promise<VisitLocationBridgeEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(VISIT_LOCATION_BRIDGE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw) as Record<string, VisitLocationBridgeEntry>;
    return store[bookingRef] ?? null;
  } catch {
    return null;
  }
}
