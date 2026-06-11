/** Cross-app demo bridge — same AsyncStorage key when apps share storage; deep link fallback on device. */

export const BOOKING_PARTNER_BRIDGE_KEY = '@qm/booking_partner_bridge_v1';

export interface BookingPartnerBridgePayload {
  id: string;
  bookingRef: string;
  service: string;
  address: string;
  customerName?: string;
  customerPublicId?: string;
  zone?: string;
  slotLabel?: string;
  visitDate?: string;
  amountPaise: number;
  completionOtp?: string;
  customerPhone?: string;
  maidId?: string;
  maidName?: string;
  createdAt: string;
  consumed?: boolean;
}

export function bookingAmountPaise(priceNum: number): number {
  return Math.round(priceNum * 100);
}

export function buildPartnerBookingDeepLink(payload: BookingPartnerBridgePayload): string {
  const q = new URLSearchParams({
    id: payload.id,
    ref: payload.bookingRef,
    service: payload.service,
    address: payload.address,
    amount: String(payload.amountPaise),
    visit: payload.visitDate ?? '',
    slot: payload.slotLabel ?? '',
    otp: payload.completionOtp ?? '',
    name: payload.customerName ?? 'Customer',
    zone: payload.zone ?? 'Shankar Nagar',
    maid: payload.maidName ?? '',
  });
  return `quickmaid-partner://booking?${q.toString()}`;
}

export function parsePartnerBookingDeepLink(url: string): BookingPartnerBridgePayload | null {
  try {
    const qIdx = url.indexOf('?');
    if (qIdx < 0) return null;
    const params = new URLSearchParams(url.slice(qIdx + 1));
    const ref = params.get('ref');
    const id = params.get('id');
    const service = params.get('service');
    const address = params.get('address');
    const amount = params.get('amount');
    if (!ref || !id || !service || !address || !amount) return null;
    return {
      id,
      bookingRef: ref,
      service,
      address,
      amountPaise: Number(amount),
      visitDate: params.get('visit') || undefined,
      slotLabel: params.get('slot') || undefined,
      completionOtp: params.get('otp') || undefined,
      customerName: params.get('name') || 'Customer',
      zone: params.get('zone') || 'Shankar Nagar',
      maidName: params.get('maid') || undefined,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
