import type { PaymentMethod } from '@/features/profile/types/profile.types';
import type { GatewayPaymentResult } from '@/features/payment/types/payment.types';

import type { CheckoutDraft, OrderSummary, PaymentMode } from '../types/checkout.types';
import { formatInr } from './checkout.utils';

export type PaymentStep = 'init' | 'authorizing' | 'confirming' | 'done';

export interface PaymentResult {
  success: boolean;
  txnId: string;
  mode: PaymentMode;
  amount: number;
  label: string;
  message: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function resolvePaymentMode(draft: CheckoutDraft, summary: OrderSummary): PaymentMode {
  if (summary.payable === 0 && draft.useWallet) return 'wallet_full';
  if (draft.useWallet && summary.walletDeduction > 0) return 'wallet_partial';
  return draft.paymentMode ?? 'upi';
}

export function paymentMethodLabel(
  mode: PaymentMode,
  method?: PaymentMethod,
  walletAmount = 0,
): string {
  if (mode === 'wallet_full') return `QuickMaid Wallet · ${formatInr(walletAmount)}`;
  if (mode === 'wallet_partial') {
    const rest = method ? `${method.label} (${method.detail})` : 'UPI';
    return `Wallet + ${rest}`;
  }
  if (mode === 'cash') return 'Cash after service';
  if (mode === 'pay_later') return 'Pay within 24 hours';
  if (mode === 'netbanking') return 'Net Banking · Razorpay';
  if (mode === 'emi') return 'Card EMI · Razorpay';
  if (method) return `${method.label} · ${method.detail}`;
  return mode === 'card' ? 'Debit / Credit card' : 'UPI';
}

export function validatePayment(
  draft: CheckoutDraft,
  summary: OrderSummary,
  methods: PaymentMethod[],
): string | null {
  if (!draft.items.length) return 'Your cart is empty.';
  if (!draft.addressId) return 'Please select a delivery address.';
  if (!draft.visitDate || !draft.slotId) return 'Please pick a visit date and time slot.';

  const walletCoversAll = summary.payable === 0 && draft.useWallet;
  if (walletCoversAll) return null;

  const mode = draft.paymentMode ?? 'upi';
  if (mode === 'upi' || mode === 'card') {
    const method = methods.find((m) => m.id === draft.paymentMethodId);
    if (!method || method.type !== mode) {
      return `Select a saved ${mode === 'upi' ? 'UPI' : 'card'} method to continue.`;
    }
  }

  if (summary.payable <= 0 && !draft.useWallet) return 'Enter a valid payment amount.';
  return null;
}

export async function simulatePayment(
  mode: PaymentMode,
  amount: number,
  methodLabel: string,
  onStep: (step: PaymentStep) => void,
): Promise<PaymentResult> {
  const txnId = `TXN${Date.now().toString(36).toUpperCase()}`;

  onStep('init');
  await delay(700);

  if (mode === 'cash' || mode === 'pay_later') {
    onStep('confirming');
    await delay(500);
    onStep('done');
    await delay(400);
    return {
      success: true,
      txnId,
      mode,
      amount,
      label: methodLabel,
      message: mode === 'cash' ? 'Pay after your visit is complete' : 'Payment due within 24 hours',
    };
  }

  onStep('authorizing');
  await delay(mode === 'wallet_full' ? 600 : 1200);

  onStep('confirming');
  await delay(800);

  onStep('done');
  await delay(500);

  return {
    success: true,
    txnId,
    mode,
    amount,
    label: methodLabel,
    message:
      mode === 'wallet_full' || mode === 'wallet_partial'
        ? 'Wallet debited successfully'
        : `Paid via ${methodLabel}`,
  };
}

export function needsGatewayPayment(draft: CheckoutDraft, summary: OrderSummary): boolean {
  if (summary.payable <= 0) return false;
  const mode = draft.paymentMode ?? 'upi';
  return mode === 'upi' || mode === 'card' || mode === 'netbanking' || mode === 'emi';
}

export function needsNetBankingEmiGateway(draft: CheckoutDraft, summary: OrderSummary): boolean {
  if (summary.payable <= 0) return false;
  const mode = draft.paymentMode ?? 'upi';
  return mode === 'netbanking' || mode === 'emi';
}

export async function completePayment(
  mode: PaymentMode,
  amount: number,
  methodLabel: string,
  onStep: (step: PaymentStep) => void,
  gatewayResult?: GatewayPaymentResult,
): Promise<PaymentResult> {
  if (!gatewayResult) {
    return simulatePayment(mode, amount, methodLabel, onStep);
  }

  onStep('init');
  await delay(350);

  if (!gatewayResult.success) {
    return {
      success: false,
      txnId: '',
      mode,
      amount,
      label: methodLabel,
      message: gatewayResult.error ?? 'Payment failed',
    };
  }

  onStep('authorizing');
  await delay(500);
  onStep('confirming');
  await delay(600);
  onStep('done');
  await delay(350);

  return {
    success: true,
    txnId: gatewayResult.paymentId,
    mode,
    amount,
    label: gatewayResult.methodLabel,
    message: `Paid via Razorpay · ${gatewayResult.paymentId}`,
  };
}
