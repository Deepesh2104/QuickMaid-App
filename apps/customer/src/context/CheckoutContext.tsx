import { type Href, useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { ServiceItem } from '@/constants/services';
import { PREFERRED_SLOTS } from '@/constants/customer.zones';
import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';
import { formatAddressLine } from '@/features/profile/lib/profile.utils';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';
import { addStoredBooking } from '@/features/checkout/lib/bookings.storage';
import { pushBookingToPartnerBridge } from '@/lib/booking-partner-bridge';
import { autoAssignMaid } from '@/features/bookings/lib/maid.assign';
import {
  completePayment,
  paymentMethodLabel,
  resolvePaymentMode,
  validatePayment,
  type PaymentStep,
} from '@/features/checkout/lib/checkout.payment';
import { addNotification } from '@/features/notifications/lib/notifications.storage';
import { addPaymentRecord } from '@/features/payment/lib/payment.storage';
import { markCouponUsed } from '@/features/coupons/lib/coupon.storage';
import { addWalletTransaction } from '@/features/wallet/lib/wallet.storage';
import type { GatewayPaymentResult } from '@/features/payment/types/payment.types';
import {
  computeOrderSummary,
  generateBookingRef,
  getVisitDates,
  slotToTime,
} from '@/features/checkout/lib/checkout.utils';
import type { CheckoutDraft, PaymentMode, PlacedOrder } from '@/features/checkout/types/checkout.types';
import { serviceToCartItem } from '@/features/checkout/types/checkout.types';

const EMPTY_DRAFT: CheckoutDraft = { items: [], useWallet: true };

interface CheckoutContextValue {
  draft: CheckoutDraft;
  account: ProfileAccountData | null;
  lastOrder: PlacedOrder | null;
  loading: boolean;
  refreshAccount: () => Promise<void>;
  startCheckout: (service: ServiceItem) => Promise<void>;
  updateDraft: (patch: Partial<CheckoutDraft>) => void;
  processPaymentAndPlaceOrder: (
    onStep: (step: PaymentStep) => void,
    gatewayResult?: GatewayPaymentResult,
  ) => Promise<PlacedOrder | null>;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshAccount = useCallback(async () => {
    const a = await getProfileAccount();
    setAccount(a);
  }, []);

  const startCheckout = useCallback(
    async (service: ServiceItem) => {
      const a = account ?? (await getProfileAccount());
      setAccount(a);
      const defaultAddr = a.addresses.find((x) => x.isDefault) ?? a.addresses[0];
      const slot = PREFERRED_SLOTS.find((s) => s.value === a.bookingPrefs.preferredSlot) ?? PREFERRED_SLOTS[0];
      const firstDate = getVisitDates(7)[0];
      const defaultPay = a.payments.find((p) => p.isDefault && p.type !== 'wallet')
        ?? a.payments.find((p) => p.type === 'upi' || p.type === 'card');
      const item = serviceToCartItem(service);
      setDraft({
        items: [item],
        addressId: defaultAddr?.id,
        slotId: slot.value,
        slotLabel: slot.label,
        visitDate: firstDate.iso,
        visitDateLabel: firstDate.label,
        useWallet: a.walletBalance > 0,
        paymentMode: defaultPay?.type === 'card' ? 'card' : 'upi',
        paymentMethodId: defaultPay?.id,
      });
      router.push('/checkout' as Href);
    },
    [account, router],
  );

  const updateDraft = useCallback((patch: Partial<CheckoutDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const clearCheckout = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    setLastOrder(null);
  }, []);

  const processPaymentAndPlaceOrder = useCallback(
    async (
      onStep: (step: PaymentStep) => void,
      gatewayResult?: GatewayPaymentResult,
    ): Promise<PlacedOrder | null> => {
      if (!account) return null;
      const summary = computeOrderSummary(draft, account);
      const err = validatePayment(draft, summary, account.payments);
      if (err) return null;

      setLoading(true);

      const addr = account.addresses.find((a) => a.id === draft.addressId);
      if (!addr) {
        setLoading(false);
        return null;
      }

      const item = draft.items[0];
      const paymentMode = resolvePaymentMode(draft, summary);
      const method = account.payments.find((p) => p.id === draft.paymentMethodId);
      const label = paymentMethodLabel(paymentMode, method, summary.walletDeduction);
      const chargeAmount = summary.payable;

      const payment = await completePayment(paymentMode, chargeAmount, label, onStep, gatewayResult);
      if (!payment.success) {
        setLoading(false);
        return null;
      }

      let nextAccount = { ...account };
      const bookingRef = generateBookingRef(item.priceNum);

      if (summary.walletDeduction > 0) {
        nextAccount = {
          ...nextAccount,
          walletBalance: nextAccount.walletBalance - summary.walletDeduction,
        };
        await saveProfileAccount(nextAccount);
        setAccount(nextAccount);
      }
      const assignment = autoAssignMaid(account.bookingPrefs.favoriteMaidName);
      const order: PlacedOrder = {
        id: `ord_${Date.now()}`,
        service: item.name,
        icon: item.icon,
        date: draft.visitDateLabel ?? draft.visitDate ?? '',
        time: slotToTime(draft.slotId),
        maid: assignment.maidName,
        price: `₹${chargeAmount > 0 ? chargeAmount : summary.total}`,
        priceNum: chargeAmount > 0 ? chargeAmount : summary.total,
        status: 'upcoming',
        address: formatAddressLine(addr),
        bookingRef,
        duration: item.duration,
        paymentMode: paymentMode as PaymentMode,
        paymentTxnId: payment.txnId,
        paymentLabel: payment.label,
        amountPaid: chargeAmount,
        walletUsed: summary.walletDeduction,
        slotLabel: draft.slotLabel,
        createdAt: new Date().toISOString(),
        gatewayOrderId: gatewayResult?.orderId,
        gatewayPaymentId: gatewayResult?.paymentId,
        couponCode: draft.couponCode,
        couponDiscount: summary.couponDiscount,
        maidId: assignment.maidId,
        maidRating: assignment.maidRating,
        maidJobs: assignment.maidJobs,
        completionOtp: assignment.completionOtp,
        maidAssignedAt: assignment.assignedAt,
      };

      if (summary.walletDeduction > 0) {
        await addWalletTransaction({
          kind: 'debit',
          source: 'booking',
          amount: summary.walletDeduction,
          title: item.name,
          subtitle: bookingRef,
          refId: order.id,
        });
      }

      if (gatewayResult?.success) {
        await addPaymentRecord({
          id: gatewayResult.paymentId,
          gateway: gatewayResult.gateway,
          orderId: gatewayResult.orderId,
          paymentId: gatewayResult.paymentId,
          bookingRef,
          amount: chargeAmount,
          walletUsed: summary.walletDeduction,
          mode: paymentMode as PaymentMode,
          methodLabel: gatewayResult.methodLabel,
          status: 'captured',
          createdAt: new Date().toISOString(),
        });
      }

      if (draft.couponCode) {
        await markCouponUsed(draft.couponCode);
      }

      await addStoredBooking(order);
      await pushBookingToPartnerBridge(order, account.name);
      await addNotification({
        id: `notif_${order.id}`,
        category: 'booking',
        title: 'Booking confirmed',
        body: `${order.service} · ${order.date} · Pro ${order.maid} auto-assigned`,
        createdAt: new Date().toISOString(),
        action: { type: 'booking', id: order.id },
        icon: 'calendar',
        tone: '#EEF6FF',
        ink: '#175CD3',
      });
      setLastOrder(order);
      setLoading(false);
      return order;
    },
    [account, draft],
  );

  const value = useMemo(
    () => ({
      draft,
      account,
      lastOrder,
      loading,
      refreshAccount,
      startCheckout,
      updateDraft,
      processPaymentAndPlaceOrder,
      clearCheckout,
    }),
    [draft, account, lastOrder, loading, refreshAccount, startCheckout, updateDraft, processPaymentAndPlaceOrder, clearCheckout],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
