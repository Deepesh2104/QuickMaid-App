import type { PartnerNotification, PartnerNotificationKind } from '@/constants/demo';

export type { PartnerNotificationKind };

export type AppNotification = PartnerNotification & { read: boolean };
