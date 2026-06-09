import { RAIPUR_ZONES } from '@/constants/customer.zones';

export interface MapZone {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
  /** 0–1 position on stylized city map */
  mapX: number;
  mapY: number;
  pincode: string;
}

/** Raipur service zones with approximate coordinates for map picker */
export const MAP_ZONES: MapZone[] = [
  { value: 'shankar-nagar', label: 'Shankar Nagar', latitude: 21.2564, longitude: 81.6521, mapX: 0.62, mapY: 0.28, pincode: '492007' },
  { value: 'sector-5', label: 'Sector 5', latitude: 21.2528, longitude: 81.6488, mapX: 0.55, mapY: 0.34, pincode: '492001' },
  { value: 'telibandha', label: 'Telibandha', latitude: 21.2389, longitude: 81.6336, mapX: 0.38, mapY: 0.52, pincode: '492001' },
  { value: 'tatibandh', label: 'Tatibandh', latitude: 21.2312, longitude: 81.6214, mapX: 0.28, mapY: 0.62, pincode: '492099' },
  { value: 'pandri', label: 'Pandri', latitude: 21.2445, longitude: 81.6412, mapX: 0.48, mapY: 0.44, pincode: '492001' },
  { value: 'devendra-nagar', label: 'Devendra Nagar', latitude: 21.2612, longitude: 81.6388, mapX: 0.44, mapY: 0.22, pincode: '492001' },
  { value: 'mowa', label: 'Mowa', latitude: 21.2188, longitude: 81.6598, mapX: 0.72, mapY: 0.68, pincode: '492014' },
  { value: 'civil-lines', label: 'Civil Lines', latitude: 21.2514, longitude: 81.6296, mapX: 0.5, mapY: 0.38, pincode: '492001' },
];

export const RAIPUR_CENTER = { latitude: 21.2514, longitude: 81.6296 };

export function zoneByLabel(label: string): MapZone | undefined {
  return MAP_ZONES.find((z) => z.label === label) ?? MAP_ZONES.find((z) => z.value === label);
}

export function nearestMapZone(latitude: number, longitude: number): MapZone {
  let best = MAP_ZONES[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const zone of MAP_ZONES) {
    const d = (zone.latitude - latitude) ** 2 + (zone.longitude - longitude) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = zone;
    }
  }
  return best;
}

export function filterMapZones(query: string): MapZone[] {
  const q = query.trim().toLowerCase();
  if (!q) return MAP_ZONES;
  return MAP_ZONES.filter((z) => z.label.toLowerCase().includes(q));
}

export function allZoneLabels(): string[] {
  return RAIPUR_ZONES.map((z) => z.label);
}
