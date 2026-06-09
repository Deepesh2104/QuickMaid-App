import type { Ionicons } from '@expo/vector-icons';

export interface SavedAddress {
  id: string;
  label: string;
  /** When label is "Other" — whose place / how to identify it (e.g. Mom's home). */
  labelNote?: string;
  flatNo?: string;
  building?: string;
  street: string;
  line: string;
  landmark?: string;
  zone: string;
  pincode: string;
  city: string;
  gateCode?: string;
  contactPhone?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet';
  label: string;
  detail: string;
  isDefault: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface NotificationPrefs {
  booking: boolean;
  offers: boolean;
  pro: boolean;
  sms: boolean;
}

export interface BookingPrefs {
  preferredSlot: string;
  preferredSlotLabel: string;
  favoriteMaidName?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation?: string;
}

export interface VisitAccess {
  gateCode?: string;
  hasPets: boolean;
  petNotes?: string;
  parkingNotes?: string;
  visitInstructions?: string;
}

export interface CommunicationPrefs {
  whatsappOptIn: boolean;
  preferredChannel: 'whatsapp' | 'sms' | 'call';
}

export interface AppPermissions {
  locationGranted: boolean;
  notificationsGranted: boolean;
}

export interface CustomerPlan {
  type: 'instant' | 'monthly' | 'annual' | 'plus';
  label: string;
}

export interface ProfileAccountData {
  addresses: SavedAddress[];
  payments: PaymentMethod[];
  walletBalance: number;
  notificationPrefs: NotificationPrefs;
  bookingPrefs: BookingPrefs;
  emergencyContact: EmergencyContact;
  visitAccess: VisitAccess;
  communication: CommunicationPrefs;
  permissions: AppPermissions;
  plan: CustomerPlan;
  language: 'en' | 'hi';
  referralCode: string;
  memberSince: string;
  isPlusMember: boolean;
  plusVisitsLeft: number;
  plusRenewDate: string;
  plusPaused?: boolean;
  plusPausedUntil?: string;
  visits: number;
  rating: string;
  saved: string;
  referrals: number;
  supportTickets: number;
  csat: number;
  savedServiceIds: string[];
}

export type ProfileSheet =
  | { type: 'profile' }
  | { type: 'address'; id?: string }
  | { type: 'payment'; id?: string }
  | { type: 'wallet' }
  | { type: 'language' }
  | { type: 'bookingPrefs' }
  | { type: 'emergency' }
  | { type: 'visitAccess' };
