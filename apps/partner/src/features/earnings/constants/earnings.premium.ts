import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const earningsPremium = {
  pad: layout.pad,
  tealGradient: ['#E6F4F2', '#FFFFFF'] as const,
  goldGradient: ['#FFFBEB', '#FFFFFF'] as const,
  surface: {
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  } as const,
};

export const EARNINGS_FILTERS = [
  { id: 'all' as const, label: 'All activity', shortLabel: 'All', icon: 'layers-outline' as const },
  { id: 'credits' as const, label: 'Job credits', shortLabel: 'Jobs', icon: 'add-circle-outline' as const },
  { id: 'payouts' as const, label: 'Payouts', shortLabel: 'Pay', icon: 'arrow-up-circle-outline' as const },
  { id: 'this_week' as const, label: 'This week', shortLabel: 'Week', icon: 'calendar-outline' as const },
];

export const EARNINGS_HOW_STEPS = [
  {
    step: '01',
    icon: 'checkmark-done-outline' as const,
    title: 'Complete visits',
    sub: 'Finish jobs — earnings credit after the 10% platform fee.',
  },
  {
    step: '02',
    icon: 'wallet-outline' as const,
    title: 'Weekly batch',
    sub: 'Completed jobs from last week roll into Monday payout.',
  },
  {
    step: '03',
    icon: 'phone-portrait-outline' as const,
    title: 'UPI credit',
    sub: 'Verified UPI receives funds — usually by Monday evening.',
  },
];

export const EARNINGS_TIPS = [
  { icon: 'shield-checkmark-outline' as const, title: 'Verify KYC', sub: 'Unlock weekly UPI payouts' },
  { icon: 'create-outline' as const, title: 'Correct UPI', sub: 'Update in Profile anytime' },
  { icon: 'analytics-outline' as const, title: 'Track weekly', sub: 'Hit ₹1,500 goal for bonuses' },
];

export const EARNINGS_FAQ = [
  {
    q: 'When do I get paid?',
    a: 'Every Monday for jobs completed the previous week. Amount is net after the 10% platform fee.',
  },
  {
    q: 'Why is my payout lower than job amount?',
    a: 'QuickMaid deducts a 10% platform fee. Your job card always shows what you earn after fee.',
  },
  {
    q: 'Payout failed or delayed?',
    a: 'Check UPI ID in Profile and KYC status. Chat with support from this screen for payout traces.',
  },
];

export const PAYOUT_SCHEDULE = {
  day: 'Monday',
  window: 'Evening · 6–10 PM',
  feePct: 10,
};
