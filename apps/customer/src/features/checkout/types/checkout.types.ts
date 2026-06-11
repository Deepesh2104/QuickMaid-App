import type { Ionicons } from '@expo/vector-icons';

import type { BookingStatus } from '@/constants/demo';
import type { ServiceItem } from '@/constants/services';

export type CheckoutStep = 'cart' | 'address' | 'schedule' | 'payment' | 'success';

export type PaymentMode =
  | 'wallet_full'
  | 'wallet_partial'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'emi'
  | 'cash'
  | 'pay_later';

export interface CartItem {
  serviceId: string;
  name: string;
  price: string;
  priceNum: number;
  icon: keyof typeof Ionicons.glyphMap;
  duration?: string;
  category: string;
  qty: number;
}

export interface CheckoutDraft {
  items: CartItem[];
  addressId?: string;
  slotId?: string;
  slotLabel?: string;
  visitDate?: string;
  visitDateLabel?: string;
  paymentMode?: PaymentMode;
  paymentMethodId?: string;
  useWallet: boolean;
  couponCode?: string;
}

export interface OrderSummary {
  subtotal: number;
  plusDiscount: number;
  couponDiscount: number;
  walletDeduction: number;
  platformFee: number;
  total: number;
  payable: number;
  savings: number;
  isPlusMember: boolean;
  couponCode?: string;
}

export interface PlacedOrder {
  id: string;
  service: string;
  icon: keyof typeof Ionicons.glyphMap;
  date: string;
  time: string;
  maid: string;
  price: string;
  priceNum: number;
  status: BookingStatus;
  address: string;
  bookingRef: string;
  duration?: string;
  paymentMode: PaymentMode;
  paymentTxnId: string;
  paymentLabel: string;
  amountPaid: number;
  walletUsed: number;
  slotLabel?: string;
  slotId?: string;
  visitDate?: string;
  rescheduledAt?: string;
  createdAt: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  couponCode?: string;
  couponDiscount?: number;
  maidId?: string;
  maidRating?: number;
  maidJobs?: number;
  completionOtp?: string;
  maidAssignedAt?: string;
  partnerReassignPending?: boolean;
  lastDeclinedPartner?: string;
  otpVerifiedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  refundAmount?: number;
  refundStatus?: 'processing' | 'completed';
  refundTxnId?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewTags?: string[];
  reviewedAt?: string;
}

export function serviceToCartItem(service: ServiceItem, qty = 1): CartItem {
  const num = parseInt(service.price.replace(/\D/g, ''), 10) || 0;
  return {
    serviceId: service.id,
    name: service.name,
    price: service.price,
    priceNum: num,
    icon: service.icon,
    duration: service.duration,
    category: service.category,
    qty,
  };
}
