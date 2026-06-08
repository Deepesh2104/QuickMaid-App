import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { PaymentMode } from '@/features/checkout/types/checkout.types';
import type { PaymentMethod } from '@/features/profile/types/profile.types';
import {
  computeEmiInstallment,
  EMI_TENURES,
  NETBANKING_BANKS_LIST,
  PAYMENT_GATEWAY,
} from '../constants/gateway';
import { chargeRazorpayGateway, createGatewayOrder } from '../lib/razorpay.gateway';
import type { GatewayPaymentResult } from '../types/payment.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface RazorpayNetBankingEmiModalProps {
  visible: boolean;
  amount: number;
  receipt: string;
  mode: Extract<PaymentMode, 'netbanking' | 'emi'>;
  savedCard?: PaymentMethod;
  onClose: () => void;
  onSuccess: (result: GatewayPaymentResult) => void;
  onFailure: (error: string) => void;
}

export function RazorpayNetBankingEmiModal({
  visible,
  amount,
  receipt,
  mode,
  savedCard,
  onClose,
  onSuccess,
  onFailure,
}: RazorpayNetBankingEmiModalProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'netbanking' | 'emi'>(mode);
  const [bankId, setBankId] = useState<string | null>(NETBANKING_BANKS_LIST[0]?.id ?? null);
  const [tenureMonths, setTenureMonths] = useState(EMI_TENURES[1]?.months ?? 6);
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (!visible) return;
    setTab(mode);
    setTimer(300);
    setCvv('');
    setPaying(false);
    setBankId(NETBANKING_BANKS_LIST[0]?.id ?? null);
    setTenureMonths(EMI_TENURES[1]?.months ?? 6);
  }, [visible, mode]);

  useEffect(() => {
    if (!visible || paying) return;
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [visible, paying]);

  const selectedBank = NETBANKING_BANKS_LIST.find((b) => b.id === bankId);
  const selectedTenure = EMI_TENURES.find((t) => t.months === tenureMonths) ?? EMI_TENURES[0];
  const emiPerMonth = useMemo(
    () => computeEmiInstallment(amount, selectedTenure.months, selectedTenure.interestApr),
    [amount, selectedTenure],
  );

  const pay = async () => {
    setPaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const order = createGatewayOrder(amount, receipt);

    const label =
      tab === 'netbanking'
        ? `Net Banking · ${selectedBank?.name ?? 'Bank'}`
        : `EMI · ${selectedTenure.label} · ${formatInr(emiPerMonth)}/mo`;

    const result = await chargeRazorpayGateway({
      order,
      method: tab,
      methodLabel: label,
      bankId: tab === 'netbanking' ? bankId ?? undefined : undefined,
      emiMonths: tab === 'emi' ? tenureMonths : undefined,
      cardLast4: savedCard?.detail?.replace(/\D/g, '').slice(-4),
      cvv: tab === 'emi' ? cvv : undefined,
    });

    setPaying(false);
    if (result.success) {
      onSuccess(result);
    } else {
      onFailure(result.error ?? 'Payment could not be completed');
    }
  };

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.close} onPress={onClose} accessibilityLabel="Close payment">
              <Ionicons name="close" size={22} color={colors.white} />
            </Pressable>
            <View style={styles.brand}>
              <Text style={styles.brandName}>{PAYMENT_GATEWAY.name}</Text>
              <Text style={styles.brandSub}>Net Banking & EMI</Text>
            </View>
            <View style={styles.timer}>
              <Text style={styles.timerText}>
                {mins}:{secs.toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
          <Text style={styles.merchant}>{PAYMENT_GATEWAY.merchant}</Text>
          <Text style={styles.amount}>{formatInr(amount)}</Text>
        </LinearGradient>

        <View style={styles.tabs}>
          {(['netbanking', 'emi'] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabOn]}
              onPress={() => {
                Haptics.selectionAsync();
                setTab(t);
              }}
            >
              <Ionicons
                name={t === 'netbanking' ? 'business-outline' : 'calendar-outline'}
                size={14}
                color={tab === t ? colors.primaryDark : colors.muted}
              />
              <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>
                {t === 'netbanking' ? 'Net Banking' : 'Card EMI'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {tab === 'netbanking' ? (
            <>
              <Text style={styles.section}>Select your bank</Text>
              <Text style={styles.hint}>You'll be redirected to your bank's secure login page via Razorpay.</Text>
              <View style={styles.bankGrid}>
                {NETBANKING_BANKS_LIST.map((bank) => {
                  const on = bankId === bank.id;
                  return (
                    <Pressable
                      key={bank.id}
                      style={[styles.bankTile, on && styles.bankTileOn]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setBankId(bank.id);
                      }}
                    >
                      <View style={[styles.bankIcon, { backgroundColor: bank.color }]}>
                        <Text style={styles.bankShort}>{bank.short.slice(0, 3)}</Text>
                      </View>
                      <Text style={[styles.bankName, on && styles.bankNameOn]} numberOfLines={2}>
                        {bank.name}
                      </Text>
                      {on ? <Ionicons name="checkmark-circle" size={16} color={colors.primary} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <View style={styles.cardPreview}>
                <LinearGradient colors={['#0F1419', '#084F4A']} style={StyleSheet.absoluteFill} />
                <Text style={styles.cardType}>CREDIT CARD EMI</Text>
                <Text style={styles.cardName}>{savedCard?.label ?? 'HDFC Credit'}</Text>
                <Text style={styles.cardMask}>{savedCard?.detail ?? '•••• •••• •••• 4821'}</Text>
              </View>

              <Text style={styles.section}>Choose EMI tenure</Text>
              <View style={styles.tenureList}>
                {EMI_TENURES.map((t) => {
                  const on = tenureMonths === t.months;
                  const installment = computeEmiInstallment(amount, t.months, t.interestApr);
                  return (
                    <Pressable
                      key={t.months}
                      style={[styles.tenureRow, on && styles.tenureRowOn]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setTenureMonths(t.months);
                      }}
                    >
                      <View style={styles.tenureCopy}>
                        <View style={styles.tenureHead}>
                          <Text style={[styles.tenureLabel, on && styles.tenureLabelOn]}>{t.label}</Text>
                          {t.badge ? (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{t.badge}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.tenureSub}>
                          {t.interestApr === 0
                            ? 'No extra cost EMI'
                            : `${t.interestApr}% p.a. · Total ${formatInr(installment * t.months)}`}
                        </Text>
                      </View>
                      <Text style={[styles.tenureEmi, on && styles.tenureEmiOn]}>{formatInr(installment)}/mo</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.section}>Enter CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.hint}>EMI is processed on your saved credit card via Razorpay.</Text>
            </>
          )}

          <View style={styles.trust}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={styles.trustText}>Bank-grade security · Razorpay {PAYMENT_GATEWAY.keyId}</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable style={[styles.payBtn, paying && styles.payBtnOff]} onPress={pay} disabled={paying}>
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            {paying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color={colors.white} />
                <Text style={styles.payText}>
                  {tab === 'netbanking'
                    ? `Pay via ${selectedBank?.short ?? 'Bank'}`
                    : `Pay ${formatInr(emiPerMonth)}/mo EMI`}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { padding: layout.pad, gap: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { flex: 1, alignItems: 'center' },
  brandName: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white },
  brandSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  timer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
  merchant: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  amount: { fontFamily: fonts.extraBold, fontSize: 32, color: colors.white, letterSpacing: -1 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
  },
  tabOn: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  tabTextOn: { fontFamily: fonts.bold, color: colors.primaryDark },
  body: { padding: layout.pad, gap: spacing.md },
  section: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  hint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bankTile: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  bankTileOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  bankIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankShort: { fontFamily: fonts.extraBold, fontSize: 10, color: colors.white },
  bankName: { flex: 1, fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },
  bankNameOn: { color: colors.primaryDark, fontFamily: fonts.bold },
  cardPreview: { borderRadius: radius.xxl, padding: spacing.lg, overflow: 'hidden', gap: 4, minHeight: 120 },
  cardType: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  cardName: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, marginTop: spacing.sm },
  cardMask: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  tenureList: { gap: spacing.sm },
  tenureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  tenureRowOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  tenureCopy: { flex: 1, gap: 2 },
  tenureHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tenureLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  tenureLabelOn: { color: colors.primaryDark },
  badge: {
    backgroundColor: '#FFFAEB',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 9, color: '#B54708' },
  tenureSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  tenureEmi: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  tenureEmiOn: { color: colors.primaryDark, fontFamily: fonts.extraBold },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  trustText: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  payBtnOff: { opacity: 0.7 },
  payText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
});
