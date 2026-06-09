import type { CouponDefinition } from '../types/coupon.types';

export const COUPON_CATALOG: CouponDefinition[] = [
  {
    code: 'FIRST20',
    title: '20% off first clean',
    description: 'Valid on your first home cleaning booking in Raipur.',
    discountType: 'percent',
    discountValue: 20,
    minOrder: 299,
    maxDiscount: 200,
    category: 'booking',
    badge: 'New user',
    validDays: 30,
  },
  {
    code: 'FIRST10',
    title: '10% off first booking',
    description: 'Welcome offer for new QuickMaid customers.',
    discountType: 'percent',
    discountValue: 10,
    category: 'booking',
    badge: 'Welcome',
    validDays: 45,
  },
  {
    code: 'QM50',
    title: '₹50 instant off',
    description: 'Flat discount on any standard cleaning service.',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 399,
    category: 'booking',
    validDays: 14,
  },
  {
    code: 'CLEAN15',
    title: '15% weekend special',
    description: 'Book Fri–Sun slots and save on deep or regular clean.',
    discountType: 'percent',
    discountValue: 15,
    maxDiscount: 150,
    category: 'booking',
    badge: 'Weekend',
    validDays: 7,
  },
  {
    code: 'PLUS10',
    title: '10% off Plus plan',
    description: 'Apply when subscribing to QuickMaid Plus monthly.',
    discountType: 'percent',
    discountValue: 10,
    category: 'plus',
    badge: 'Plus',
    validDays: 60,
  },
];

export function findCouponDefinition(code: string) {
  return COUPON_CATALOG.find((c) => c.code === code.toUpperCase());
}
