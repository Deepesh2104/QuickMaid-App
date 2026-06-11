/** Keep in sync with QuickMaid-App/shared/booking-status-bridge.ts */

export const BOOKING_STATUS_BRIDGE_KEY = '@qm/booking_status_bridge_v1';
export const BOOKING_STATUS_APPLIED_KEY = '@qm/booking_status_applied_v1';

export type BookingStatusBridgeEvent =
  | 'partner_accepted'
  | 'partner_in_progress'
  | 'partner_completed'
  | 'partner_declined'
  | 'customer_cancelled'
  | 'customer_rescheduled';

export interface BookingStatusBridgeEntry {
  bookingRef: string;
  customerBookingId?: string;
  partnerJobId?: string;
  event: BookingStatusBridgeEvent;
  partnerName?: string;
  updatedAt: string;
  completedAt?: string;
  visitDate?: string;
  slotLabel?: string;
  time?: string;
  cancelReason?: string;
}

export type BookingStatusBridgeStore = Record<string, BookingStatusBridgeEntry>;

export type BookingStatusAppliedStore = Record<string, string>;
