# FSD 09 — Notifications Inbox

**Status:** `UI-DEMO`  
**Domain:** `src/features/notifications/`  
**Routes:** `app/notifications/*`

## Overview

In-app notification centre: unread badge on home header, list with categories (booking, offers, pro), detail view, mark-read, and deep-link navigation to bookings, checkout, or support.

### User stories

| ID | Story |
|----|-------|
| NOTIF-1 | Customer sees unread count on home |
| NOTIF-2 | Customer opens inbox from header |
| NOTIF-3 | Customer reads notification detail |
| NOTIF-4 | Customer taps CTA → relevant screen |
| NOTIF-5 | Customer marks all as read |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/notifications` | `notifications/index.tsx` | `NotificationsScreen` |
| `/notifications/[id]` | `notifications/[id].tsx` | `NotificationDetailScreen` |

Layout: `app/notifications/_layout.tsx`.

### Key modules

| Module | File |
|--------|------|
| `NotificationsScreen` | `components/NotificationsScreen.tsx` |
| `NotificationCard` | `components/NotificationCard.tsx` |
| `NotificationDetailScreen` | `components/NotificationDetailScreen.tsx` |
| `useNotifications` | `hooks/useNotifications.ts` |
| `useNotificationNavigation` | `hooks/useNotificationNavigation.ts` |
| `useOpenNotifications` | `hooks/useOpenNotifications.ts` |
| `notifications.storage` | `lib/notifications.storage.ts` |
| `demo.notifications` | `constants/demo.notifications.ts` |

## Data model

| Entity | Storage key | Fields |
|--------|-------------|--------|
| Inbox items | `@qm/notifications_inbox` | `AppNotification` minus `read` |
| Read IDs | `@qm/notifications_read` | `string[]` |
| Demo seeds | — | Merged in `getNotifications()` |

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) — push prefs live under `@qm/profile_account.notificationPrefs`.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `getNotifications` | `notifications.storage.ts` | Merges stored + `DEMO_NOTIFICATIONS`, sorts by date |
| `getUnreadCount` | `notifications.storage.ts` | Filters `!read` |
| `markNotificationRead` | `notifications.storage.ts` | Appends ID to read set |
| `markAllNotificationsRead` | `notifications.storage.ts` | Bulk mark |
| `addNotification` | `notifications.storage.ts` | Called after booking/payment events (demo) |
| `useNotificationNavigation` | hook | Maps `action` → `router.push` |

Home header uses `useNotifications` for badge count.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me/notifications` | GET | Paginated inbox |
| `/api/v1/customers/me/notifications/:id` | GET | Detail |
| `/api/v1/customers/me/notifications/:id/read` | POST | Mark read |
| `/api/v1/customers/me/notifications/read-all` | POST | Mark all read |
| `/api/v1/customers/me/device-tokens` | POST | FCM/APNs registration |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `HomeHeader` | Mount / focus | `useNotifications.refresh` | `GET /notifications` |
| `NotificationsScreen` | Mount | `getNotifications` | `GET /notifications` |
| `NotificationsScreen` | Mark all read | `markAllNotificationsRead` | `POST /read-all` |
| `NotificationCard` | Tap | `markRead` + navigate | `POST /:id/read` |
| `NotificationDetailScreen` | Mount | `getNotificationById` | `GET /notifications/:id` |
| `NotificationDetailScreen` | CTA | `useNotificationNavigation` | Deep link route |
| `CheckoutContext` | Order placed | `addNotification` (demo) | Push from server |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Unknown notification ID | Empty / back | 404 |
| Stale deep link (booking gone) | Alert fallback | 410 + redirect home |
| Empty inbox | Empty state UI | `[]` |
| Push denied | In-app only | Device settings |
| Offline mark-read | Local read set | Sync on reconnect |

## Migration checklist

- [ ] Replace merge logic with paginated `GET /notifications`  
- [ ] Server owns read state; drop `@qm/notifications_read`  
- [ ] Register device token after permissions screen  
- [ ] Map `action` payloads to stable server `deep_link` schema  
- [ ] Keep `useOpenNotifications` router helper unchanged  
