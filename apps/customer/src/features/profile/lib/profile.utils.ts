import type { SavedAddress } from '../types/profile.types';

const STANDARD_LABELS = new Set(['Home', 'Office', 'Other']);

export function getAddressDisplayLabel(addr: Pick<SavedAddress, 'label' | 'labelNote'>): string {
  if (addr.label === 'Other' && addr.labelNote?.trim()) return addr.labelNote.trim();
  return addr.label;
}

export function getAddressLabelIcon(label: string): 'home' | 'business' | 'location' {
  if (label === 'Home') return 'home';
  if (label === 'Office') return 'business';
  return 'location';
}

export function getAddressLabelIonicon(
  label: string,
  variant: 'outline' | 'filled' = 'outline',
): 'home' | 'business' | 'location' | 'home-outline' | 'business-outline' | 'location-outline' {
  const base = getAddressLabelIcon(label);
  if (variant === 'filled') return base;
  if (base === 'home') return 'home-outline';
  if (base === 'business') return 'business-outline';
  return 'location-outline';
}

export function formatAddressLine(addr: Partial<SavedAddress>): string {
  const parts = [
    addr.flatNo,
    addr.building,
    addr.street,
    addr.landmark,
    addr.zone,
    addr.city ?? 'Raipur',
    addr.pincode,
  ].filter((p) => p && String(p).trim());
  return parts.join(', ');
}

export function normalizeAddress(raw: Partial<SavedAddress> & { id: string }): SavedAddress {
  const street = raw.street?.trim() || raw.line?.trim() || '';
  const base = {
    id: raw.id,
    label: STANDARD_LABELS.has(raw.label ?? '') ? (raw.label ?? 'Home') : 'Other',
    labelNote:
      raw.labelNote?.trim() ||
      (raw.label && !STANDARD_LABELS.has(raw.label) ? raw.label.trim() : undefined),
    flatNo: raw.flatNo?.trim() || undefined,
    building: raw.building?.trim() || undefined,
    street,
    landmark: raw.landmark?.trim() || undefined,
    zone: raw.zone ?? 'Shankar Nagar',
    pincode: raw.pincode ?? '492001',
    city: raw.city ?? 'Raipur',
    gateCode: raw.gateCode?.trim() || undefined,
    contactPhone: raw.contactPhone?.trim() || undefined,
    isDefault: raw.isDefault ?? false,
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
  return {
    ...base,
    line: formatAddressLine(base) || street,
  };
}
