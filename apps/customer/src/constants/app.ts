export const DEMO_OTP = '123456';

export const STORAGE_KEYS = {
  onboardingDone: '@qm/onboarding_done',
  authComplete: '@qm/auth_complete',
  userProfile: '@qm/user_profile',
  registeredUsers: '@qm/registered_users',
  profileAccount: '@qm/profile_account',
  checkoutDraft: '@qm/checkout_draft',
  userBookings: '@qm/user_bookings',
  paymentHistory: '@qm/payment_history',
  bookingOverrides: '@qm/booking_overrides',
  pendingVisitComplete: '@qm/pending_visit_complete',
  notificationsInbox: '@qm/notifications_inbox',
  notificationsRead: '@qm/notifications_read',
  plusLastSubscription: '@qm/plus_last_subscription',
} as const;

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  email?: string;
  gender?: string;
  homeType?: string;
  locality?: string;
  /** Raipur service zone — maps to admin CRM `zone` */
  zone?: string;
  /** Local URI from image picker — maps to `avatar_url` in API */
  avatarUri?: string;
}
