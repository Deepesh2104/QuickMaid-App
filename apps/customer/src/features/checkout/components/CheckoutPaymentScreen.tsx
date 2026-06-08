import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useCheckout } from '@/context/CheckoutContext';
import { PaymentFailedModal } from '@/features/payment/components/PaymentFailedModal';
import { PaymentGatewayBadge } from '@/features/payment/components/PaymentGatewayBadge';
import { PaymentOffersStrip } from '@/features/payment/components/PaymentOffersStrip';
import { InstalledUpiAppsPicker } from '@/features/payment/components/InstalledUpiAppsPicker';
import { RazorpayGatewayModal } from '@/features/payment/components/RazorpayGatewayModal';
import { RazorpayNetBankingEmiModal } from '@/features/payment/components/RazorpayNetBankingEmiModal';
import type { UpiAppDef } from '@/features/payment/constants/gateway';
import { openUpiAppChooser } from '@/features/payment/lib/upi.apps';
import type { GatewayPaymentResult } from '@/features/payment/types/payment.types';
import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';
import type { PaymentMethod } from '@/features/profile/types/profile.types';
import {
  needsGatewayPayment,
  needsNetBankingEmiGateway,
  paymentMethodLabel,
  resolvePaymentMode,
  validatePayment,
  type PaymentStep,
} from '../lib/checkout.payment';
import { computeOrderSummary, formatInr } from '../lib/checkout.utils';
import type { PaymentMode } from '../types/checkout.types';
import { CheckoutAddPaymentSheet } from './CheckoutAddPaymentSheet';
import { CheckoutPriceSummary } from './CheckoutPriceSummary';
import { CheckoutShell } from './CheckoutShell';
import { CheckoutStickyFooter } from './CheckoutStickyFooter';
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { ProfileWalletPass } from '@/features/profile/components/ProfileWalletPass';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const MODES: { id: PaymentMode; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'upi', label: 'UPI', sub: 'GPay · PhonePe · Paytm via Razorpay', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Debit / Credit card', sub: 'Visa · Mastercard · RuPay', icon: 'card-outline' },
  { id: 'netbanking', label: 'Net Banking', sub: 'HDFC · ICICI · SBI · Axis', icon: 'business-outline' },
  { id: 'emi', label: 'Card EMI', sub: 'No-cost & low-cost EMI plans', icon: 'calendar-outline' },
  { id: 'cash', label: 'Cash after service', sub: 'Pay when job is done', icon: 'cash-outline' },
  { id: 'pay_later', label: 'Pay later', sub: 'Book now, pay within 24 hrs', icon: 'time-outline' },
];

export function CheckoutPaymentScreen() {
  const router = useRouter();
  const { draft, account, updateDraft, processPaymentAndPlaceOrder, loading, refreshAccount, clearCheckout } =
    useCheckout();
  const [placing, setPlacing] = useState(false);
  const [payStep, setPayStep] = useState<PaymentStep>('init');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [showNetBankingEmi, setShowNetBankingEmi] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [failMsg, setFailMsg] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiAppDef | null>(null);
  const summary = account ? computeOrderSummary(draft, account) : null;

  useEffect(() => {
    if (!account || draft.paymentMethodId) return;
    const def = account.payments.find((p) => p.isDefault && p.type !== 'wallet')
      ?? account.payments.find((p) => p.type === 'upi');
    if (def) updateDraft({ paymentMethodId: def.id, paymentMode: def.type === 'card' ? 'card' : 'upi' });
  }, [account, draft.paymentMethodId, updateDraft]);

  const toggleWallet = (val: boolean) => {
    Haptics.selectionAsync();
    updateDraft({ useWallet: val });
  };

  const selectMode = (id: PaymentMode) => {
    Haptics.selectionAsync();
    const method = account?.payments.find((p) => p.type === id);
    updateDraft({
      paymentMode: id,
      paymentMethodId: method?.id ?? draft.paymentMethodId,
    });
  };

  const applyCoupon = (code: string) => {
    updateDraft({ couponCode: code });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const removeCoupon = () => updateDraft({ couponCode: undefined });

  const finishOrder = async (gatewayResult?: GatewayPaymentResult) => {
    if (!account || !summary) return;

    setPlacing(true);
    setShowPayModal(true);
    setPayStep('init');

    const order = await processPaymentAndPlaceOrder(setPayStep, gatewayResult);
    setPlacing(false);

    if (order) {
      await new Promise((r) => setTimeout(r, 400));
      setShowPayModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearCheckout();
      router.replace('/(tabs)/bookings' as Href);
    } else {
      setShowPayModal(false);
      setFailMsg('Payment could not be completed. Please try again.');
      setShowFailed(true);
    }
  };

  const pay = async () => {
    if (!account || !summary) return;

    const err = validatePayment(draft, summary, account.payments);
    if (err) {
      Alert.alert('Almost there', err);
      return;
    }

    if (needsNetBankingEmiGateway(draft, summary)) {
      setShowNetBankingEmi(true);
      return;
    }

    if (needsGatewayPayment(draft, summary)) {
      setShowGateway(true);
      return;
    }

    await finishOrder();
  };

  const onGatewaySuccess = async (result: GatewayPaymentResult) => {
    setShowGateway(false);
    setShowNetBankingEmi(false);
    await finishOrder(result);
  };

  const onGatewayFailure = (error: string) => {
    setShowGateway(false);
    setShowNetBankingEmi(false);
    setFailMsg(error);
    setShowFailed(true);
  };

  const saveNewPayment = async (pm: Omit<PaymentMethod, 'id'>) => {
    const a = account ?? (await getProfileAccount());
    const id = `pay_${Date.now()}`;
    const next = { ...a, payments: [...a.payments, { ...pm, id }] };
    await saveProfileAccount(next);
    await refreshAccount();
    updateDraft({ paymentMethodId: id, paymentMode: pm.type === 'card' ? 'card' : 'upi' });
  };

  const walletCoversAll = summary && summary.payable === 0 && draft.useWallet;
  const canPay = summary ? !validatePayment(draft, summary, account?.payments ?? []) : false;
  const savedMethod = account?.payments.find((p) => p.id === draft.paymentMethodId);
  const savedCard = account?.payments.find((p) => p.type === 'card');
  const gatewayMethod = draft.paymentMode === 'card' ? 'card' : 'upi';
  const netBankingEmiMode =
    draft.paymentMode === 'netbanking' || draft.paymentMode === 'emi' ? draft.paymentMode : 'netbanking';

  return (
    <>
      <CheckoutShell
        step="payment"
        title="Payment"
        footer={
          summary ? (
            <CheckoutStickyFooter
              amount={summary.payable}
              label={walletCoversAll ? 'Place order' : summary.payable === 0 ? 'Confirm booking' : `Pay ${formatInr(summary.payable)}`}
              sub={
                walletCoversAll
                  ? 'Paid via wallet'
                  : draft.paymentMode === 'cash'
                    ? 'Cash after service'
                    : draft.paymentMode === 'pay_later'
                      ? 'Pay within 24 hrs'
                      : 'Razorpay secure checkout'
              }
              onPress={pay}
              loading={placing || loading}
              disabled={!canPay}
            />
          ) : null
        }
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <PaymentGatewayBadge />

          {account ? (
            <View style={styles.walletBlock}>
              <ProfileWalletPass balance={account.walletBalance} compact />
              <View style={styles.walletToggle}>
                <View style={styles.walletCopy}>
                  <Text style={styles.walletLabel}>Use QuickMaid Wallet</Text>
                  <Text style={styles.walletSub}>
                    {account.walletBalance > 0
                      ? `${formatInr(account.walletBalance)} available`
                      : 'Top up from Account tab'}
                  </Text>
                </View>
                <Switch
                  value={draft.useWallet}
                  onValueChange={toggleWallet}
                  trackColor={{ false: colors.bgMuted, true: colors.primaryLight }}
                  thumbColor={draft.useWallet ? colors.primary : colors.mutedLight}
                  disabled={account.walletBalance <= 0}
                />
              </View>
            </View>
          ) : null}

          {summary ? (
            <PaymentOffersStrip
              appliedCode={draft.couponCode}
              discount={summary.couponDiscount}
              onApply={applyCoupon}
              onRemove={removeCoupon}
            />
          ) : null}

          {!walletCoversAll ? (
            <>
              <Text style={styles.sectionTitle}>Payment method</Text>
              {MODES.map((m) => {
                const on = draft.paymentMode === m.id;
                return (
                  <Pressable key={m.id} style={[styles.mode, on && styles.modeOn]} onPress={() => selectMode(m.id)}>
                    <View style={[styles.modeIcon, on && styles.modeIconOn]}>
                      <Ionicons name={m.icon} size={20} color={on ? colors.primaryDark : colors.muted} />
                    </View>
                    <View style={styles.modeCopy}>
                      <Text style={[styles.modeLabel, on && styles.modeLabelOn]}>{m.label}</Text>
                      <Text style={styles.modeSub}>{m.sub}</Text>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
                  </Pressable>
                );
              })}

              {draft.paymentMode === 'upi' ? (
                <View style={styles.upiAppsBlock}>
                  <InstalledUpiAppsPicker
                    selectedId={selectedUpiApp?.id}
                    onSelect={setSelectedUpiApp}
                    onOpenChooser={() => {
                      if (!summary) return;
                      void openUpiAppChooser({
                        amount: summary.payable,
                        receipt: draft.items[0]?.serviceId ?? 'checkout',
                      });
                    }}
                  />
                </View>
              ) : null}

              {draft.paymentMode === 'emi' ? (
                <View style={styles.emiHint}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
                  <Text style={styles.emiHintText}>
                    EMI works on saved credit cards. You'll pick tenure in the Razorpay screen.
                  </Text>
                </View>
              ) : null}

              {draft.paymentMode === 'upi' || draft.paymentMode === 'card' ? (
                <View style={styles.savedMethods}>
                  <View style={styles.savedHead}>
                    <Text style={styles.savedTitle}>Saved methods</Text>
                    <Pressable
                      style={styles.addBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setShowAddPayment(true);
                      }}
                    >
                      <Ionicons name="add" size={16} color={colors.primary} />
                      <Text style={styles.addText}>Add new</Text>
                    </Pressable>
                  </View>
                  {account?.payments
                    .filter((p) => p.type !== 'wallet' && (draft.paymentMode === 'upi' ? p.type === 'upi' : p.type === 'card'))
                    .map((pm) => {
                      const on = draft.paymentMethodId === pm.id;
                      return (
                        <Pressable
                          key={pm.id}
                          style={[styles.savedRow, on && styles.savedRowOn]}
                          onPress={() => updateDraft({ paymentMethodId: pm.id })}
                        >
                          <Ionicons name={pm.icon} size={18} color={colors.primaryDark} />
                          <View style={styles.savedCopy}>
                            <Text style={styles.savedLabel}>{pm.label}</Text>
                            <Text style={styles.savedDetail}>{pm.detail}</Text>
                          </View>
                          {on ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
                        </Pressable>
                      );
                    })}
                </View>
              ) : null}

            </>
          ) : (
            <View style={styles.walletPaid}>
              <LinearGradient colors={['#ECFDF3', '#D1FAE5']} style={StyleSheet.absoluteFill} />
              <Ionicons name="checkmark-circle" size={28} color="#059669" />
              <Text style={styles.walletPaidTitle}>Fully covered by wallet</Text>
              <Text style={styles.walletPaidSub}>Tap Place order to confirm</Text>
            </View>
          )}

          {summary ? <CheckoutPriceSummary summary={summary} /> : null}
        </ScrollView>
      </CheckoutShell>

      {summary && account ? (
        <>
          <RazorpayGatewayModal
            visible={showGateway}
            amount={summary.payable}
            receipt={draft.items[0]?.serviceId ?? 'checkout'}
            method={gatewayMethod}
            savedMethod={savedMethod}
            onClose={() => setShowGateway(false)}
            onSuccess={onGatewaySuccess}
            onFailure={onGatewayFailure}
          />

          <RazorpayNetBankingEmiModal
            visible={showNetBankingEmi}
            amount={summary.payable}
            receipt={draft.items[0]?.serviceId ?? 'checkout'}
            mode={netBankingEmiMode}
            savedCard={savedCard}
            onClose={() => setShowNetBankingEmi(false)}
            onSuccess={onGatewaySuccess}
            onFailure={onGatewayFailure}
          />

          <PaymentFailedModal
            visible={showFailed}
            message={failMsg}
            onRetry={() => {
              setShowFailed(false);
              if (needsNetBankingEmiGateway(draft, summary)) setShowNetBankingEmi(true);
              else if (needsGatewayPayment(draft, summary)) setShowGateway(true);
              else void finishOrder();
            }}
            onClose={() => setShowFailed(false)}
          />

          <PaymentProcessingModal
            visible={showPayModal}
            step={payStep}
            amount={summary.payable}
            methodLabel={paymentMethodLabel(
              resolvePaymentMode(draft, summary),
              savedMethod,
              summary.walletDeduction,
            )}
          />

          <CheckoutAddPaymentSheet
            visible={showAddPayment}
            type={draft.paymentMode === 'card' ? 'card' : 'upi'}
            onClose={() => setShowAddPayment(false)}
            onSave={saveNewPayment}
          />
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: layout.pad, gap: spacing.md, paddingBottom: 120 },
  walletBlock: { gap: spacing.sm },
  walletToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  walletCopy: { flex: 1, gap: 2 },
  walletLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  walletSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink, marginTop: spacing.xs },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  modeOn: { borderColor: colors.primary, backgroundColor: '#F8FDFC' },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconOn: { backgroundColor: colors.primaryLight },
  modeCopy: { flex: 1, gap: 2 },
  modeLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  modeLabelOn: { color: colors.primaryDark },
  modeSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  upiAppsBlock: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  savedMethods: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  savedHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  savedTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#FAFBFC',
  },
  savedRowOn: { backgroundColor: colors.primaryLight },
  savedCopy: { flex: 1, gap: 1 },
  savedLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  savedDetail: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  emiHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  emiHintText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 17,
  },
  walletPaid: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    gap: spacing.xs,
  },
  walletPaidTitle: { fontFamily: fonts.extraBold, fontSize: 16, color: '#059669' },
  walletPaidSub: { fontFamily: fonts.medium, fontSize: 13, color: '#047857' },
});
