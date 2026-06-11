import type { PartnerAppPreferences } from '@/features/settings/types/settings.types';

export const PREFERENCE_LANGUAGE_OPTIONS = [
  { id: 'en' as const, label: 'English', sub: 'Default' },
  { id: 'hi' as const, label: 'हिंदी', sub: 'Hindi UI (demo)' },
] as const;

type BooleanPreferenceKey = 'jobAlerts' | 'payoutAlerts' | 'kycAlerts' | 'hapticFeedback';

export const PREFERENCE_TOGGLES: Array<{
  key: BooleanPreferenceKey;
  label: string;
  sub: string;
  icon: 'briefcase-outline' | 'wallet-outline' | 'shield-checkmark-outline' | 'phone-portrait-outline';
  tone: string;
  ink: string;
}> = [
  {
    key: 'jobAlerts',
    label: 'Job requests',
    sub: 'New offers & visit reminders in inbox',
    icon: 'briefcase-outline',
    tone: '#E6F4F2',
    ink: '#084F4A',
  },
  {
    key: 'payoutAlerts',
    label: 'Payout updates',
    sub: 'Monday UPI transfer confirmations',
    icon: 'wallet-outline',
    tone: '#EEF4FF',
    ink: '#175CD3',
  },
  {
    key: 'kycAlerts',
    label: 'KYC status',
    sub: 'Verification & document updates',
    icon: 'shield-checkmark-outline',
    tone: '#FFFBEB',
    ink: '#B45309',
  },
  {
    key: 'hapticFeedback',
    label: 'Haptic feedback',
    sub: 'Light vibration on taps & toggles',
    icon: 'phone-portrait-outline',
    tone: '#F4F3FF',
    ink: '#6D28D9',
  },
];

export const SETTINGS_STATS = [
  { value: 'v1.0', label: 'App version' },
  { value: 'Raipur', label: 'City' },
  { value: 'Secure', label: 'Account' },
] as const;

export const SETTINGS_SECTIONS = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'photo',
        label: 'Profile photo',
        sub: 'Verified partner badge',
        icon: 'camera-outline' as const,
        route: '/profile/photo' as const,
      },
      {
        id: 'rating',
        label: 'Partner rating',
        sub: 'Score, reviews & badges',
        icon: 'star-outline' as const,
        route: '/profile/rating' as const,
      },
      {
        id: 'slots',
        label: 'Work slots',
        sub: 'When you accept jobs',
        icon: 'time-outline' as const,
        route: '/slots' as const,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        sub: 'Job alerts, payouts & KYC',
        icon: 'notifications-outline' as const,
        route: '/notifications' as const,
      },
    ],
  },
  {
    id: 'earn',
    title: 'Jobs & earnings',
    items: [
      {
        id: 'history',
        label: 'Job history',
        sub: 'Completed visits & payouts',
        icon: 'archive-outline' as const,
        route: '/job/history' as const,
      },
      {
        id: 'referral',
        label: 'Refer a partner',
        sub: '₹500 bonus per referral',
        icon: 'gift-outline' as const,
        route: '/referral' as const,
      },
      {
        id: 'book-home',
        label: 'Book for my home',
        sub: 'Open customer app',
        icon: 'home-outline' as const,
        route: '/book-home' as const,
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        id: 'help',
        label: 'Help centre',
        sub: 'FAQ, chat & call',
        icon: 'chatbubbles-outline' as const,
        route: '/(tabs)/help' as const,
      },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    items: [
      {
        id: 'privacy',
        label: 'Privacy policy',
        sub: 'How we handle your data',
        icon: 'lock-closed-outline' as const,
        route: '/legal/privacy' as const,
      },
      {
        id: 'terms',
        label: 'Partner terms',
        sub: 'Service agreement & payouts',
        icon: 'document-text-outline' as const,
        route: '/legal/partner-terms' as const,
      },
      {
        id: 'referral-policy',
        label: 'Referral policy',
        sub: '₹500 bonus rules & eligibility',
        icon: 'gift-outline' as const,
        route: '/legal/referral-policy' as const,
      },
    ],
  },
] as const;
