import type { Ionicons } from '@expo/vector-icons';

export type NotificationCategory = 'booking' | 'pro' | 'payment' | 'offer' | 'system';

export type NotificationActionType =
  | 'booking'
  | 'service'
  | 'plans'
  | 'bookings'
  | 'home'
  | 'profile'
  | 'pro'
  | 'none';

export interface NotificationAction {
  type: NotificationActionType;
  id?: string;
}

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  detail?: string;
  createdAt: string;
  read: boolean;
  action?: NotificationAction;
  icon: keyof typeof Ionicons.glyphMap;
  tone: string;
  ink: string;
}
