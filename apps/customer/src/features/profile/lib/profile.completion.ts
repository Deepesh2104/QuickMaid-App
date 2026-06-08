import type { UserProfile } from '@/constants/app';

import type { ProfileAccountData } from '../types/profile.types';

const FIELDS: { key: string; label: string; check: (p: UserProfile | null, a: ProfileAccountData) => boolean }[] = [
  { key: 'photo', label: 'Profile photo', check: (p) => Boolean(p?.avatarUri) },
  { key: 'name', label: 'Full name', check: (p) => Boolean(p?.name?.trim()) },
  { key: 'email', label: 'Email', check: (p) => Boolean(p?.email?.trim()) },
  { key: 'locality', label: 'Locality', check: (p) => Boolean(p?.locality?.trim()) },
  { key: 'zone', label: 'Service zone', check: (p) => Boolean(p?.zone) },
  { key: 'gender', label: 'Gender', check: (p) => Boolean(p?.gender) },
  { key: 'homeType', label: 'Home type', check: (p) => Boolean(p?.homeType) },
  {
    key: 'address',
    label: 'Full address',
    check: (_, a) => a.addresses.some((x) => x.street && x.pincode && x.zone),
  },
  { key: 'payment', label: 'Payment method', check: (_, a) => a.payments.some((x) => x.type !== 'wallet') },
  { key: 'slot', label: 'Preferred slot', check: (_, a) => Boolean(a.bookingPrefs.preferredSlot) },
  {
    key: 'emergency',
    label: 'Emergency contact',
    check: (_, a) => Boolean(a.emergencyContact.name?.trim() && a.emergencyContact.phone?.length >= 10),
  },
  { key: 'gate', label: 'Gate / visit access', check: (_, a) => Boolean(a.visitAccess.gateCode?.trim() || a.visitAccess.visitInstructions?.trim()) },
  { key: 'whatsapp', label: 'WhatsApp updates', check: (_, a) => a.communication.whatsappOptIn },
];

export function getProfileCompletion(profile: UserProfile | null, account: ProfileAccountData) {
  const done = FIELDS.filter((f) => f.check(profile, account));
  const missing = FIELDS.filter((f) => !f.check(profile, account)).map((f) => f.label);
  const percent = Math.round((done.length / FIELDS.length) * 100);
  return { percent, missing, total: FIELDS.length, done: done.length };
}
