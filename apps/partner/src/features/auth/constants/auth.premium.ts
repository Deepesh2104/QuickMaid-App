export const AUTH_PREMIUM = {
  heroGradient: ['#032A28', '#084F4A', '#0B6E67'] as const,
  sheetBg: '#EFF8F7',
  sheetOverlap: 14,
} as const;

export const LOGIN_STATS = [
  { value: '4.9★', label: 'Partner rating' },
  { value: 'Mon', label: 'UPI payout' },
  { value: 'Raipur', label: 'Service zones' },
] as const;

export const LOGIN_TRUST = [
  { icon: 'shield-checkmark-outline' as const, text: 'Aadhaar-verified network' },
  { icon: 'wallet-outline' as const, text: 'Weekly earnings to UPI' },
  { icon: 'calendar-outline' as const, text: 'Pick slots that fit your day' },
] as const;

export const ONBOARDING_STATS = [
  { value: '3', label: 'Quick steps' },
  { value: '4.9★', label: 'Top partners' },
  { value: 'Raipur', label: 'Your city' },
] as const;

export const APPLY_STATS = [
  { value: '24h', label: 'KYC review' },
  { value: 'Mon', label: 'First payout' },
  { value: 'Demo', label: 'Jobs now' },
] as const;

export const APPLY_STEPS = [
  { icon: 'person-outline' as const, title: 'Your profile', sub: 'Name, zone & skills for dispatch' },
  { icon: 'shield-outline' as const, title: 'KYC later', sub: 'Upload documents from Profile when ready' },
  { icon: 'briefcase-outline' as const, title: 'Start earning', sub: 'Accept demo jobs while verification runs' },
] as const;
