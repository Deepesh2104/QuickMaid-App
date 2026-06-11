import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { usePartner } from '@/context/PartnerContext';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import {
  RATING_BADGES,
  RATING_BREAKDOWN,
  RATING_OVERVIEW,
  RATING_RECENT_REVIEWS,
} from '@/features/profile/constants/rating.premium';
import {
  completedJobsForRating,
  ratingPerformanceStats,
} from '@/features/profile/lib/rating.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= count ? 'star' : 'star-outline'}
          size={size}
          color={colors.partnerGold}
        />
      ))}
    </View>
  );
}

function ReviewAvatar({ name }: { name: string }) {
  const letter = name.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase() || '?';
  return (
    <LinearGradient colors={['#FFFBEB', '#FEF3C7']} style={styles.reviewAvatar}>
      <Text style={styles.reviewAvatarText}>{letter}</Text>
    </LinearGradient>
  );
}

export function PartnerRatingScreen() {
  const router = useRouter();
  const { profile, state } = usePartner();
  const { completed } = usePartnerJobs();

  const perf = useMemo(
    () => ratingPerformanceStats(completed.length, state.weekJobs),
    [completed.length, state.weekJobs],
  );
  const completedList = useMemo(() => completedJobsForRating(completed), [completed]);

  const headerExtra = (
    <View style={styles.scoreHero}>
      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']} style={styles.scoreGlow} />
      <Text style={styles.scoreValue}>{perf.score.toFixed(1)}</Text>
      <Stars count={5} size={18} />
      <Text style={styles.scoreMeta}>
        {RATING_OVERVIEW.totalReviews} reviews · {perf.completedVisits} visits completed
      </Text>
      <View style={styles.trendPill}>
        <Ionicons name="trending-up" size={12} color={colors.partnerGold} />
        <Text style={styles.trendText}>{perf.trendLabel}</Text>
      </View>
    </View>
  );

  const stats = [
    { value: `${RATING_OVERVIEW.onTimeRate}%`, label: 'On-time' },
    { value: `${RATING_OVERVIEW.repeatCustomers}%`, label: 'Repeat' },
    { value: `${RATING_OVERVIEW.fiveStarPercent}%`, label: '5-star' },
  ];

  return (
    <PartnerStackShell
      eyebrow="PERFORMANCE"
      title="Partner rating"
      subtitle={`${profile?.name ?? 'Partner'} · customer trust score`}
      icon="star"
      stats={stats}
      headerExtra={headerExtra}
    >
      <Animated.View entering={FadeInDown.duration(260)} style={styles.statGrid}>
        {[
          { label: 'On-time', value: `${RATING_OVERVIEW.onTimeRate}%`, icon: 'time-outline' as const, grad: ['#E6F4F2', '#FFF'] },
          { label: 'Repeat customers', value: `${RATING_OVERVIEW.repeatCustomers}%`, icon: 'heart-outline' as const, grad: ['#FEF3F2', '#FFF'] },
          { label: 'Your visits', value: String(perf.completedVisits), icon: 'checkmark-done-outline' as const, grad: ['#FFFBEB', '#FFF'] },
        ].map((s) => (
          <LinearGradient key={s.label} colors={s.grad as [string, string]} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name={s.icon} size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </LinearGradient>
        ))}
      </Animated.View>

      {completedList.length > 0 ? (
        <Animated.View entering={FadeInDown.delay(30).duration(280)} style={styles.block}>
          <PartnerRequestsSectionHeader
            eyebrow="Live"
            title="Rated visits"
            subtitle="Completed jobs in your account"
            icon="briefcase-outline"
            compact
          />
          <View style={styles.visitCard}>
            {completedList.slice(0, 4).map((job, i) => (
              <View key={job.id} style={[styles.visitRow, i < Math.min(4, completedList.length) - 1 && styles.visitBorder]}>
                <Ionicons name="star" size={12} color={colors.partnerGold} />
                <View style={styles.visitCopy}>
                  <Text style={styles.visitTitle} numberOfLines={1}>
                    {job.customerName} · {job.service}
                  </Text>
                  <Text style={styles.visitSub}>{job.bookingRef} · {job.visitDate}</Text>
                </View>
                <Text style={styles.visitStar}>5★</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(50).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Breakdown"
          title="Star distribution"
          icon="bar-chart-outline"
          compact
        />
        <View style={styles.card}>
          {RATING_BREAKDOWN.map((row) => (
            <View key={row.stars} style={styles.barRow}>
              <Text style={styles.barStars}>{row.stars}★</Text>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={['#F59E0B', '#FBBF24']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.barFill, { width: `${row.percent}%` }]}
                />
              </View>
              <Text style={styles.barPct}>{row.percent}%</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(90).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="Achievements" title="Your badges" icon="ribbon-outline" compact />
        <View style={styles.badgeGrid}>
          {RATING_BADGES.map((badge) => (
            <LinearGradient
              key={badge.label}
              colors={['#FFFBEB', '#FFFFFF']}
              style={styles.badgeCard}
            >
              <View style={styles.badgeIcon}>
                <Ionicons name={badge.icon} size={16} color={colors.partnerGold} />
              </View>
              <Text style={styles.badgeLabel}>{badge.label}</Text>
              <Text style={styles.badgeSub}>{badge.sub}</Text>
            </LinearGradient>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(130).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="Feedback" title="Recent reviews" icon="chatbox-outline" compact />
        <View style={styles.card}>
          {RATING_RECENT_REVIEWS.map((review, i) => (
            <View key={review.id} style={[styles.reviewRow, i < RATING_RECENT_REVIEWS.length - 1 && styles.reviewBorder]}>
              <View style={styles.reviewHead}>
                <View style={styles.reviewHeadLeft}>
                  <ReviewAvatar name={review.customer} />
                  <View>
                    <Text style={styles.reviewCustomer}>{review.customer}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <Stars count={review.stars} size={11} />
              </View>
              <View style={styles.servicePill}>
                <Text style={styles.reviewService}>{review.service}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Pressable style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backLinkText}>Profile par wapas</Text>
      </Pressable>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  scoreHero: { alignItems: 'center', gap: 6, marginTop: spacing.xs, overflow: 'hidden' },
  scoreGlow: {
    position: 'absolute',
    top: -20,
    width: 160,
    height: 80,
    borderRadius: 40,
  },
  scoreValue: { fontFamily: fonts.extraBold, fontSize: 44, color: colors.partnerGold, letterSpacing: -1 },
  scoreMeta: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  trendText: { fontFamily: fonts.bold, fontSize: 10, color: colors.partnerGold },
  starsRow: { flexDirection: 'row', gap: 2 },
  statGrid: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },
  statLabel: { fontFamily: fonts.regular, fontSize: 9, color: colors.muted, textAlign: 'center' },
  block: { gap: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  visitCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.2)',
  },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  visitBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  visitCopy: { flex: 1, minWidth: 0 },
  visitTitle: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  visitSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  visitStar: { fontFamily: fonts.bold, fontSize: 11, color: colors.partnerGold },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barStars: { width: 28, fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F2F4F7',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  barPct: { width: 32, fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted, textAlign: 'right' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badgeCard: {
    width: '48%',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  badgeSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
  reviewRow: { gap: spacing.sm, paddingVertical: spacing.sm },
  reviewBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  reviewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  reviewAvatarText: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.partnerGold },
  reviewCustomer: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  reviewDate: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  servicePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  reviewService: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  reviewText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 18 },
  backLink: { alignItems: 'center', paddingVertical: spacing.sm },
  backLinkText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
});
