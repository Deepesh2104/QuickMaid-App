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
    ],
  },
] as const;
