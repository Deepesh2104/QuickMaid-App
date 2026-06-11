import type { PayoutStatus } from '@/features/payout/types/payout.types';

export const PAYOUT_DETAIL_STATS = [
  { value: 'Mon', label: 'Batch day' },
  { value: '6–10 PM', label: 'UPI window' },
  { value: '10%', label: 'Platform fee' },
] as const;

export const PAYOUT_STATUS_META: Record<
  PayoutStatus,
  { label: string; hint: string; color: string; bg: string; icon: 'time-outline' | 'checkmark-circle' | 'alert-circle' }
> = {
  scheduled: {
    label: 'Scheduled',
    hint: 'Queued for next Monday evening batch',
    color: '#B54708',
    bg: 'rgba(245,158,11,0.12)',
    icon: 'time-outline',
  },
  sent: {
    label: 'Sent',
    hint: 'Credited to your UPI account',
    color: '#027A48',
    bg: 'rgba(16,185,129,0.12)',
    icon: 'checkmark-circle',
  },
  failed: {
    label: 'Failed',
    hint: 'Retry after updating UPI or contact support',
    color: '#B42318',
    bg: 'rgba(239,68,68,0.1)',
    icon: 'alert-circle',
  },
};

export const PAYOUT_TIMELINE_SENT = [
  { icon: 'calendar-outline' as const, title: 'Batch created', sub: 'Completed jobs rolled into weekly payout' },
  { icon: 'shield-checkmark-outline' as const, title: 'KYC & UPI verified', sub: 'Payout released to registered UPI' },
  { icon: 'checkmark-done-outline' as const, title: 'UPI credited', sub: 'Funds received in your bank account' },
] as const;

export const PAYOUT_TIMELINE_SCHEDULED = [
  { icon: 'add-circle-outline' as const, title: 'Credits accumulating', sub: 'Job earnings added after each visit' },
  { icon: 'calendar-outline' as const, title: 'Monday batch', sub: 'This week’s credits close Sunday night' },
  { icon: 'wallet-outline' as const, title: 'UPI transfer', sub: 'Evening payout to your verified UPI' },
] as const;
