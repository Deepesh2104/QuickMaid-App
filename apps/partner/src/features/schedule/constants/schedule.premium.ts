import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const schedulePremium = {
  section: { marginBottom: spacing.section } as const,
  surface: {
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  } as const,
  pad: layout.pad,
  tealGradient: ['#E6F4F2', '#FFFFFF'] as const,
  goldGradient: ['#FFFBEB', '#FFFFFF'] as const,
};

export const SCHEDULE_FILTERS = [
  { id: 'all' as const, label: 'All visits', shortLabel: 'All', icon: 'layers-outline' as const },
  { id: 'today' as const, label: 'Today', shortLabel: 'Today', icon: 'today-outline' as const },
  { id: 'in_progress' as const, label: 'Live now', shortLabel: 'Live', icon: 'play-circle-outline' as const },
  { id: 'this_week' as const, label: 'This week', shortLabel: 'Week', icon: 'calendar-outline' as const },
];

export { PREFERRED_SLOTS } from '@/features/slots/constants/slots.premium';

export const SCHEDULE_HOW_STEPS = [
  {
    step: '01',
    icon: 'checkmark-circle-outline' as const,
    title: 'Accept a request',
    sub: 'Confirmed visits land here automatically from your inbox.',
  },
  {
    step: '02',
    icon: 'navigate-outline' as const,
    title: 'Reach on time',
    sub: 'Open Maps from the job card — arrive 10 min early.',
  },
  {
    step: '03',
    icon: 'wallet-outline' as const,
    title: 'Complete & earn',
    sub: 'Mark visit done — payout credits next Monday.',
  },
];

export const SCHEDULE_TIPS = [
  { icon: 'alarm-outline' as const, title: 'Buffer time', sub: 'Leave 15 min between slots' },
  { icon: 'call-outline' as const, title: 'Call customer', sub: 'Confirm before you leave' },
  { icon: 'map-outline' as const, title: 'Save Maps', sub: 'Pin address the night before' },
];

export const SCHEDULE_FAQ = [
  {
    q: 'Can I reschedule a visit?',
    a: 'Contact partner support at least 2 hours before the slot. Last-minute changes may affect your rating.',
  },
  {
    q: 'What if I am running late?',
    a: 'Call the customer from the job screen and notify support. On-time visits protect your priority score.',
  },
  {
    q: 'When do accepted jobs appear here?',
    a: 'Immediately after you accept a request — grouped by visit day with slot and earnings shown.',
  },
];

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const SCHEDULE_SAFETY = [
  { icon: 'shield-checkmark-outline' as const, text: 'Share live location only during active visits' },
  { icon: 'id-card-outline' as const, text: 'Carry Aadhaar for premium or first-time customers' },
  { icon: 'alert-circle-outline' as const, text: 'Report safety issues to support immediately' },
];

export const SCHEDULE_PAYOUT = {
  day: 'Monday',
  note: 'Completed visits from last week · 10% platform fee deducted',
};
