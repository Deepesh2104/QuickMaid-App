import type { DemoBooking } from '@/constants/demo';
import { parsePrice, formatInr } from '@/features/checkout/lib/checkout.utils';
import { getPaymentHistory } from '@/features/payment/lib/payment.storage';
import type { PaymentRecord } from '@/features/payment/types/payment.types';
import { getUserProfile } from '@/lib/storage';

export type DocumentType = 'invoice' | 'receipt';

export interface BookingDocument {
  type: DocumentType;
  docNumber: string;
  issuedAt: string;
  bookingRef: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  service: string;
  visitDate: string;
  visitTime: string;
  maid: string;
  duration?: string;
  lineItems: { label: string; amount: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  walletUsed: number;
  paymentMethod: string;
  paymentTxnId?: string;
  gatewayPaymentId?: string;
  status: 'paid' | 'refunded' | 'pending';
}

async function findPayment(bookingRef?: string): Promise<PaymentRecord | undefined> {
  if (!bookingRef) return undefined;
  const history = await getPaymentHistory();
  return history.find((p) => p.bookingRef === bookingRef && p.status !== 'refunded');
}

function resolveAmounts(booking: DemoBooking, payment?: PaymentRecord) {
  const total = booking.amountPaid != null && booking.walletUsed != null
    ? booking.amountPaid + booking.walletUsed
    : parsePrice(booking.price);
  const amountPaid = booking.amountPaid ?? payment?.amount ?? total;
  const walletUsed = booking.walletUsed ?? payment?.walletUsed ?? 0;
  const subtotal = total;
  const discount = 0;
  const tax = Math.round(subtotal * 0.18);
  return { subtotal, discount, tax, total: subtotal, amountPaid, walletUsed };
}

export async function buildBookingDocument(
  booking: DemoBooking,
  type: DocumentType,
): Promise<BookingDocument> {
  const profile = await getUserProfile();
  const payment = await findPayment(booking.bookingRef);
  const amounts = resolveAmounts(booking, payment);
  const issuedAt = booking.completedAt ?? booking.maidAssignedAt ?? new Date().toISOString();
  const prefix = type === 'invoice' ? 'INV' : 'RCT';
  const docNumber = `${prefix}-${(booking.bookingRef ?? booking.id).replace(/^QM-/, '')}`;

  let status: BookingDocument['status'] = 'paid';
  if (booking.status === 'cancelled' && booking.refundTxnId) status = 'refunded';
  if (booking.status === 'upcoming' && amounts.amountPaid === 0 && amounts.walletUsed === 0) {
    status = 'pending';
  }

  const paymentMethod =
    booking.paymentLabel ?? payment?.methodLabel ?? (status === 'paid' ? 'UPI · Razorpay' : 'Pending');

  return {
    type,
    docNumber,
    issuedAt,
    bookingRef: booking.bookingRef ?? booking.id,
    bookingId: booking.id,
    customerName: profile?.name ?? 'QuickMaid Customer',
    customerPhone: profile?.phone ?? '+91 XXXXX XXXXX',
    customerAddress: booking.address,
    service: booking.service,
    visitDate: booking.date,
    visitTime: booking.slotLabel ?? booking.time,
    maid: booking.maid,
    duration: booking.duration,
    lineItems: [
      { label: booking.service, amount: amounts.subtotal },
      ...(amounts.discount > 0 ? [{ label: 'Discount', amount: -amounts.discount }] : []),
    ],
    ...amounts,
    paymentMethod,
    paymentTxnId: payment?.paymentId ?? booking.refundTxnId,
    gatewayPaymentId: payment?.paymentId,
    status,
  };
}

export function documentToShareText(doc: BookingDocument): string {
  const title = doc.type === 'invoice' ? 'TAX INVOICE' : 'PAYMENT RECEIPT';
  const lines = [
    `QuickMaid — ${title}`,
    `${doc.docNumber}`,
    `Booking: ${doc.bookingRef}`,
    `Service: ${doc.service}`,
    `Visit: ${doc.visitDate} · ${doc.visitTime}`,
    `Pro: ${doc.maid}`,
    `Total: ${formatInr(doc.total)}`,
    `Paid: ${formatInr(doc.amountPaid)}`,
    doc.walletUsed > 0 ? `Wallet: ${formatInr(doc.walletUsed)}` : '',
    `Method: ${doc.paymentMethod}`,
    doc.gatewayPaymentId ? `Txn: ${doc.gatewayPaymentId}` : '',
    `Status: ${doc.status.toUpperCase()}`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function canViewDocument(booking: DemoBooking, type: DocumentType): boolean {
  if (type === 'receipt' && booking.status === 'cancelled' && booking.refundTxnId) return true;
  if (booking.status === 'cancelled') return false;
  if (type === 'invoice') return booking.status === 'completed' || booking.status === 'upcoming';
  return booking.status === 'completed' || booking.status === 'upcoming';
}
