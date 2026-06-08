import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import {
  completePayment,
  paymentMethodLabel,
  type PaymentStep,
} from '@/features/checkout/lib/checkout.payment';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { PaymentMode } from '@/features/checkout/types/checkout.types';
import { addPaymentRecord } from '@/features/payment/lib/payment.storage';
import type { GatewayPaymentResult } from '@/features/payment/types/payment.types';
import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';
import type { PaymentMethod, ProfileAccountData } from '@/features/profile/types/profile.types';

import { getPlanById, getPlanVisits, parsePlanPrice } from './plus.plans';
import type { PlusSubscriptionRecord } from '../types/plus.subscription.types';

export interface PlusPaymentDraft {
  paymentMode: PaymentMode;
  paymentMethodId?: string;
  useWallet: boolean;
}

export function computePlusPayable(planId: string, account: ProfileAccountData, useWallet: boolean) {
  const plan = getPlanById(planId);
  const subtotal = parsePlanPrice(plan.price);
  let walletDeduction = 0;
  if (useWallet && account.walletBalance > 0) {
    walletDeduction = Math.min(account.walletBalance, subtotal);
  }
  const payable = Math.max(0, subtotal - walletDeduction);
  return { subtotal, walletDeduction, payable, plan };
}

export function validatePlusPayment(
  planId: string,
  draft: PlusPaymentDraft,
  account: ProfileAccountData,
): string | null {
  const { payable } = computePlusPayable(planId, account, draft.useWallet);
  if (payable === 0 && draft.useWallet) return null;

  const mode = draft.paymentMode;
  if (mode === 'netbanking' || mode === 'emi') return null;
  if (mode === 'upi' || mode === 'card') {
    const method = account.payments.find((m) => m.id === draft.paymentMethodId);
    if (!method || method.type !== mode) {
      return `Select a saved ${mode === 'upi' ? 'UPI' : 'card'} method to continue.`;
    }
  }
  if (payable <= 0 && !draft.useWallet) return 'Enter a valid payment amount.';
  return null;
}

function renewDateLabel(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export async function savePlusSubscription(record: PlusSubscriptionRecord): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.plusLastSubscription, JSON.stringify(record));
}

export async function getPlusSubscription(): Promise<PlusSubscriptionRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.plusLastSubscription);
    if (!raw) return null;
    return JSON.parse(raw) as PlusSubscriptionRecord;
  } catch {
    return null;
  }
}

export async function activatePlusMembership(
  planId: string,
  account: ProfileAccountData,
  walletUsed: number,
): Promise<ProfileAccountData> {
  const plan = getPlanById(planId);
  const visits = getPlanVisits(planId);
  const renewDate = renewDateLabel();
  const isPlus = planId === 'plus';

  const updated: ProfileAccountData = {
    ...account,
    walletBalance: Math.max(0, account.walletBalance - walletUsed),
    isPlusMember: isPlus,
    plusVisitsLeft: visits,
    plusRenewDate: renewDate,
    plan: {
      type: isPlus ? 'plus' : planId === 'flex' ? 'monthly' : 'instant',
      label: `${plan.name} · Monthly`,
    },
  };

  await saveProfileAccount(updated);
  return updated;
}

export async function processPlusSubscription(
  planId: string,
  draft: PlusPaymentDraft,
  onStep: (step: PaymentStep) => void,
  gatewayResult?: GatewayPaymentResult,
): Promise<{ ok: true; record: PlusSubscriptionRecord } | { ok: false; error: string }> {
  const account = await getProfileAccount();
  const { subtotal, walletDeduction, payable, plan } = computePlusPayable(planId, account, draft.useWallet);

  const method = account.payments.find((m) => m.id === draft.paymentMethodId);
  let mode: PaymentMode = draft.paymentMode;
  if (payable === 0 && draft.useWallet) mode = 'wallet_full';
  else if (draft.useWallet && walletDeduction > 0) mode = 'wallet_partial';

  const label = paymentMethodLabel(mode, method, walletDeduction);
  const payment = await completePayment(mode, payable, label, onStep, gatewayResult);

  if (!payment.success) {
    return { ok: false, error: payment.message || 'Payment could not be completed.' };
  }

  const updatedAccount = await activatePlusMembership(planId, account, walletDeduction);
  const renewDate = updatedAccount.plusRenewDate;
  const now = new Date().toISOString();
  const subscriptionId = `SUB-${Date.now().toString(36).toUpperCase()}`;

  const record: PlusSubscriptionRecord = {
    planId,
    planName: plan.name,
    amount: subtotal,
    walletUsed: walletDeduction,
    txnId: payment.txnId,
    paymentLabel: payment.label,
    subscribedAt: now,
    renewDate,
    visitsLeft: updatedAccount.plusVisitsLeft,
    isPlusMember: updatedAccount.isPlusMember,
  };

  await savePlusSubscription(record);

  if (gatewayResult?.success) {
    await addPaymentRecord({
      id: gatewayResult.paymentId,
      gateway: gatewayResult.gateway,
      orderId: gatewayResult.orderId,
      paymentId: gatewayResult.paymentId,
      bookingRef: subscriptionId,
      amount: payable,
      walletUsed: walletDeduction,
      mode,
      methodLabel: `${plan.name} · ${gatewayResult.methodLabel}`,
      status: 'captured',
      createdAt: now,
    });
  } else if (payable > 0 || walletDeduction > 0) {
    await addPaymentRecord({
      id: payment.txnId,
      gateway: 'razorpay',
      orderId: subscriptionId,
      paymentId: payment.txnId,
      bookingRef: subscriptionId,
      amount: payable,
      walletUsed: walletDeduction,
      mode,
      methodLabel: `${plan.name} · ${payment.label}`,
      status: 'captured',
      createdAt: now,
    });
  }

  return { ok: true, record };
}

export function plusSubscribeShareMessage(record: PlusSubscriptionRecord): string {
  return [
    'QuickMaid membership confirmed',
    `${record.planName}`,
    `Amount: ${formatInr(record.amount)}`,
    `Visits: ${record.visitsLeft}`,
    `Renews: ${record.renewDate}`,
    `Txn: ${record.txnId}`,
  ].join('\n');
}
