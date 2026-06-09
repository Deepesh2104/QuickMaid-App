import { getPaymentHistory } from '@/features/payment/lib/payment.storage';
import { isPlusCharge } from '@/features/payment/lib/payment.utils';
import type { PaymentRecord } from '@/features/payment/types/payment.types';
import { getProfileAccount } from '@/features/profile/lib/profile.storage';

function buildDemoPlusBilling(): PaymentRecord[] {
  const now = Date.now();
  return [
    {
      id: 'pay-plus-demo-2',
      gateway: 'razorpay',
      orderId: 'SUB-DEMO-JUN',
      paymentId: 'pay_plus_jun_demo',
      bookingRef: 'SUB-DEMO-JUN',
      amount: 499,
      walletUsed: 50,
      mode: 'wallet_partial',
      methodLabel: 'QuickMaid Plus · UPI',
      status: 'captured',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
    {
      id: 'pay-plus-demo-1',
      gateway: 'razorpay',
      orderId: 'SUB-DEMO-MAY',
      paymentId: 'pay_plus_may_demo',
      bookingRef: 'SUB-DEMO-MAY',
      amount: 499,
      walletUsed: 0,
      mode: 'upi',
      methodLabel: 'QuickMaid Plus · Google Pay',
      status: 'captured',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 34).toISOString(),
    },
  ];
}

export function filterPlusBilling(records: PaymentRecord[]): PaymentRecord[] {
  return records.filter(
    (p) => isPlusCharge(p) || p.methodLabel.toLowerCase().includes('plus'),
  );
}

/** All Plus membership charges (newest first). Demo rows for active members when empty. */
export async function listPlusBillingRecords(): Promise<PaymentRecord[]> {
  const history = await getPaymentHistory();
  const plus = filterPlusBilling(history);
  if (plus.length) return plus;

  const account = await getProfileAccount();
  if (account?.isPlusMember) return buildDemoPlusBilling();
  return [];
}

export function plusBillingTotal(records: PaymentRecord[]): number {
  return records
    .filter((r) => r.status === 'captured' || r.status === 'authorized')
    .reduce((sum, r) => sum + r.amount + r.walletUsed, 0);
}
