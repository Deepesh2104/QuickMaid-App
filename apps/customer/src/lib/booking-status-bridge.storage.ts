import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BOOKING_STATUS_APPLIED_KEY,
  BOOKING_STATUS_BRIDGE_KEY,
  type BookingStatusAppliedStore,
  type BookingStatusBridgeEntry,
  type BookingStatusBridgeStore,
} from '../../shared/booking-status-bridge';
import { addNotification } from '@/features/notifications/lib/notifications.storage';
import {
  completeBookingById,
  getAllBookings,
  patchBookingById,
} from '@/features/checkout/lib/bookings.core.storage';
import { setPendingVisitComplete } from '@/features/bookings/lib/booking.completion';

async function readStore(): Promise<BookingStatusBridgeStore> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_STATUS_BRIDGE_KEY);
    return raw ? (JSON.parse(raw) as BookingStatusBridgeStore) : {};
  } catch {
    return {};
  }
}

async function writeStore(store: BookingStatusBridgeStore): Promise<void> {
  await AsyncStorage.setItem(BOOKING_STATUS_BRIDGE_KEY, JSON.stringify(store));
}

async function readApplied(): Promise<BookingStatusAppliedStore> {
  try {
    const raw = await AsyncStorage.getItem(BOOKING_STATUS_APPLIED_KEY);
    return raw ? (JSON.parse(raw) as BookingStatusAppliedStore) : {};
  } catch {
    return {};
  }
}

async function writeApplied(applied: BookingStatusAppliedStore): Promise<void> {
  await AsyncStorage.setItem(BOOKING_STATUS_APPLIED_KEY, JSON.stringify(applied));
}

export async function getBookingStatusForRef(
  bookingRef: string,
): Promise<BookingStatusBridgeEntry | null> {
  const store = await readStore();
  return store[bookingRef] ?? null;
}

export async function publishCustomerBookingStatus(
  entry: Omit<BookingStatusBridgeEntry, 'updatedAt'> & { updatedAt?: string },
): Promise<void> {
  const store = await readStore();
  const full: BookingStatusBridgeEntry = {
    ...entry,
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
  };
  store[entry.bookingRef] = full;
  await writeStore(store);
}

async function findBookingId(entry: BookingStatusBridgeEntry): Promise<string | null> {
  const all = await getAllBookings();
  const byRef = all.find((b) => b.bookingRef === entry.bookingRef);
  if (byRef) return byRef.id;
  if (entry.customerBookingId) {
    const byId = all.find((b) => b.id === entry.customerBookingId);
    if (byId) return byId.id;
  }
  return null;
}

function bridgeNotificationStyle(event: BookingStatusBridgeEntry['event']) {
  switch (event) {
    case 'partner_accepted':
      return {
        category: 'pro' as const,
        icon: 'person-circle' as const,
        tone: '#EEF6FF',
        ink: '#175CD3',
      };
    case 'partner_in_progress':
      return {
        category: 'booking' as const,
        icon: 'navigate' as const,
        tone: '#EFF8FF',
        ink: '#1570EF',
      };
    case 'partner_completed':
      return {
        category: 'booking' as const,
        icon: 'checkmark-done' as const,
        tone: '#ECFDF3',
        ink: '#027A48',
      };
    case 'partner_declined':
      return {
        category: 'pro' as const,
        icon: 'people' as const,
        tone: '#EEF2FF',
        ink: '#4338CA',
      };
    default:
      return {
        category: 'booking' as const,
        icon: 'git-network-outline' as const,
        tone: '#ECFDF3',
        ink: '#027A48',
      };
  }
}

async function notifyPartnerEvent(
  entry: BookingStatusBridgeEntry,
  title: string,
  body: string,
  bookingId?: string,
): Promise<void> {
  const style = bridgeNotificationStyle(entry.event);
  await addNotification({
    id: `bridge-${entry.event}-${entry.bookingRef}-${entry.updatedAt}`,
    category: style.category,
    title,
    body,
    detail: `Partner bridge sync · Ref ${entry.bookingRef}${entry.partnerName ? ` · ${entry.partnerName}` : ''}`,
    createdAt: entry.updatedAt,
    action: bookingId ? { type: 'booking', id: bookingId } : { type: 'bookings' },
    icon: style.icon,
    tone: style.tone,
    ink: style.ink,
  });
}

/** Apply partner lifecycle events to customer bookings. */
export async function syncBookingsFromPartnerStatusBridge(): Promise<number> {
  const [store, applied] = await Promise.all([readStore(), readApplied()]);
  let changes = 0;
  const nextApplied = { ...applied };

  for (const entry of Object.values(store)) {
    const appliedKey = `customer:${entry.bookingRef}`;
    if (nextApplied[appliedKey] === entry.updatedAt) continue;
    if (
      entry.event !== 'partner_accepted' &&
      entry.event !== 'partner_in_progress' &&
      entry.event !== 'partner_completed' &&
      entry.event !== 'partner_declined'
    ) {
      continue;
    }

    const bookingId = await findBookingId(entry);
    if (!bookingId) continue;

    if (entry.event === 'partner_accepted' && entry.partnerName) {
      const updated = await patchBookingById(bookingId, {
        maid: entry.partnerName,
        maidAssignedAt: entry.updatedAt,
        partnerReassignPending: false,
        lastDeclinedPartner: undefined,
      });
      if (updated) {
        changes += 1;
        await notifyPartnerEvent(
          entry,
          'Pro assigned',
          `${entry.partnerName} accepted your booking`,
          bookingId,
        );
      }
      nextApplied[appliedKey] = entry.updatedAt;
    }

    if (entry.event === 'partner_in_progress') {
      const updated = await patchBookingById(bookingId, {
        maid: entry.partnerName ?? undefined,
      });
      if (updated) {
        changes += 1;
        await notifyPartnerEvent(
          entry,
          'Visit started',
          `${entry.partnerName ?? 'Your pro'} is on the way`,
          bookingId,
        );
      }
      nextApplied[appliedKey] = entry.updatedAt;
    }

    if (entry.event === 'partner_completed') {
      const before = await getAllBookings();
      const target = before.find((b) => b.id === bookingId);
      if (target?.status === 'upcoming') {
        const completed = await completeBookingById(bookingId);
        if (completed) {
          changes += 1;
          await setPendingVisitComplete({
            bookingId: completed.id,
            bookingRef: completed.bookingRef,
            maidName: completed.maid,
            service: completed.service,
            completedAt: entry.completedAt ?? completed.completedAt ?? new Date().toISOString(),
          });
          await notifyPartnerEvent(
            entry,
            'Visit complete',
            `${completed.maid} finished your ${completed.service}`,
            bookingId,
          );
        }
      }
      nextApplied[appliedKey] = entry.updatedAt;
    }

    if (entry.event === 'partner_declined') {
      const updated = await patchBookingById(bookingId, {
        maid: 'Finding your pro…',
        maidAssignedAt: undefined,
        partnerReassignPending: true,
        lastDeclinedPartner: entry.partnerName,
      });
      if (updated) changes += 1;
      await notifyPartnerEvent(
        entry,
        'Finding another pro',
        entry.partnerName
          ? `${entry.partnerName} unavailable — next pro assign ho raha hai`
          : 'Your booking is being reassigned to the next available pro',
        bookingId,
      );
      nextApplied[appliedKey] = entry.updatedAt;
    }
  }

  if (changes || Object.keys(nextApplied).length !== Object.keys(applied).length) {
    await writeApplied(nextApplied);
  }
  return changes;
}
