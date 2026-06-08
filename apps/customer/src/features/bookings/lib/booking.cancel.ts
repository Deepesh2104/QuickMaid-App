import { formatInr, parsePrice } from '@/features/checkout/lib/checkout.utils';
import type { DemoBooking } from '@/constants/demo';

export const CANCEL_REASONS = [
  { id: 'schedule', label: 'Plans changed', icon: 'calendar-outline' as const },
  { id: 'alternative', label: 'Found another option', icon: 'swap-horizontal-outline' as const },
  { id: 'maid', label: 'Want a different pro', icon: 'person-outline' as const },
  { id: 'price', label: 'Price concern', icon: 'pricetag-outline' as const },
  { id: 'other', label: 'Other reason', icon: 'ellipsis-horizontal-outline' as const },
] as const;

export type CancelReasonId = (typeof CANCEL_REASONS)[number]['id'];

export interface RefundBreakdown {
  totalPaid: number;
  walletRefund: number;
  gatewayRefund: number;
  refundTotal: number;
  paymentLabel: string;
  hasWallet: boolean;
  hasGateway: boolean;
}

export function computeRefundBreakdown(booking: DemoBooking): RefundBreakdown {
  const walletRefund = booking.walletUsed ?? 0;
  const gatewayRefund = booking.amountPaid ?? parsePrice(booking.price);
  const refundTotal = walletRefund + gatewayRefund;

  return {
    totalPaid: refundTotal,
    walletRefund,
    gatewayRefund,
    refundTotal,
    paymentLabel: booking.paymentLabel ?? 'UPI · Razorpay',
    hasWallet: walletRefund > 0,
    hasGateway: gatewayRefund > 0,
  };
}

export function generateRefundTxnId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RFND-${rand}`;
}

export function formatRefundLines(breakdown: RefundBreakdown): { label: string; amount: string; eta: string }[] {
  const lines: { label: string; amount: string; eta: string }[] = [];

  if (breakdown.hasGateway) {
    lines.push({
      label: breakdown.paymentLabel,
      amount: formatInr(breakdown.gatewayRefund),
      eta: '2–4 business days',
    });
  }

  if (breakdown.hasWallet) {
    lines.push({
      label: 'QuickMaid wallet',
      amount: formatInr(breakdown.walletRefund),
      eta: 'Instant',
    });
  }

  if (lines.length === 0) {
    lines.push({
      label: 'Original payment method',
      amount: formatInr(breakdown.refundTotal),
      eta: '2–4 business days',
    });
  }

  return lines;
}
