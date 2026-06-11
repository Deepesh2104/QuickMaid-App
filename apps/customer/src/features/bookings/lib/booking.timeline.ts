import type { BookingStatusBridgeEntry } from '../../../../shared/booking-status-bridge';
import type { BookingStatus, DemoBooking } from '@/constants/demo';

export type TimelineStep = {
  id: string;
  icon: 'checkmark-circle' | 'person' | 'key' | 'navigate' | 'shield-checkmark' | 'star' | 'close-circle' | 'refresh';
  title: string;
  sub: string;
  done: boolean;
  active?: boolean;
  otpValue?: string;
};

function proAssigned(booking: DemoBooking): boolean {
  return Boolean(
    booking.maid &&
      booking.maid !== 'Finding your pro…' &&
      !booking.partnerReassignPending,
  );
}

function visitStarted(
  booking: DemoBooking,
  bridge?: BookingStatusBridgeEntry | null,
  livePing?: boolean,
): boolean {
  return (
    bridge?.event === 'partner_in_progress' ||
    bridge?.event === 'partner_completed' ||
    Boolean(livePing) ||
    booking.status === 'completed'
  );
}

function visitConfirmed(
  booking: DemoBooking,
  bridge?: BookingStatusBridgeEntry | null,
): boolean {
  return (
    booking.status === 'completed' ||
    bridge?.event === 'partner_completed' ||
    Boolean(booking.otpVerifiedAt || booking.completedAt)
  );
}

export function buildLiveTimeline(
  booking: DemoBooking,
  bridge?: BookingStatusBridgeEntry | null,
  livePing?: boolean,
): TimelineStep[] {
  if (booking.status === 'cancelled') {
    return [
      {
        id: 'cancelled',
        icon: 'close-circle',
        title: 'Booking cancelled',
        sub: booking.cancelReason ?? 'No charge applied',
        done: true,
      },
      {
        id: 'rebook',
        icon: 'refresh',
        title: 'Rebook anytime',
        sub: 'Same service available in seconds',
        done: false,
        active: true,
      },
    ];
  }

  if (booking.status === 'completed') {
    const steps: TimelineStep[] = [
      {
        id: 'confirmed',
        icon: 'checkmark-circle',
        title: 'Booking confirmed',
        sub: 'Payment secured & slot locked',
        done: true,
      },
      {
        id: 'pro',
        icon: 'person',
        title: 'Pro auto-assigned',
        sub: `${booking.maid} matched to your visit`,
        done: true,
      },
      {
        id: 'otp',
        icon: 'key',
        title: 'Visit OTP',
        sub: 'Shared with pro for visit completion',
        done: true,
        otpValue: booking.completionOtp,
      },
      {
        id: 'visit_day',
        icon: 'navigate',
        title: 'Visit day',
        sub: `${booking.date} · ${booking.time}`,
        done: true,
      },
      {
        id: 'visit_done',
        icon: 'shield-checkmark',
        title: 'Visit confirmed',
        sub: booking.otpVerifiedAt
          ? `${booking.maid} verified OTP · visit complete`
          : `${booking.maid} ne visit complete kiya`,
        done: true,
      },
    ];

    if (booking.reviewedAt && booking.reviewRating) {
      steps.push({
        id: 'rate',
        icon: 'star',
        title: 'Rate your visit',
        sub: `${booking.reviewRating}★ rating submitted`,
        done: true,
      });
    } else {
      steps.push({
        id: 'rate',
        icon: 'star',
        title: 'Rate your visit',
        sub: 'Tell us how it went',
        done: false,
        active: true,
      });
    }

    return steps;
  }

  const confirmed = true;
  const assigned = proAssigned(booking);
  const hasOtp = Boolean(booking.completionOtp);
  const started = visitStarted(booking, bridge, livePing);
  const confirmedVisit = visitConfirmed(booking, bridge);

  const findingPro = booking.maid === 'Finding your pro…' || booking.partnerReassignPending;

  return [
    {
      id: 'confirmed',
      icon: 'checkmark-circle',
      title: 'Booking confirmed',
      sub: `Payment secured · ${booking.bookingRef ?? booking.id}`,
      done: confirmed,
    },
    {
      id: 'pro',
      icon: 'person',
      title: findingPro ? 'Finding your pro' : 'Pro auto-assigned',
      sub: findingPro
        ? 'Next available pro assign ho raha hai'
        : `${booking.maid} matched to your visit`,
      done: assigned,
      active: !assigned && confirmed,
    },
    {
      id: 'otp',
      icon: 'key',
      title: 'Visit OTP',
      sub: hasOtp
        ? 'Jab cleaning complete ho, yeh code pro ko dein'
        : 'Visit ke din OTP generate hoga',
      done: hasOtp,
      active: assigned && !hasOtp,
      otpValue: booking.completionOtp,
    },
    {
      id: 'visit_day',
      icon: 'navigate',
      title: 'Visit day',
      sub: started
        ? livePing
          ? `${booking.date} · Live GPS tracking active`
          : `${booking.date} · ${booking.time} · Pro on the way`
        : `${booking.date} · ${booking.time}`,
      done: started,
      active: hasOtp && assigned && !started,
    },
    {
      id: 'visit_done',
      icon: 'shield-checkmark',
      title: 'Visit confirmed',
      sub: confirmedVisit
        ? `${booking.maid} ne OTP verify kiya · visit complete`
        : started
          ? 'Pro ko OTP dein jab kaam complete ho'
          : 'Maid OTP verify karegi · phir visit confirm',
      done: confirmedVisit,
      active: started && !confirmedVisit,
    },
  ];
}

export function timelineProgress(steps: TimelineStep[]): number {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.done).length;
  return Math.round((done / steps.length) * 100);
}
