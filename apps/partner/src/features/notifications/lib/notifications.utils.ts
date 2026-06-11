import type { PartnerNotificationKind } from '@/constants/demo';

import type { AppNotification } from '../types/notification.types';

export const NOTIFICATION_FILTERS: Array<{
  id: 'all' | PartnerNotificationKind;
  label: string;
  shortLabel: string;
  icon: 'layers-outline' | 'briefcase-outline' | 'wallet-outline' | 'shield-outline' | 'information-circle-outline';
}> = [
  { id: 'all', label: 'All alerts', shortLabel: 'All', icon: 'layers-outline' },
  { id: 'job', label: 'Jobs', shortLabel: 'Jobs', icon: 'briefcase-outline' },
  { id: 'payout', label: 'Payouts', shortLabel: 'Pay', icon: 'wallet-outline' },
  { id: 'kyc', label: 'KYC', shortLabel: 'KYC', icon: 'shield-outline' },
  { id: 'system', label: 'Updates', shortLabel: 'Info', icon: 'information-circle-outline' },
];

export const KIND_META: Record<
  PartnerNotificationKind,
  {
    label: string;
    icon: 'briefcase' | 'wallet' | 'shield-checkmark' | 'sparkles';
    tone: string;
    ink: string;
    accent: string;
  }
> = {
  job: {
    label: 'Job',
    icon: 'briefcase',
    tone: '#E6F4F2',
    ink: '#084F4A',
    accent: '#0B6E67',
  },
  payout: {
    label: 'Payout',
    icon: 'wallet',
    tone: '#EEF6FF',
    ink: '#175CD3',
    accent: '#1570EF',
  },
  kyc: {
    label: 'KYC',
    icon: 'shield-checkmark',
    tone: '#FFFBEB',
    ink: '#B54708',
    accent: '#D97706',
  },
  system: {
    label: 'Update',
    icon: 'sparkles',
    tone: '#F4F6F8',
    ink: '#6941C6',
    accent: '#7F56D9',
  },
};

export function kindMeta(kind: PartnerNotificationKind) {
  return KIND_META[kind];
}

export function formatNotificationTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatNotificationDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function notificationDayLabel(iso: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return 'Earlier';
}

export function groupNotificationsByDay(items: AppNotification[]) {
  const order = ['Today', 'Yesterday', 'Earlier'];
  const groups = new Map<string, AppNotification[]>();

  for (const item of items) {
    const label = notificationDayLabel(item.createdAt);
    const list = groups.get(label) ?? [];
    list.push(item);
    groups.set(label, list);
  }

  return order
    .filter((label) => groups.has(label))
    .map((label) => ({ label, items: groups.get(label)! }));
}

export function hasAction(notification: AppNotification) {
  return Boolean(notification.jobId || notification.payoutId || notification.kind === 'kyc');
}

export function getActionLabel(notification: AppNotification) {
  if (notification.jobId) return 'View job';
  if (notification.payoutId || notification.kind === 'payout') return 'View payout';
  if (notification.kind === 'kyc') return 'Complete KYC';
  return 'Got it';
}

export function notificationActionHref(notification: AppNotification): string {
  if (notification.jobId) return `/job/${notification.jobId}`;
  if (notification.payoutId) return `/payout/${notification.payoutId}`;
  if (notification.kind === 'payout') return '/payout/upcoming';
  if (notification.kind === 'kyc') return '/kyc';
  return '/notifications';
}
