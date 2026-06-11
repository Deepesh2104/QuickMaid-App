/** Cross-app live GPS ping store keyed by bookingRef (demo AsyncStorage bridge). */

export const VISIT_LOCATION_BRIDGE_KEY = '@qm/visit_location_bridge_v1';

export interface VisitLocationBridgeEntry {
  bookingRef: string;
  jobId: string;
  lat: number;
  lng: number;
  recordedAt: string;
  partnerName?: string;
}

export type VisitLocationBridgeStore = Record<string, VisitLocationBridgeEntry>;
