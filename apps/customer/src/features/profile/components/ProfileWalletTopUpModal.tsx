import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { ProfilePremiumSaveBtn } from './ProfilePremiumParts';
import { ProfileWalletPass } from './ProfileWalletPass';

const PRESETS = [
  { amount: 100, label: '₹100', sub: 'Starter' },
  { amount: 200, label: '₹200', sub: 'Popular', hot: true },
  { amount: 500, label: '₹500', sub: '+5% bonus', bonus: true },
  { amount: 1000, label: '₹1000', sub: '+5% bonus', bonus: true },
];

const PAY_VIA = [
  { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' as const },
  { id: 'card', label: 'Card', icon: 'card-outline' as const },
];

interface ProfileWalletTopUpModalProps {
  visible: boolean;
  balance: number;
  onClose: () => void;
  onTopUp: (amount: number) => Promise<void>;
}

export function ProfileWalletTopUpModal({ visible, balance, onClose, onTopUp }: ProfileWalletTopUpModalProps) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('200');
  const [payVia, setPayVia] = useState('upi');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setAmount('200');
  }, [visible]);

  const num = parseInt(amount, 10) || 0;
  const bonus = num >= 500 ? Math.round(num * 0.05) : 0;
  const totalCredit = num + bonus;

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const save = async () => {
    if (num <= 0) return;
    setSaving(true);
    await onTopUp(totalCredit);
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        >
          <LinearGradient colors={['#084F4A', '#0B6E67', '#0F1419']} locations={[0, 0.55, 1]} style={styles.hero}>
            <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
              <Pressable style={styles.closeBtn} onPress={close} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={20} color={colors.white} />
              </Pressable>
              <View style={styles.heroBadge}>
                <Ionicons name="flash" size={12} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>Instant credit</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Top up wallet</Text>
            <Text style={styles.heroSub}>Credits land in seconds · Use on your next booking</Text>
            <View style={styles.heroFade} pointerEvents="none" />
          </LinearGradient>

          <View style={styles.body}>
            <ProfileWalletPass balance={balance} afterAmount={num} />

            {bonus > 0 ? (
              <View style={styles.bonusBanner}>
                <LinearGradient colors={['#FEF9C3', '#FDE68A']} style={StyleSheet.absoluteFill} />
                <Ionicons name="gift" size={18} color="#92400E" />
                <View style={styles.bonusCopy}>
                  <Text style={styles.bonusTitle}>+₹{bonus} bonus unlocked!</Text>
                  <Text style={styles.bonusSub}>5% extra on ₹500+ top-ups</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>CHOOSE AMOUNT</Text>
              <View style={styles.presetGrid}>
                {PRESETS.map((p) => {
                  const on = num === p.amount;
                  return (
                    <Pressable
                      key={p.amount}
                      style={[styles.preset, on && styles.presetOn]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setAmount(String(p.amount));
                      }}
                    >
                      {p.hot ? (
                        <View style={styles.hotBadge}>
                          <Text style={styles.hotText}>POPULAR</Text>
                        </View>
                      ) : null}
                      <Text style={[styles.presetLabel, on && styles.presetLabelOn]}>{p.label}</Text>
                      <Text style={[styles.presetSub, on && styles.presetSubOn]}>{p.sub}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.customBox}>
              <Text style={styles.customLabel}>Custom amount</Text>
              <View style={styles.customField}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.customInput}
                  value={amount}
                  onChangeText={(t) => setAmount(t.replace(/\D/g, '').slice(0, 5))}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.placeholder}
                  selectionColor={colors.primary}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>PAY VIA</Text>
              <View style={styles.payRow}>
                {PAY_VIA.map((p) => {
                  const on = payVia === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.payTile, on && styles.payTileOn]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setPayVia(p.id);
                      }}
                    >
                      <View style={[styles.payIcon, on && styles.payIconOn]}>
                        <Ionicons name={p.icon} size={20} color={on ? colors.primaryDark : colors.muted} />
                      </View>
                      <Text style={[styles.payLabel, on && styles.payLabelOn]}>{p.label}</Text>
                      {on ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Top-up amount</Text>
                <Text style={styles.summaryVal}>₹{num || 0}</Text>
              </View>
              {bonus > 0 ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>Bonus (5%)</Text>
                  <Text style={[styles.summaryVal, styles.summaryBonus]}>+₹{bonus}</Text>
                </View>
              ) : null}
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalKey}>Wallet credit</Text>
                <Text style={styles.summaryTotalVal}>₹{totalCredit || 0}</Text>
              </View>
            </View>

            <View style={styles.demoNote}>
              <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
              <Text style={styles.demoText}>Demo mode — balance updates locally until Razorpay is connected.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <ProfilePremiumSaveBtn
            label={bonus > 0 ? `Add ₹${totalCredit} (incl. bonus)` : `Add ₹${num || 0} to wallet`}
            onPress={save}
            loading={saving}
            disabled={num <= 0}
            icon="wallet-outline"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xxl + 8,
    gap: spacing.xs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.3)',
  },
  heroBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#FCD34D',
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.8,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  body: {
    marginTop: -spacing.md,
    paddingHorizontal: layout.pad,
    gap: spacing.lg,
  },
  bonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.4)',
  },
  bonusCopy: { flex: 1, gap: 2 },
  bonusTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: '#92400E',
  },
  bonusSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#B45309',
  },
  section: { gap: spacing.sm },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.2,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preset: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
    gap: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  presetOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FCD34D',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#0F1419',
    letterSpacing: 0.5,
  },
  presetLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  presetLabelOn: { color: colors.primaryDark },
  presetSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  presetSubOn: { color: colors.primaryDark },
  customBox: { gap: spacing.sm },
  customLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  customField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
    gap: spacing.xs,
  },
  rupee: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.primaryDark,
  },
  customInput: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.ink,
    letterSpacing: -1,
    padding: 0,
  },
  payRow: { flexDirection: 'row', gap: spacing.sm },
  payTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  payTileOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  payIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payIconOn: { backgroundColor: 'rgba(11,110,103,0.15)' },
  payLabel: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.muted,
  },
  payLabelOn: { color: colors.primaryDark },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryKey: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
  },
  summaryVal: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  summaryBonus: { color: '#059669' },
  summaryTotal: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  summaryTotalKey: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  summaryTotalVal: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  demoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  demoText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.mutedLight,
    lineHeight: 17,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
});
