import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
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

import type { PaymentMethod } from '@/features/profile/types/profile.types';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { PAYMENT_GATEWAY, type UpiAppDef } from '../constants/gateway';
import { useInstalledUpiApps } from '../hooks/useInstalledUpiApps';
import { chargeRazorpayGateway, createGatewayOrder } from '../lib/razorpay.gateway';
import { openUpiApp, openUpiAppChooser } from '../lib/upi.apps';
import type { GatewayMethod, GatewayPaymentResult } from '../types/payment.types';
import { InstalledUpiAppsPicker } from './InstalledUpiAppsPicker';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface RazorpayGatewayModalProps {
  visible: boolean;
  amount: number;
  receipt: string;
  method: 'upi' | 'card';
  savedMethod?: PaymentMethod;
  onClose: () => void;
  onSuccess: (result: GatewayPaymentResult) => void;
  onFailure: (error: string) => void;
}

export function RazorpayGatewayModal({
  visible,
  amount,
  receipt,
  method,
  savedMethod,
  onClose,
  onSuccess,
  onFailure,
}: RazorpayGatewayModalProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<GatewayMethod>(method);
  const [upiApp, setUpiApp] = useState<UpiAppDef | null>(null);
  const [vpa, setVpa] = useState(savedMethod?.type === 'upi' ? savedMethod.detail : '');
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [timer, setTimer] = useState(300);
  const { apps: installedApps } = useInstalledUpiApps(visible && tab === 'upi');

  useEffect(() => {
    if (!visible) return;
    setTab(method);
    setTimer(300);
    setCvv('');
    setPaying(false);
    setUpiApp(null);
  }, [visible, method]);

  useEffect(() => {
    if (!visible || upiApp || !installedApps.length) return;
    setUpiApp(installedApps[0]);
  }, [visible, installedApps, upiApp]);

  useEffect(() => {
    if (!visible || paying) return;
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [visible, paying]);

  const openChooser = async () => {
    const opened = await openUpiAppChooser({ amount, receipt, vpa: vpa || undefined });
    if (!opened) {
      onFailure('Could not open UPI apps. Check PhonePe / Google Pay are installed.');
    }
  };

  const pay = async () => {
    setPaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const order = createGatewayOrder(amount, receipt);
    const label =
      tab === 'card'
        ? savedMethod?.label ?? 'Debit / Credit card'
        : upiApp?.label ?? (vpa.includes('@') ? vpa : 'UPI');

    if (tab === 'upi' && (upiApp || vpa.includes('@'))) {
      const opened = upiApp
        ? await openUpiApp({ amount, receipt, vpa: vpa || undefined }, upiApp)
        : await openUpiAppChooser({ amount, receipt, vpa: vpa || undefined });
      if (!opened && !vpa.includes('@')) {
        setPaying(false);
        onFailure('Select a UPI app installed on your phone, or enter your UPI ID.');
        return;
      }
    }

    const result = await chargeRazorpayGateway({
      order,
      method: tab,
      methodLabel: label,
      upiAppId: upiApp?.id,
      vpa,
      cardLast4: savedMethod?.detail?.replace(/\D/g, '').slice(-4),
      cvv,
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
        <LinearGradient colors={['#3395FF', '#2563EB']} style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.close} onPress={onClose} accessibilityLabel="Close payment">
              <Ionicons name="close" size={22} color={colors.white} />
            </Pressable>
            <View style={styles.brand}>
              <Text style={styles.brandName}>{PAYMENT_GATEWAY.name}</Text>
              <Text style={styles.brandSub}>Secured by Razorpay</Text>
            </View>
            <View style={styles.timer}>
              <Text style={styles.timerText}>{mins}:{secs.toString().padStart(2, '0')}</Text>
            </View>
          </View>
          <Text style={styles.merchant}>{PAYMENT_GATEWAY.merchant}</Text>
          <Text style={styles.amount}>{formatInr(amount)}</Text>
        </LinearGradient>

        <View style={styles.tabs}>
          {(['upi', 'card'] as const).map((t) => (
            <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t === 'upi' ? 'UPI' : 'Card'}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
          {tab === 'upi' ? (
            <>
              <InstalledUpiAppsPicker
                selectedId={upiApp?.id}
                onSelect={setUpiApp}
                onOpenChooser={openChooser}
              />

              <Text style={styles.or}>OR enter UPI ID</Text>
              <TextInput
                style={styles.input}
                value={vpa}
                onChangeText={setVpa}
                placeholder="name@upi"
                autoCapitalize="none"
                placeholderTextColor={colors.placeholder}
              />
            </>
          ) : (
            <>
              <View style={styles.cardPreview}>
                <LinearGradient colors={['#0F1419', '#084F4A']} style={StyleSheet.absoluteFill} />
                <Text style={styles.cardType}>DEBIT / CREDIT</Text>
                <Text style={styles.cardName}>{savedMethod?.label ?? 'HDFC Debit'}</Text>
                <Text style={styles.cardMask}>{savedMethod?.detail ?? '•••• •••• •••• 4821'}</Text>
              </View>
              <Text style={styles.section}>Enter CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.hint}>CVV is on the back of your card. Never share it.</Text>
            </>
          )}

          <View style={styles.trust}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={styles.trustText}>PCI-DSS · 256-bit SSL · Razorpay {PAYMENT_GATEWAY.keyId}</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable style={[styles.payBtn, paying && styles.payBtnOff]} onPress={pay} disabled={paying}>
            <LinearGradient colors={['#2563EB', '#1D4ED8']} style={StyleSheet.absoluteFill} />
            {paying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color={colors.white} />
                <Text style={styles.payText}>Pay {formatInr(amount)} securely</Text>
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
  tabs: { flexDirection: 'row', backgroundColor: colors.white, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, gap: 2 },
  tabOn: { borderBottomWidth: 2, borderBottomColor: '#2563EB' },
  tabOff: { opacity: 0.45 },
  tabText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  tabTextOn: { fontFamily: fonts.bold, color: '#2563EB' },
  tabTextOff: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  soon: { fontFamily: fonts.bold, fontSize: 8, color: colors.muted },
  body: { padding: layout.pad, gap: spacing.md },
  section: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  appGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  appTile: {
    width: '47%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
    gap: spacing.xs,
  },
  appTileOn: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  appIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  appLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  appLabelOn: { color: '#1D4ED8', fontFamily: fonts.bold },
  or: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, textAlign: 'center' },
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
  cardPreview: { borderRadius: radius.xxl, padding: spacing.lg, overflow: 'hidden', gap: 4, minHeight: 120 },
  cardType: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  cardName: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, marginTop: spacing.sm },
  cardMask: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  hint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  trust: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, justifyContent: 'center', marginTop: spacing.sm },
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
