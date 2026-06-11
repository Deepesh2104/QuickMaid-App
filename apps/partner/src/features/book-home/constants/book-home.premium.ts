export const BOOK_HOME_STATS = [
  { value: '1 no.', label: 'Same phone' },
  { value: '2 apps', label: 'Dual role' },
  { value: 'Raipur', label: 'Service city' },
] as const;

export const BOOK_HOME_STEPS = [
  {
    icon: 'phone-portrait-outline' as const,
    title: 'Same number login',
    sub: 'Customer app mein wahi 10-digit number use karo',
  },
  {
    icon: 'calendar-outline' as const,
    title: 'Ghar ki safai book',
    sub: 'Slot choose karo — partner app alag rehti hai',
  },
  {
    icon: 'briefcase-outline' as const,
    title: 'Jobs yahi dikhengi',
    sub: 'Partner requests is app mein aati hain, bookings customer app mein',
  },
] as const;

export const BOOK_HOME_TRUST = [
  'Verified maids only — Aadhaar checked',
  'Pay after service on customer app',
  'Same wallet & address sync (API phase)',
] as const;
