export const DEMO_OTP = '123456';

export const STORAGE_KEYS = {
  onboardingDone: '@qmp/onboarding_done',
  authComplete: '@qmp/auth_complete',
  partnerProfile: '@qmp/partner_profile',
  partnerState: '@qmp/partner_state',
  registeredPartners: '@qmp/registered_partners',
  supportTickets: '@qmp/partner_support_tickets',
  notificationsRead: '@qmp/partner_notifications_read',
  notificationsInbox: '@qmp/partner_notifications_inbox',
  partnerJobs: '@qmp/partner_jobs',
  kycDraft: '@qmp/partner_kyc_draft',
} as const;

export type KycStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export type PartnerGender = 'female' | 'male' | 'other';

export type PartnerMaritalStatus = 'single' | 'married' | 'widowed' | 'other';

export type PartnerTravelMode = 'walk' | 'cycle' | 'bus' | 'auto';

export type PartnerAddressLabel = 'Home' | 'Other';

export interface PartnerEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface PartnerSavedAddress {
  id: string;
  label: PartnerAddressLabel;
  line: string;
  landmark?: string;
  zone: string;
  pincode?: string;
  isDefault: boolean;
}

export interface PartnerProfile {
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: PartnerGender;
  maritalStatus?: PartnerMaritalStatus;
  email?: string;
  phone: string;
  alternatePhone?: string;
  city: string;
  zone: string;
  skills: string[];
  languages?: string[];
  experienceYears?: string;
  travelMode?: PartnerTravelMode;
  workRadiusKm?: number;
  bio?: string;
  emergencyContact?: PartnerEmergencyContact;
  addresses?: PartnerSavedAddress[];
  upiId?: string;
  kycStatus: KycStatus;
  /** Active dispatch windows — see slots picker */
  preferredSlotIds?: string[];
  /** Auto-generated maid ID */
  publicId?: string;
  memberSince?: string;
  /** Local profile photo URI */
  photoUri?: string;
}

export interface PartnerRuntimeState {
  isOnline: boolean;
  todayEarningsPaise: number;
  weekJobs: number;
}
