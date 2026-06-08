import type { PaymentMode } from '@/features/checkout/types/checkout.types';

export type GatewayId = 'razorpay';

export type GatewayMethod = 'upi' | 'card' | 'netbanking' | 'emi';

export interface GatewayOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  gateway: GatewayId;
}

export interface GatewayPaymentResult {
  success: boolean;
  gateway: GatewayId;
  orderId: string;
  paymentId: string;
  signature: string;
  method: GatewayMethod;
  methodLabel: string;
  amount: number;
  error?: string;
}

export interface PaymentRecord {
  id: string;
  gateway: GatewayId;
  orderId: string;
  paymentId: string;
  bookingRef?: string;
  amount: number;
  walletUsed: number;
  mode: PaymentMode;
  methodLabel: string;
  status: 'captured' | 'authorized' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}
