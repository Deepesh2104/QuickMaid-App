import type { CouponDiscountType, CouponStatus, SavedCoupon } from '../types/coupon.types';
import { findCouponDefinition } from './coupon.catalog';

export function couponDiscountLabel(type: CouponDiscountType, value: number) {
  return type === 'percent' ? `${value}% off` : `₹${value} off`;
}

export function resolveCouponDiscountAmount(code: string | undefined, amount: number): number {
  if (!code || amount <= 0) return 0;
  const coupon = findCouponDefinition(code);
  if (!coupon) return 0;
  if (coupon.minOrder && amount < coupon.minOrder) return 0;
  if (coupon.discountType === 'percent') {
    const raw = Math.round((amount * coupon.discountValue) / 100);
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  }
  return Math.min(coupon.discountValue, amount);
}

export function formatCouponExpiry(iso: string, status: CouponStatus) {
  if (status === 'used') return 'Used';
  if (status === 'expired') return 'Expired';
  const date = new Date(iso);
  const diff = date.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Expired';
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  if (days <= 7) return `${days} days left`;
  return `Valid till ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}

export function couponStatusTheme(status: CouponStatus) {
  const map = {
    active: { label: 'Active', ink: '#027A48', tone: '#ECFDF5' },
    used: { label: 'Used', ink: '#6B7280', tone: '#F4F6F8' },
    expired: { label: 'Expired', ink: '#B45309', tone: '#FFFBEB' },
  } as const;
  return map[status];
}

export function couponFilterMatch(coupon: SavedCoupon, filter: 'all' | 'active' | 'used') {
  if (filter === 'all') return true;
  if (filter === 'active') return coupon.status === 'active';
  return coupon.status === 'used';
}

export function definitionToSaved(def: ReturnType<typeof findCouponDefinition>, savedAt = Date.now()): SavedCoupon | null {
  if (!def) return null;
  const expiresAt = new Date(savedAt + (def.validDays ?? 30) * 86400000).toISOString();
  return {
    code: def.code,
    title: def.title,
    description: def.description,
    discountType: def.discountType,
    discountValue: def.discountValue,
    minOrder: def.minOrder,
    maxDiscount: def.maxDiscount,
    category: def.category,
    badge: def.badge,
    status: 'active',
    expiresAt,
    savedAt: new Date(savedAt).toISOString(),
  };
}
