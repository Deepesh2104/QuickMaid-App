import { resolveCouponDiscountAmount } from '@/features/coupons/lib/coupon.utils';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';

import type { CheckoutDraft, OrderSummary } from '../types/checkout.types';

export function resolveCouponDiscount(code: string | undefined, amount: number): number {
  return resolveCouponDiscountAmount(code, amount);
}

export function parsePrice(price: string): number {
  return parseInt(price.replace(/\D/g, ''), 10) || 0;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getVisitDates(count = 7): { iso: string; label: string; day: string }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const out: { iso: string; label: string; day: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
    out.push({ iso, label, day: days[d.getDay()] });
  }
  return out;
}

export function computeOrderSummary(draft: CheckoutDraft, account: ProfileAccountData): OrderSummary {
  const subtotal = draft.items.reduce((s, i) => s + i.priceNum * i.qty, 0);
  const plusDiscount = account.isPlusMember ? Math.round(subtotal * 0.1) : 0;
  const afterPlus = subtotal - plusDiscount;
  const couponDiscount = resolveCouponDiscount(draft.couponCode, afterPlus);
  const afterDiscount = afterPlus - couponDiscount;
  const platformFee = 0;

  let walletDeduction = 0;
  if (draft.useWallet && account.walletBalance > 0) {
    walletDeduction = Math.min(account.walletBalance, afterDiscount);
  }

  const payable = Math.max(0, afterDiscount - walletDeduction);
  const savings = plusDiscount + couponDiscount + walletDeduction;

  return {
    subtotal,
    plusDiscount,
    couponDiscount,
    walletDeduction,
    platformFee,
    total: afterDiscount,
    payable,
    savings,
    isPlusMember: account.isPlusMember,
    couponCode: draft.couponCode,
  };
}

/** Booking ref: QM- + last 7 digits of checkout timestamp (e.g. QM-4567890). */
export function generateBookingRef(_priceNum?: number): string {
  const digits = String(Date.now() % 10_000_000).padStart(7, '0');
  return `QM-${digits}`;
}

export function slotToTime(slotId?: string): string {
  const map: Record<string, string> = {
    morning: '10:00 AM',
    afternoon: '3:00 PM',
    evening: '6:00 PM',
    'weekend-am': '10:00 AM',
    'weekend-pm': '5:00 PM',
  };
  return map[slotId ?? 'morning'] ?? '10:00 AM';
}
