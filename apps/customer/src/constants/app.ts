export const DEMO_OTP = '123456';

export const STORAGE_KEYS = {
  onboardingDone: '@qm/onboarding_done',
  authComplete: '@qm/auth_complete',
  userProfile: '@qm/user_profile',
  registeredUsers: '@qm/registered_users',
} as const;

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  email?: string;
  gender?: string;
  homeType?: string;
  locality?: string;
}
