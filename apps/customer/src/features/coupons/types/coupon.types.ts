export type CouponDiscountType = 'percent' | 'flat';

export type CouponCategory = 'booking' | 'plus' | 'all';

export type CouponStatus = 'active' | 'used' | 'expired';

export interface CouponDefinition {
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
  category: CouponCategory;
  badge?: string;
  validDays?: number;
}

export interface SavedCoupon {
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
  category: CouponCategory;
  badge?: string;
  status: CouponStatus;
  expiresAt: string;
  savedAt: string;
  usedAt?: string;
}
