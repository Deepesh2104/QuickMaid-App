export const profilePremium = {
  iconGradient: ['#084F4A', '#0B6E67'] as const,
  heroGradient: ['#032A28', '#084F4A', '#0B6E67'] as const,
  cardGradient: ['#E6F4F2', '#FFFFFF'] as const,
  goldGradient: ['#FFFBEB', '#FFFFFF'] as const,
} as const;

export const PARTNER_RATING = '4.9';
export const PARTNER_ON_TIME_RATE = '98%';
export const APP_VERSION = '1.0.0';

export const PROFILE_ACTIONS = [
  {
    id: 'photo',
    label: 'Profile photo',
    sub: 'Selfie for verified partner badge',
    icon: 'camera-outline' as const,
    route: '/profile/photo' as const,
  },
  {
    id: 'rating',
    label: 'Partner rating',
    sub: '4.9★ score, reviews & badges',
    icon: 'star-outline' as const,
    route: '/profile/rating' as const,
  },
  {
    id: 'referral',
    label: 'Refer a partner',
    sub: '₹500 bonus per successful referral',
    icon: 'gift-outline' as const,
    route: '/referral' as const,
  },
  {
    id: 'book-home',
    label: 'Book for my home',
    sub: 'Open customer app with same phone',
    icon: 'home-outline' as const,
    route: '/book-home' as const,
  },
  {
    id: 'history',
    label: 'Job history',
    sub: 'Completed visits & past payouts',
    icon: 'archive-outline' as const,
    route: '/job/history' as const,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    sub: 'Job alerts, payouts & KYC updates',
    icon: 'notifications-outline' as const,
    route: '/notifications' as const,
  },
  {
    id: 'help',
    label: 'Help centre',
    sub: 'FAQ, chat & call support',
    icon: 'chatbubbles-outline' as const,
    route: '/(tabs)/help' as const,
  },
] as const;

export const PROFILE_LEGAL_LINKS = [
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
] as const;
