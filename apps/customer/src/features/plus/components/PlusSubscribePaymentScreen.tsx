import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { PaymentMode } from '@/features/checkout/types/checkout.types';
import { PaymentFailedModal } from '@/features/payment/components/PaymentFailedModal';
import { PaymentGatewayBadge } from '@/features/payment/components/PaymentGatewayBadge';
import { RazorpayGatewayModal } from '@/features/payment/components/RazorpayGatewayModal';
import { RazorpayNetBankingEmiModal } from '@/features/payment/components/RazorpayNetBankingEmiModal';
import type { GatewayPaymentResult } from '@/features/payment/types/payment.types';
import { getProfileAccount } from '@/features/profile/lib/profile.storage';
import type { PaymentMethod, ProfileAccountData } from '@/features/profile/types/profile.types';
import { PaymentProcessingModal } from '@/features/checkout/components/PaymentProcessingModal';
import { paymentMethodLabel, type PaymentStep } from '@/features/checkout/lib/checkout.payment';
import { getPlanById, isSubscriptionPlan } from '../lib/plus.plans';
import {
  computePlusPayable,
  processPlusSubscription,
  validatePlusPayment,
  type PlusPaymentDraft,
} from '../lib/plus.subscribe';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const MODES: { id: PaymentMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Card', icon: 'card-outline' },
  { id: 'netbanking', label: 'Net Banking', icon: 'business-outline' },
  { id: 'emi', label: 'Card EMI', icon: 'calendar-outline' },
];

export function PlusSubscribePaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plan: planId = 'plus' } = useLocalSearchParams<{ plan?: string }>();
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [draft, setDraft] = useState<PlusPaymentDraft>({
    paymentMode: 'upi',
    useWallet: true,
  });
  const [paying, setPaying] = useState(false);
  const [payStep, setPayStep] = useState<PaymentStep>('init');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [showNetBankingEmi, setShowNetBankingEmi] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [failMsg, setFailMsg] = useState('');

  const plan = getPlanById(planId);

  useEffect(() => {
    void getProfileAccount().then((a) => {
      setAccount(a);
      const def = a.payments.find((p) => p.isDefault && p.type !== 'wallet')
        ?? a.payments.find((p) => p.type === 'upi');
      if (def) setDraft((d) => ({ ...d, paymentMethodId: def.id, paymentMode: def.type === 'card' ? 'card' : 'upi' }));
    });
  }, []);

  if (!isSubscriptionPlan(planId) || !account) {
    return null;
  }

  const { subtotal, walletDeduction, payable } = computePlusPayable(planId, account, draft.useWallet);
  const savedMethod = account.payments.find((m) => m.id === draft.paymentMethodId);
  const savedCard = account.payments.find((m) => m.type === 'card');
  const gatewayMethod = draft.paymentMode === 'card' ? 'card' : 'upi';
  const netBankingEmiMode =
    draft.paymentMode === 'netbanking' || draft.paymentMode === 'emi' ? draft.paymentMode : 'netbanking';

  const finish = async (gatewayResult?: GatewayPaymentResult) => {
    setPaying(true);
    setShowPayModal(true);
    setPayStep('init');

    const result = await processPlusSubscription(planId, draft, setPayStep, gatewayResult);
    setPaying(false);

    if (result.ok) {
      await new Promise((r) => setTimeout(r, 400));
      setShowPayModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/plus/success', params: { plan: planId } } as Href);
    } else {
      setShowPayModal(false);
      setFailMsg(result.error);
      setShowFailed(true);
    }
  };

  const pay = async () => {
    const err = validatePlusPayment(planId, draft, account);
    if (err) {
      Alert.alert('Almost there', err);
      return;
    }

    if (payable > 0 && (draft.paymentMode === 'netbanking' || draft.paymentMode === 'emi')) {
      setShowNetBankingEmi(true);
      return;
    }

    const needsGateway = payable > 0 && (draft.paymentMode === 'upi' || draft.paymentMode === 'card');
    if (needsGateway) {
      setShowGateway(true);
      return;
    }
    await finish();
  };

  const methods =
    draft.paymentMode === 'upi' || draft.paymentMode === 'card'
      ? account.payments.filter((m) => m.type === draft.paymentMode)
      : [];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Pay for {plan.name}</Text>
          <PaymentGatewayBadge />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Membership</Text>
          <Text style={styles.summaryPlan}>{plan.name}</Text>
          <Text style={styles.summaryMeta}>{plan.visits} · {plan.savings}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Subtotal</Text>
            <Text style={styles.summaryVal}>{formatInr(subtotal)}</Text>
          </View>
          {walletDeduction > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Wallet</Text>
              <Text style={[styles.summaryVal, styles.discount]}>-{formatInr(walletDeduction)}</Text>
            </View>
          ) : null}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalKey}>Pay today</Text>
            <Text style={styles.totalVal}>{formatInr(payable)}</Text>
          </View>
        </View>

        <View style={styles.walletCard}>
          <View style={styles.walletCopy}>
            <Ionicons name="wallet-outline" size={20} color={colors.primaryDark} />
            <View>
              <Text style={styles.walletTitle}>Use wallet</Text>
              <Text style={styles.walletSub}>Balance {formatInr(account.walletBalance)}</Text>
            </View>
          </View>
          <Switch
            value={draft.useWallet}
            onValueChange={(v) => {
              Haptics.selectionAsync();
              setDraft((d) => ({ ...d, useWallet: v }));
            }}
            trackColor={{ true: colors.primary, false: colors.bgMuted }}
          />
        </View>

        <Text style={styles.sectionTitle}>Payment method</Text>
        <View style={styles.modes}>
          {MODES.map((m) => {
            const on = draft.paymentMode === m.id;
            return (
              <Pressable
                key={m.id}
                style={[styles.mode, on && styles.modeOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  const method = account.payments.find((p) => p.type === m.id);
                  setDraft((d) => ({ ...d, paymentMode: m.id, paymentMethodId: method?.id }));
                }}
              >
                <Ionicons name={m.icon} size={18} color={on ? colors.primaryDark : colors.muted} />
                <Text style={[styles.modeText, on && styles.modeTextOn]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.methods}>
          {methods.map((m) => (
            <MethodRow
              key={m.id}
              method={m}
              selected={draft.paymentMethodId === m.id}
              onSelect={() => {
                Haptics.selectionAsync();
                setDraft((d) => ({ ...d, paymentMethodId: m.id }));
              }}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerPrice}>{formatInr(payable)}</Text>
          <Text style={styles.footerSub}>Secure payment · Razorpay</Text>
        </View>
        <Pressable style={styles.footerBtn} onPress={() => void pay()} disabled={paying}>
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
          <Text style={styles.footerBtnText}>Subscribe now</Text>
        </Pressable>
      </View>

      <PaymentProcessingModal
        visible={showPayModal}
        step={payStep}
        amount={payable}
        methodLabel={paymentMethodLabel(
          payable === 0 && draft.useWallet ? 'wallet_full' : draft.paymentMode,
          savedMethod,
          walletDeduction,
        )}
      />
      <RazorpayGatewayModal
        visible={showGateway}
        amount={payable}
        receipt={`plus-${planId}`}
        method={gatewayMethod}
        savedMethod={savedMethod}
        onClose={() => setShowGateway(false)}
        onSuccess={(r) => {
          setShowGateway(false);
          void finish(r);
        }}
        onFailure={onGatewayFailure}
      />
      <RazorpayNetBankingEmiModal
        visible={showNetBankingEmi}
        amount={payable}
        receipt={`plus-${planId}`}
        mode={netBankingEmiMode}
        savedCard={savedCard}
        onClose={() => setShowNetBankingEmi(false)}
        onSuccess={(r) => {
          setShowNetBankingEmi(false);
          void finish(r);
        }}
        onFailure={onGatewayFailure}
      />
      <PaymentFailedModal
        visible={showFailed}
        message={failMsg}
        onClose={() => setShowFailed(false)}
        onRetry={() => {
          setShowFailed(false);
          void pay();
        }}
      />
    </View>
  );

  function onGatewayFailure(error: string) {
    setShowGateway(false);
    setFailMsg(error);
    setShowFailed(true);
  }
}

function MethodRow({
  method,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable style={[styles.method, selected && styles.methodOn]} onPress={onSelect}>
      <Ionicons
        name={method.type === 'card' ? 'card-outline' : 'logo-google'}
        size={18}
        color={selected ? colors.primaryDark : colors.muted}
      />
      <View style={styles.methodCopy}>
        <Text style={[styles.methodLabel, selected && styles.methodLabelOn]}>{method.label}</Text>
        <Text style={styles.methodDetail}>{method.detail}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  scroll: { padding: layout.pad, gap: spacing.lg },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  summaryPlan: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  summaryMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryKey: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  summaryVal: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  discount: { color: colors.success },
  totalRow: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider },
  totalKey: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  totalVal: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.primaryDark },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  walletCopy: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  walletTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  walletSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  modes: { flexDirection: 'row', gap: spacing.sm },
  mode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  modeOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  modeText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  modeTextOn: { color: colors.primaryDark, fontFamily: fonts.bold },
  methods: { gap: spacing.sm },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  methodOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  methodCopy: { flex: 1, gap: 2 },
  methodLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },
  methodLabelOn: { color: colors.primaryDark, fontFamily: fonts.bold },
  methodDetail: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerCopy: { flex: 1, gap: 2 },
  footerPrice: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    minWidth: 150,
  },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
