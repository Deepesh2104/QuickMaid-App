import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { PaymentRecord } from '@/features/payment/types/payment.types';
import { listPlusBillingRecords } from '../lib/plus.billing';
import { getProfileAccount } from '@/features/profile/lib/profile.storage';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import {
  cancelPlusMembership,
  pausePlusMembership,
  resumePlusMembership,
} from '../lib/plus.membership';
import { getPlusSubscription } from '../lib/plus.subscribe';
import type { PlusSubscriptionRecord } from '../types/plus.subscription.types';

const PERKS = [
  { icon: 'flash' as const, label: 'Priority slots', tint: '#6EE7B7' },
  { icon: 'people' as const, label: 'Same pro', tint: '#93C5FD' },
  { icon: 'pricetag' as const, label: '20% off', tint: '#FCD34D' },
  { icon: 'refresh' as const, label: 'Free reschedule', tint: '#F9A8D4' },
];

export function PlusManageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [subscription, setSubscription] = useState<PlusSubscriptionRecord | null>(null);
  const [billing, setBilling] = useState<PaymentRecord[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [acc, sub, payments] = await Promise.all([
      getProfileAccount(),
      getPlusSubscription(),
      listPlusBillingRecords(),
    ]);
    setAccount(acc);
    setSubscription(sub);
    setBilling(payments);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visitsTotal = 12;
  const visitsLeft = account?.plusVisitsLeft ?? 0;
  const visitProgress = visitsTotal > 0 ? visitsLeft / visitsTotal : 0;
  const isPaused = Boolean(account?.plusPaused);
  const isMember = Boolean(account?.isPlusMember);

  const statusLabel = useMemo(() => {
    if (!isMember) return 'Inactive';
    if (isPaused) return 'Paused';
    return 'Active';
  }, [isMember, isPaused]);

  const onPause = () => {
    Alert.alert(
      'Pause membership?',
      'Your visits stay safe for 30 days. Billing pauses until you resume.',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Pause plan',
          onPress: async () => {
            setBusy(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const next = await pausePlusMembership();
            setAccount(next);
            setBusy(false);
          },
        },
      ],
    );
  };

  const onResume = async () => {
    setBusy(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next = await resumePlusMembership();
    setAccount(next);
    setBusy(false);
  };

  const onCancel = () => {
    Alert.alert(
      'Cancel QuickMaid Plus?',
      'You will lose member pricing and priority slots after your current billing cycle.',
      [
        { text: 'Keep Plus', style: 'cancel' },
        {
          text: 'Cancel plan',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            await cancelPlusMembership();
            setBusy(false);
            router.replace('/(tabs)/plans');
          },
        },
      ],
    );
  };

  if (loading || !account) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isMember) {
    return (
      <View style={[styles.emptyRoot, { paddingTop: insets.top + spacing.xl }]}>
        <Pressable style={styles.backFab} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.emptyIcon}>
          <Ionicons name="diamond-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No active membership</Text>
        <Text style={styles.emptySub}>Subscribe to QuickMaid Plus for savings, same pro & priority slots.</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.replace('/plus/subscribe')}>
          <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.emptyBtnGrad}>
            <Text style={styles.emptyBtnText}>Explore Plus plans</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <LinearGradient
          colors={['#010F0E', '#0F1419', '#1A2332', '#2D1B4E']}
          locations={[0, 0.35, 0.7, 1]}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        >
          <View style={styles.heroGlowA} />
          <View style={styles.heroGlowB} />

          <View style={styles.heroBar}>
            <Pressable style={styles.heroBtn} onPress={() => router.back()} accessibilityRole="button">
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
            <Text style={styles.heroBarTitle}>Manage membership</Text>
            <Pressable
              style={styles.heroBtn}
              onPress={() => {
                Haptics.selectionAsync();
                void load();
              }}
              accessibilityRole="button"
            >
              <Ionicons name="refresh-outline" size={20} color={colors.white} />
            </Pressable>
          </View>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroTop}>
              <View style={styles.diamondWrap}>
                <Ionicons name="diamond" size={28} color="#FCD34D" />
              </View>
              <View style={[styles.statusPill, isPaused && styles.statusPillPaused]}>
                <View style={[styles.statusDot, isPaused && styles.statusDotPaused]} />
                <Text style={[styles.statusText, isPaused && styles.statusTextPaused]}>{statusLabel}</Text>
              </View>
            </View>

            <Text style={styles.planName}>{subscription?.planName ?? 'QuickMaid Plus'}</Text>
            <Text style={styles.planSub}>
              {isPaused
                ? `Paused until ${account.plusPausedUntil ?? 'you resume'}`
                : `Renews ${account.plusRenewDate} · ₹499/mo`}
            </Text>

            <View style={styles.visitBlock}>
              <View style={styles.visitHead}>
                <Text style={styles.visitLabel}>Visits remaining</Text>
                <Text style={styles.visitCount}>
                  {visitsLeft} <Text style={styles.visitOf}>of {visitsTotal}</Text>
                </Text>
              </View>
              <View style={styles.visitTrack}>
                <View style={[styles.visitFill, { width: `${visitProgress * 100}%` }]} />
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.canvas}>
          <View style={styles.sheetHandle} />

          <Animated.View entering={FadeInDown.delay(80).duration(380)} style={styles.perkRow}>
            {PERKS.map((p) => (
              <View key={p.label} style={styles.perk}>
                <View style={[styles.perkIcon, { backgroundColor: `${p.tint}22` }]}>
                  <Ionicons name={p.icon} size={14} color={p.tint} />
                </View>
                <Text style={styles.perkText}>{p.label}</Text>
              </View>
            ))}
          </Animated.View>

          <HomeSectionHeader
            eyebrow="Your plan"
            title="Membership controls"
            subtitle={isPaused ? 'Resume anytime — no penalty' : 'Pause or cancel with clarity'}
            icon="options-outline"
            compact
          />

          <View style={styles.actionList}>
            {isPaused ? (
              <Pressable
                style={styles.actionPrimary}
                onPress={() => void onResume()}
                disabled={busy}
                accessibilityRole="button"
              >
                <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.actionPrimaryGrad}>
                  <Ionicons name="play-circle" size={22} color={colors.white} />
                  <View style={styles.actionCopy}>
                    <Text style={styles.actionPrimaryTitle}>Resume membership</Text>
                    <Text style={styles.actionPrimarySub}>Restore priority slots & member pricing</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable
                style={styles.actionCard}
                onPress={onPause}
                disabled={busy}
                accessibilityRole="button"
              >
                <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="pause-circle" size={20} color="#175CD3" />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>Pause plan</Text>
                  <Text style={styles.actionSub}>Travelling? Pause up to 30 days · visits roll over</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
              </Pressable>
            )}

            <Pressable
              style={styles.actionCard}
              onPress={onCancel}
              disabled={busy}
              accessibilityRole="button"
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3F2' }]}>
                <Ionicons name="close-circle" size={20} color="#D92D20" />
              </View>
              <View style={styles.actionCopy}>
                <Text style={styles.actionTitle}>Cancel membership</Text>
                <Text style={styles.actionSub}>Ends after current cycle · no hidden fees</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
            </Pressable>
          </View>

          <HomeSectionHeader
            eyebrow="Billing"
            title="Payment history"
            subtitle={billing.length ? `${billing.length} membership charge${billing.length === 1 ? '' : 's'}` : 'No charges yet'}
            icon="receipt-outline"
            compact
            actionLabel={billing.length > 0 ? 'View all' : undefined}
            onAction={
              billing.length > 0
                ? () => {
                    Haptics.selectionAsync();
                    router.push('/plus/billing' as Href);
                  }
                : undefined
            }
          />

          <View style={styles.billList}>
            {billing.length === 0 ? (
              <View style={styles.billEmpty}>
                <Ionicons name="card-outline" size={28} color={colors.mutedLight} />
                <Text style={styles.billEmptyText}>Your Plus payments will appear here</Text>
              </View>
            ) : (
              billing.slice(0, 4).map((b, i) => (
                <Pressable
                  key={b.id}
                  style={[styles.billRow, i < Math.min(billing.length, 4) - 1 && styles.billBorder]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/payments/${b.id}` as Href);
                  }}
                  accessibilityRole="button"
                >
                  <View style={styles.billIcon}>
                    <Ionicons name="diamond" size={14} color="#B54708" />
                  </View>
                  <View style={styles.billCopy}>
                    <Text style={styles.billLabel}>{b.methodLabel}</Text>
                    <Text style={styles.billMeta}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.billAmtCol}>
                    <Text style={styles.billAmt}>{formatInr(b.amount)}</Text>
                    <Text style={styles.billStatus}>{b.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
                </Pressable>
              ))
            )}
          </View>

          <View style={styles.trustCard}>
            <LinearGradient colors={['#FFFAEB', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <Ionicons name="shield-checkmark" size={22} color="#B54708" />
            <View style={styles.trustCopy}>
              <Text style={styles.trustTitle}>Member promise</Text>
              <Text style={styles.trustSub}>
                Pause or cancel anytime before renewal. Unused visits roll over for 30 days when paused.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {busy ? (
        <View style={styles.busyOverlay}>
          <ActivityIndicator color={colors.white} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  hero: { paddingBottom: spacing.xl, overflow: 'hidden' },
  heroGlowA: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  heroGlowB: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(110,231,183,0.08)',
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBarTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
    letterSpacing: 0.2,
  },
  heroCard: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diamondWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(252,211,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(110,231,183,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillPaused: { backgroundColor: 'rgba(147,197,253,0.15)' },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  statusDotPaused: { backgroundColor: '#93C5FD' },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#6EE7B7',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusTextPaused: { color: '#93C5FD' },
  planName: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.5,
  },
  planSub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  visitBlock: { marginTop: spacing.sm, gap: spacing.xs },
  visitHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  visitLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  visitCount: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
  },
  visitOf: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  visitTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  visitFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FCD34D',
  },
  canvas: {
    marginTop: -spacing.lg,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  perkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    marginBottom: spacing.section,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perkIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.inkSecondary,
  },
  actionList: {
    marginHorizontal: layout.pad,
    gap: spacing.sm,
    marginBottom: spacing.section,
  },
  actionPrimary: { borderRadius: radius.xl, overflow: 'hidden' },
  actionPrimaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionPrimaryTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  actionPrimarySub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  actionSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  billList: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.section,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  billBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  billIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billCopy: { flex: 1, gap: 2 },
  billLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  billMeta: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
  },
  billAmtCol: { alignItems: 'flex-end', gap: 2 },
  billAmt: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  billStatus: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.success,
    textTransform: 'uppercase',
  },
  billEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  billEmptyText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.12)',
  },
  trustCopy: { flex: 1, gap: 4 },
  trustTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#93370D',
  },
  trustSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  busyOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,20,25,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: layout.pad,
    alignItems: 'center',
  },
  backFab: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  emptyBtn: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
  emptyBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  emptyBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
