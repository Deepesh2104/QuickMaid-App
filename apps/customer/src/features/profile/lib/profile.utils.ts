import type { SavedAddress } from '../types/profile.types';

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
    label: raw.label ?? 'Home',
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
  };
  return {
    ...base,
    line: formatAddressLine(base) || street,
  };
}
