import type { PaymentRecord } from '../types/payment.types';

export const PAYMENT_STATUS_THEME: Record<
  PaymentRecord['status'],
  { label: string; ink: string; tone: string; icon: 'checkmark-circle' | 'time' | 'close-circle' | 'refresh' }
> = {
  captured: { label: 'Paid', ink: '#027A48', tone: '#ECFDF3', icon: 'checkmark-circle' },
  authorized: { label: 'Authorized', ink: '#175CD3', tone: '#EEF6FF', icon: 'time' },
  pending: { label: 'Pending', ink: '#B45309', tone: '#FFFBEB', icon: 'time' },
  failed: { label: 'Failed', ink: '#D92D20', tone: '#FEF3F2', icon: 'close-circle' },
  refunded: { label: 'Refunded', ink: '#6941C6', tone: '#F4F3FF', icon: 'refresh' },
};

export function formatPaymentDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPaymentDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isPlusCharge(record: PaymentRecord): boolean {
  return record.bookingRef?.startsWith('SUB-') ?? false;
}

export function paymentTitle(record: PaymentRecord): string {
  if (isPlusCharge(record)) return 'QuickMaid Plus';
  if (record.bookingRef) return `Booking ${record.bookingRef}`;
  return record.methodLabel;
}
