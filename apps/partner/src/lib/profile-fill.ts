import type { PartnerProfile } from '@/constants/app';
import { DEFAULT_PARTNER_PROFILE, DEMO_PARTNER_PHONE } from '@/constants/demo';

/** Fill missing profile fields from demo defaults (dev / incomplete registrations) */
export function fillPartnerProfileGaps(raw: PartnerProfile): PartnerProfile {
  const demo = DEFAULT_PARTNER_PROFILE;

  const addresses =
    raw.addresses?.length && raw.addresses.some((a) => a.line?.trim())
      ? raw.addresses
      : demo.addresses;

  const emergencyContact =
    raw.emergencyContact?.name?.trim() && raw.emergencyContact?.phone?.trim()
      ? raw.emergencyContact
      : demo.emergencyContact;

  return {
    ...demo,
    ...raw,
    firstName: raw.firstName?.trim() || demo.firstName,
    lastName: raw.lastName?.trim() || demo.lastName,
    name: raw.name?.trim() || demo.name,
    dateOfBirth: raw.dateOfBirth?.trim() || demo.dateOfBirth,
    gender: raw.gender ?? demo.gender,
    maritalStatus: raw.maritalStatus ?? demo.maritalStatus,
    email: raw.email?.trim() || demo.email,
    phone: raw.phone?.replace(/\D/g, '').slice(-10) || demo.phone,
    alternatePhone: raw.alternatePhone?.trim() || demo.alternatePhone,
    city: raw.city?.trim() || demo.city,
    zone: raw.zone?.trim() || demo.zone,
    skills: raw.skills?.length ? raw.skills : demo.skills,
    languages: raw.languages?.length ? raw.languages : demo.languages,
    experienceYears: raw.experienceYears ?? demo.experienceYears,
    travelMode: raw.travelMode ?? demo.travelMode,
    workRadiusKm: raw.workRadiusKm ?? demo.workRadiusKm,
    bio: raw.bio?.trim() || demo.bio,
    emergencyContact,
    addresses,
    upiId: raw.upiId?.trim() || demo.upiId,
    kycStatus:
      raw.kycStatus ??
      (raw.phone?.replace(/\D/g, '').slice(-10) === DEMO_PARTNER_PHONE ? demo.kycStatus : 'pending'),
    preferredSlotIds: raw.preferredSlotIds?.length ? raw.preferredSlotIds : demo.preferredSlotIds,
    publicId: raw.publicId?.trim() || demo.publicId,
    memberSince: raw.memberSince?.trim() || demo.memberSince,
  };
}

export function profileSnapshotChanged(before: PartnerProfile, after: PartnerProfile): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}
