import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormScreenSkeleton } from '@/components/ui/Skeleton';
import { getNotificationById, markNotificationRead } from '@/features/notifications/lib/notifications.storage';
import {
  formatNotificationDate,
  formatNotificationTime,
  getActionLabel,
  hasAction,
  kindMeta,
  notificationActionHref,
} from '@/features/notifications/lib/notifications.utils';
import type { AppNotification } from '@/features/notifications/types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';
const FOOTER_ACTION_H = 52;

function kindTips(kind: AppNotification['kind']) {
  const map = {
    job: [
      'Open the job to accept, navigate, or complete the visit',
      'Respond within 15 minutes to keep dispatch priority',
      'Customer details and OTP flow live inside job detail',
    ],
    payout: [
      'Payouts batch every Monday evening to your UPI',
      'Check earnings tab for credits and payout history',
      'Chat support if a transfer is delayed beyond 48h',
    ],
    kyc: [
      'Complete KYC from Profile to unlock full payouts',
      'Aadhaar verification usually takes 24–48 hours',
      'You can still accept demo jobs while KYC is pending',
    ],
    system: [
      'System updates cover zones, slots, and app features',
      'Keep notifications on for instant dispatch alerts',
      'Mark all read from the inbox header anytime',
    ],
  };
  return map[kind];
}

export function PartnerNotificationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const notification = await getNotificationById(id);
      if (!active) return;

      if (notification && !notification.read) {
        await markNotificationRead(notification.id);
        setItem({ ...notification, read: true });
      } else {
        setItem(notification);
      }
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [id]);

  const footerPad = useMemo(() => insets.bottom + spacing.sm, [insets.bottom]);

  if (loading) {
    return <FormScreenSkeleton />;
  }

  if (!item) {
    return (
      <View style={styles.loader}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.muted} />
        <Text style={styles.missingTitle}>Notification not found</Text>
        <Pressable style={styles.missingBtn} onPress={() => router.back()}>
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const meta = kindMeta(item.kind);
  const actionable = hasAction(item);
  const ctaLabel = getActionLabel(item);
  const tips = kindTips(item.kind);

  const onAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (actionable) {
      router.push(notificationActionHref(item) as Href);
      return;
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={[styles.tabIcon, { backgroundColor: `${meta.accent}22` }]}>
            <Ionicons name={meta.icon} size={17} color={meta.accent} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>ALERT DETAIL</Text>
            <Text style={styles.headerTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: meta.accent }]}>{meta.label}</Text>
            <Text style={styles.statLabel}>Type</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{formatNotificationTime(item.createdAt)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{item.read ? 'Read' : 'New'}</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <LinearGradient
          colors={['rgba(230,244,242,0.95)', SHEET_BG]}
          style={styles.sheetTopFade}
          pointerEvents="none"
        />
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: footerPad + FOOTER_ACTION_H + spacing.lg }]}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={styles.heroCard}>
              <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.heroBand}>
                <View style={styles.heroBandGlow} />
                <View style={[styles.kindPill, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Ionicons name={meta.icon} size={11} color={colors.white} />
                  <Text style={styles.kindPillText}>{meta.label} alert</Text>
                </View>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroSub}>{item.body}</Text>
              </LinearGradient>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Ionicons name="calendar-outline" size={12} color={colors.primaryDark} />
                  <Text style={styles.metaText}>{formatNotificationDate(item.createdAt)}</Text>
                </View>
                {item.jobId ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="briefcase-outline" size={12} color={colors.primaryDark} />
                    <Text style={styles.metaText}>Linked job</Text>
                  </View>
                ) : null}
                {item.payoutId ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="wallet-outline" size={12} color={colors.primaryDark} />
                    <Text style={styles.metaText}>Payout {item.payoutId}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(320)}>
            <View style={styles.detailCard}>
              <Text style={styles.detailEyebrow}>FULL MESSAGE</Text>
              <Text style={styles.detailBody}>{item.detail ?? item.body}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(320)}>
            <View style={styles.tipsCard}>
              <View style={styles.tipsHead}>
                <Ionicons name="bulb-outline" size={15} color={colors.partnerGold} />
                <Text style={styles.tipsTitle}>What to do next</Text>
              </View>
              {tips.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerPad }]}>
          <Pressable style={styles.primaryBtn} onPress={onAction}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
            <Ionicons
              name={
                item.jobId
                  ? 'briefcase-outline'
                  : item.payoutId || item.kind === 'payout'
                    ? 'wallet-outline'
                    : item.kind === 'kyc'
                      ? 'shield-outline'
                      : 'arrow-forward'
              }
              size={17}
              color={colors.white}
            />
            <Text style={styles.primaryText}>{ctaLabel}</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryText}>Back to inbox</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: SHEET_BG,
  },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 2, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: -0.3,
    lineHeight: 21,
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1, minWidth: 0 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(11,110,103,0.18)',
    overflow: 'hidden',
  },
  sheetTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    zIndex: 0,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  scroll: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  heroBand: {
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  heroBandGlow: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.15)',
  },
  kindPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  kindPillText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  heroSub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  metaText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  detailEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
  },
  detailBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.inkSecondary,
    lineHeight: 21,
  },
  tipsCard: {
    backgroundColor: colors.partnerGoldBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.12)',
  },
  tipsHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  tipsTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: 4,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 12,
    overflow: 'hidden',
    minHeight: FOOTER_ACTION_H,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondaryBtn: { alignItems: 'center', paddingVertical: 6 },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
  missingTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  missingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  missingBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
