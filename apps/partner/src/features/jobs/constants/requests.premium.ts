import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const requestsPremium = {
  section: { marginBottom: spacing.section } as const,
  surface: {
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  } as const,
  surfaceSoft: {
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  } as const,
  pad: layout.pad,
  iconGradient: ['#FFF8EE', '#FFFFFF'] as const,
  tealGradient: ['#E6F4F2', '#FFFFFF'] as const,
  heroGlass: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  } as const,
};

export const REQUEST_FILTERS = [
  { id: 'all' as const, label: 'All', shortLabel: 'All', icon: 'layers-outline' as const },
  { id: 'today' as const, label: 'Today', shortLabel: 'Today', icon: 'today-outline' as const },
  { id: 'nearby' as const, label: 'Nearby', shortLabel: 'Near', icon: 'navigate-outline' as const },
  { id: 'high_pay' as const, label: 'High pay', shortLabel: 'Pay', icon: 'trending-up-outline' as const },
];

export const REQUEST_HOW_STEPS = [
  {
    step: '01',
    icon: 'notifications-outline' as const,
    title: 'Request lands',
    sub: 'New visits ping here first when you are online in your zone.',
  },
  {
    step: '02',
    icon: 'timer-outline' as const,
    title: 'Respond fast',
    sub: 'Accept within 15 minutes to keep your priority rating high.',
  },
  {
    step: '03',
    icon: 'calendar-outline' as const,
    title: 'Job scheduled',
    sub: 'Accepted visits move to Schedule — payout after completion.',
  },
];

export const REQUEST_TIPS = [
  { icon: 'flash-outline' as const, title: 'Stay online', sub: 'Peak slots 8–11 AM & 2–5 PM' },
  { icon: 'location-outline' as const, title: 'Match zone', sub: 'Requests near your work address first' },
  { icon: 'star-outline' as const, title: 'Fast accept', sub: 'Higher rating → more offers' },
];
