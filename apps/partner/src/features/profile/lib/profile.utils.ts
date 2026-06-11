import type { KycStatus, PartnerGender, PartnerMaritalStatus, PartnerProfile, PartnerTravelMode } from '@/constants/app';
import { EXPERIENCE_OPTIONS, TRAVEL_MODE_OPTIONS } from '@/constants/demo';
import { resolveDateOfBirth, validateDateOfBirth } from '@/lib/quickmaid-ids';
import { colors } from '@/theme/colors';

const GENDER_LABELS: Record<PartnerGender, string> = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

const MARITAL_LABELS: Record<PartnerMaritalStatus, string> = {
  single: 'Single',
  married: 'Married',
  widowed: 'Widowed',
  other: 'Other',
};

export function genderLabel(gender?: PartnerGender) {
  return gender ? GENDER_LABELS[gender] : '—';
}

export function maritalLabel(status?: PartnerMaritalStatus) {
  return status ? MARITAL_LABELS[status] : '—';
}

export function travelLabel(mode?: PartnerTravelMode) {
  return TRAVEL_MODE_OPTIONS.find((t) => t.id === mode)?.label ?? '—';
}

export function experienceLabel(years?: string) {
  return EXPERIENCE_OPTIONS.find((e) => e.id === years)?.label ?? years ?? '—';
}

export function ageFromDob(profile: PartnerProfile | null): number | null {
  const dob = resolveDateOfBirth(profile?.dateOfBirth, profile?.publicId);
  if (!dob) return null;
  const match = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const birth = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  const ageMs = Date.now() - birth.getTime();
  return Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
}

export function kycMeta(status: KycStatus | undefined) {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified',
        hint: 'Payouts unlocked · documents on file',
        color: colors.success,
        bg: 'rgba(16,185,129,0.12)',
        icon: 'shield-checkmark' as const,
      };
    case 'under_review':
      return {
        label: 'Under review',
        hint: 'Usually cleared within 24–48 hours',
        color: colors.warning,
        bg: 'rgba(245,158,11,0.12)',
        icon: 'time-outline' as const,
      };
    case 'rejected':
      return {
        label: 'Needs attention',
        hint: 'Re-upload documents to unlock payouts',
        color: colors.error,
        bg: 'rgba(239,68,68,0.1)',
        icon: 'alert-circle-outline' as const,
      };
    default:
      return {
        label: 'Pending',
        hint: 'Upload Aadhaar & bank details for payouts',
        color: colors.warning,
        bg: 'rgba(245,158,11,0.12)',
        icon: 'shield-half-outline' as const,
      };
  }
}

export function normalizePhoneDigits(phone?: string) {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

export function maskPhone(phone?: string) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return 'Not linked';
  return `+91 ${digits.slice(0, 2)}•••••${digits.slice(-3)}`;
}

export function formatPhoneDisplay(phone?: string) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export type PartnerProfileEditPatch = Pick<
  PartnerProfile,
  | 'name'
  | 'firstName'
  | 'lastName'
  | 'dateOfBirth'
  | 'gender'
  | 'maritalStatus'
  | 'phone'
  | 'alternatePhone'
  | 'city'
  | 'zone'
  | 'skills'
  | 'languages'
  | 'experienceYears'
  | 'travelMode'
  | 'workRadiusKm'
  | 'bio'
  | 'emergencyContact'
  | 'upiId'
  | 'email'
  | 'addresses'
>;

export function validateProfileEdit(input: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  alternatePhone?: string;
  city: string;
  skills: string[];
  languages: string[];
  experienceYears?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  upiId: string;
  email?: string;
}) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = normalizePhoneDigits(input.phone);
  const alt = normalizePhoneDigits(input.alternatePhone);
  const city = input.city.trim();
  const upi = input.upiId.trim();
  const email = input.email?.trim() ?? '';
  const emergencyPhone = normalizePhoneDigits(input.emergencyPhone);

  if (firstName.length < 2) return 'Enter first name (min 2 letters)';
  if (lastName.length < 2) return 'Enter last name (min 2 letters)';
  const dobErr = validateDateOfBirth(input.dateOfBirth);
  if (dobErr) return dobErr;
  if (phone.length !== 10) return 'Enter a valid 10-digit mobile number';
  if (alt && alt.length !== 10) return 'Alternate mobile must be 10 digits';
  if (!city) return 'Enter your city';
  if (input.skills.length === 0) return 'Select at least one skill';
  if (input.languages.length === 0) return 'Select at least one language';
  if (!input.experienceYears) return 'Select your work experience';
  if (!input.emergencyName?.trim()) return 'Enter emergency contact name';
  if (emergencyPhone.length !== 10) return 'Enter valid emergency contact mobile';
  if (email && !email.includes('@')) return 'Enter a valid email or leave blank';
  if (upi && !upi.includes('@')) return 'UPI ID should look like name@bank';
  return null;
}

export function initials(name?: string) {
  const n = (name ?? 'P').trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return n.charAt(0).toUpperCase();
}

export interface ProfileCompletenessItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ProfileCompleteness {
  percent: number;
  items: ProfileCompletenessItem[];
  missing: string[];
}

export function profileCompleteness(
  profile: PartnerProfile | null,
  hasAddress: boolean,
): ProfileCompleteness {
  const items: ProfileCompletenessItem[] = [
    { id: 'name', label: 'Full name', done: Boolean(profile?.firstName?.trim() && profile?.lastName?.trim()) },
    { id: 'dob', label: 'Date of birth', done: Boolean(profile?.dateOfBirth?.trim()) },
    { id: 'skills', label: 'Skills listed', done: Boolean(profile?.skills?.length) },
    { id: 'languages', label: 'Languages', done: Boolean(profile?.languages?.length) },
    { id: 'experience', label: 'Experience', done: Boolean(profile?.experienceYears) },
    { id: 'emergency', label: 'Emergency contact', done: Boolean(profile?.emergencyContact?.name?.trim() && profile?.emergencyContact?.phone) },
    { id: 'base', label: 'Home address', done: hasAddress },
    { id: 'upi', label: 'Payout UPI', done: Boolean(profile?.upiId?.trim()) },
    { id: 'slots', label: 'Slots chosen', done: Boolean(profile?.preferredSlotIds?.length) },
    { id: 'kyc', label: 'KYC verified', done: profile?.kycStatus === 'verified' },
  ];
  const doneCount = items.filter((i) => i.done).length;
  const missing = items.filter((i) => !i.done).map((i) => i.label);

  return {
    percent: Math.round((doneCount / items.length) * 100),
    items,
    missing,
  };
}

export interface ProfilePerformanceStats {
  rating: string;
  onTimeRate: string;
  weekJobs: number;
  completedJobs: number;
}

export function profilePerformanceStats(
  weekJobs: number,
  completedJobs: number,
  rating = '4.9',
  onTimeRate = '98%',
): ProfilePerformanceStats {
  return { rating, onTimeRate, weekJobs, completedJobs };
}
