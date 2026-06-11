import type { Ionicons } from '@expo/vector-icons';

import type {
  AppNotification,
  NotificationAction,
  NotificationCategory,
} from '../types/notification.types';

export function formatNotificationTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
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

export function groupNotificationsByDay(
  items: AppNotification[],
): { label: string; items: AppNotification[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, AppNotification[]> = {};

  for (const item of items) {
    const d = new Date(item.createdAt);
    d.setHours(0, 0, 0, 0);
    let label = 'Earlier';
    if (d.getTime() === today.getTime()) label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }

  const order = ['Today', 'Yesterday', 'Earlier'];
  return order
    .filter((label) => groups[label]?.length)
    .map((label) => ({ label, items: groups[label] }));
}

export const NOTIFICATION_FILTERS: {
  id: 'all' | NotificationCategory;
  label: string;
  shortLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'all', label: 'All alerts', shortLabel: 'All', icon: 'layers-outline' },
  { id: 'booking', label: 'Bookings', shortLabel: 'Bookings', icon: 'calendar-outline' },
  { id: 'pro', label: 'Pro updates', shortLabel: 'Pro', icon: 'person-outline' },
  { id: 'payment', label: 'Payments', shortLabel: 'Pay', icon: 'card-outline' },
  { id: 'offer', label: 'Offers', shortLabel: 'Offers', icon: 'pricetag-outline' },
  { id: 'system', label: 'System', shortLabel: 'System', icon: 'sparkles-outline' },
];

export const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: keyof typeof Ionicons.glyphMap; accent: string }
> = {
  booking: { label: 'Booking', icon: 'calendar', accent: '#0B6E67' },
  pro: { label: 'Pro update', icon: 'person-circle', accent: '#175CD3' },
  payment: { label: 'Payment', icon: 'card', accent: '#027A48' },
  offer: { label: 'Offer', icon: 'pricetag', accent: '#B54708' },
  system: { label: 'System', icon: 'sparkles', accent: '#667085' },
};

export function getActionLabel(action?: NotificationAction): string {
  if (!action || action.type === 'none') return 'Got it';
  switch (action.type) {
    case 'booking':
      return 'View booking';
    case 'bookings':
      return 'Open bookings';
    case 'service':
      return 'View service';
    case 'plans':
      return 'Explore Plus';
    case 'home':
      return 'Browse services';
    case 'profile':
      return 'Open profile';
    default:
      return 'Continue';
  }
}

export function hasDeepLink(action?: NotificationAction): boolean {
  return Boolean(action && action.type !== 'none');
}

const BRIDGE_ID_PREFIX = 'bridge-';

export function isBridgeNotification(id: string): boolean {
  return id.startsWith(BRIDGE_ID_PREFIX);
}

export function bridgeEventFromNotificationId(id: string): string | null {
  if (!isBridgeNotification(id)) return null;
  const parts = id.slice(BRIDGE_ID_PREFIX.length).split('-');
  return parts[0] ?? null;
}

export function bridgeEventLabel(event: string | null): string {
  switch (event) {
    case 'partner_accepted':
      return 'Pro assigned';
    case 'partner_in_progress':
      return 'Visit live';
    case 'partner_completed':
      return 'Visit complete';
    case 'partner_declined':
      return 'Reassigning pro';
    default:
      return 'Partner bridge';
  }
}

export function filterBridgeNotifications(items: AppNotification[]): AppNotification[] {
  return items.filter((n) => isBridgeNotification(n.id));
}
