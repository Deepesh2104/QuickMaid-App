import type { PartnerProfile, PartnerSavedAddress } from '@/constants/app';

export function createAddressId() {
  return `addr-${Date.now().toString(36)}`;
}

export function normalizePartnerAddresses(profile: PartnerProfile | null): PartnerSavedAddress[] {
  if (profile?.addresses?.length) {
    const hasDefault = profile.addresses.some((a) => a.isDefault);
    if (hasDefault) return profile.addresses;
    return profile.addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }

  if (!profile) return [];

  return [
    {
      id: 'addr-fallback',
      label: 'Home',
      line: `${profile.zone}, Raipur`,
      zone: profile.zone,
      isDefault: true,
    },
  ];
}

export function getDefaultPartnerAddress(profile: PartnerProfile | null): PartnerSavedAddress | null {
  const list = normalizePartnerAddresses(profile);
  return list.find((a) => a.isDefault) ?? list[0] ?? null;
}

export function getAddressLabelText(addr: PartnerSavedAddress) {
  return addr.label === 'Home' ? 'Home' : 'Other';
}

export function getWorkAddressTitle(profile: PartnerProfile | null) {
  const addr = getDefaultPartnerAddress(profile);
  if (!addr) return 'Add work address';
  return `Work from · ${getAddressLabelText(addr)}`;
}

export function getWorkAddressLine(profile: PartnerProfile | null) {
  const addr = getDefaultPartnerAddress(profile);
  if (!addr) return 'Tap to set your base location';
  const shortLine = addr.line.split(',')[0]?.trim() ?? addr.line;
  return [shortLine, addr.zone].filter(Boolean).join(' · ');
}

export function selectDefaultAddress(
  addresses: PartnerSavedAddress[],
  id: string,
): PartnerSavedAddress[] {
  return addresses.map((a) => ({ ...a, isDefault: a.id === id }));
}

export function upsertPartnerAddress(
  addresses: PartnerSavedAddress[],
  input: Omit<PartnerSavedAddress, 'isDefault'> & { isDefault?: boolean },
): PartnerSavedAddress[] {
  const exists = addresses.some((a) => a.id === input.id);
  const next: PartnerSavedAddress = {
    ...input,
    isDefault: input.isDefault ?? false,
  };

  let list = exists
    ? addresses.map((a) => (a.id === input.id ? { ...next, isDefault: a.isDefault || next.isDefault } : a))
    : [...addresses, next];

  if (next.isDefault || list.filter((a) => a.isDefault).length === 0) {
    list = selectDefaultAddress(list, next.id);
  }

  if (list.length === 1) {
    list = [{ ...list[0], isDefault: true }];
  }

  return list;
}

export function profileWithAddresses(
  profile: PartnerProfile,
  addresses: PartnerSavedAddress[],
): PartnerProfile {
  const active = addresses.find((a) => a.isDefault) ?? addresses[0];
  return {
    ...profile,
    addresses,
    zone: active?.zone ?? profile.zone,
  };
}
