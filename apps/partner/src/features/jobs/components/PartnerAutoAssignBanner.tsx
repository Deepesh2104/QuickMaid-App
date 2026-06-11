import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerAutoAssignBannerProps {
  job: PartnerJob;
  minimized?: boolean;
  onMinimize?: () => void;
  onExpand?: () => void;
  onDismiss: () => void;
}

export function PartnerAutoAssignBanner({
  job,
  minimized = false,
  onMinimize,
  onExpand,
  onDismiss,
}: PartnerAutoAssignBannerProps) {
  const router = useRouter();
  const { t } = usePartnerI18n();

  const openJobForStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/job/${job.id}` as Href);
  };

  if (minimized) {
    return (
      <Animated.View entering={FadeInUp.duration(220)} style={styles.minWrap}>
        <Pressable
          style={styles.minBar}
          onPress={() => {
            Haptics.selectionAsync();
            onExpand?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Expand auto-accept banner"
        >
          <View style={styles.minIcon}>
            <Ionicons name="flash" size={14} color={colors.partnerGold} />
          </View>
          <View style={styles.minCopy}>
            <Text style={styles.minTitle} numberOfLines={1}>
              Schedule confirmed · {job.service}
            </Text>
            <Text style={styles.minSub} numberOfLines={1}>
              {job.visitDate} · {job.slotLabel} · {formatRs(netEarningPaise(job.amountPaise))}
            </Text>
          </View>
          <Ionicons name="chevron-up" size={16} color={colors.muted} />
        </Pressable>
        <Pressable
          style={styles.minDismiss}
          onPress={() => {
            Haptics.selectionAsync();
            onDismiss();
          }}
          hitSlop={8}
          accessibilityLabel="Dismiss"
        >
          <Ionicons name="close" size={16} color={colors.muted} />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(320)} style={styles.wrap}>
      <LinearGradient colors={['#FFFBEB', '#FFFFFF', '#E6F4F2']} style={styles.card}>
        <View style={styles.goldBar} />
        <View style={styles.row}>
          <View style={styles.icon}>
            <Ionicons name="flash" size={18} color={colors.partnerGold} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>{t('scheduleConfirmed')}</Text>
            <Text style={styles.title} numberOfLines={1}>
              {job.service}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {job.bookingRef} · {job.visitDate} · {job.slotLabel}
            </Text>
            <Text style={styles.earn}>{formatRs(netEarningPaise(job.amountPaise))} net</Text>
            <View style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={13} color={colors.primary} />
              <Text style={styles.hint}>{t('autoAssignHint')}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onMinimize?.();
            }}
            hitSlop={10}
            accessibilityLabel="Minimize"
          >
            <Ionicons name="remove" size={20} color={colors.muted} />
          </Pressable>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.btnSecondary}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/schedule' as Href);
            }}
          >
            <Text style={styles.btnSecondaryText}>Schedule</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary} onPress={openJobForStart}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
            <Ionicons name="play-circle-outline" size={16} color={colors.white} />
            <Text style={styles.btnPrimaryText}>Start visit</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.sm },
  minWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  minBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.22)',
    ...shadow.sm,
  },
  minIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.partnerGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minCopy: { flex: 1, minWidth: 0, gap: 1 },
  minTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  minSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  minDismiss: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.2)',
    overflow: 'hidden',
    ...shadow.md,
  },
  goldBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.partnerGold,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.partnerGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.partnerGold,
    letterSpacing: 0.8,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  earn: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark, marginTop: 2 },
  hintRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: spacing.xs },
  hint: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  hintBold: { fontFamily: fonts.bold, color: colors.primaryDark },
  actions: { flexDirection: 'row', gap: spacing.sm },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  btnPrimary: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  btnPrimaryText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
});
