import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { usePartner } from '@/context/PartnerContext';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  RATING_BADGES,
  RATING_BREAKDOWN,
  RATING_OVERVIEW,
  RATING_RECENT_REVIEWS,
} from '@/features/profile/constants/rating.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

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

export function PartnerRatingScreen() {
  const router = useRouter();
  const { profile } = usePartner();

  const headerExtra = (
    <View style={styles.scoreHero}>
      <Text style={styles.scoreValue}>{RATING_OVERVIEW.score}</Text>
      <Stars count={5} size={16} />
      <Text style={styles.scoreMeta}>{RATING_OVERVIEW.totalReviews} customer reviews</Text>
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
      subtitle={`${profile?.name ?? 'Partner'} · verified score`}
      icon="star"
      stats={stats}
      headerExtra={headerExtra}
    >
      <Animated.View entering={FadeInDown.duration(260)} style={styles.statGrid}>
        {[
          { label: 'On-time', value: `${RATING_OVERVIEW.onTimeRate}%`, icon: 'time-outline' as const },
          { label: 'Repeat customers', value: `${RATING_OVERVIEW.repeatCustomers}%`, icon: 'heart-outline' as const },
          { label: '5-star visits', value: `${RATING_OVERVIEW.fiveStarPercent}%`, icon: 'star-outline' as const },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon} size={16} color={colors.primary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(50).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Breakdown"
          title="Rating breakdown"
          icon="bar-chart-outline"
          compact
        />
        <View style={styles.card}>
          {RATING_BREAKDOWN.map((row) => (
            <View key={row.stars} style={styles.barRow}>
              <Text style={styles.barStars}>{row.stars}★</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${row.percent}%` }]} />
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
            <View key={badge.label} style={styles.badgeCard}>
              <View style={styles.badgeIcon}>
                <Ionicons name={badge.icon} size={16} color={colors.partnerGold} />
              </View>
              <Text style={styles.badgeLabel}>{badge.label}</Text>
              <Text style={styles.badgeSub}>{badge.sub}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(130).duration(280)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="Feedback" title="Recent reviews" icon="chatbox-outline" compact />
        <View style={styles.card}>
          {RATING_RECENT_REVIEWS.map((review, i) => (
            <View key={review.id} style={[styles.reviewRow, i < RATING_RECENT_REVIEWS.length - 1 && styles.reviewBorder]}>
              <View style={styles.reviewHead}>
                <Text style={styles.reviewCustomer}>{review.customer}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Stars count={review.stars} size={12} />
              <Text style={styles.reviewService}>{review.service}</Text>
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
  scoreHero: { alignItems: 'center', gap: 4, marginTop: spacing.xs },
  scoreValue: { fontFamily: fonts.extraBold, fontSize: 40, color: colors.partnerGold, letterSpacing: -1 },
  scoreMeta: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  starsRow: { flexDirection: 'row', gap: 2 },
  statGrid: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
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
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barStars: { width: 28, fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F2F4F7',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.partnerGold },
  barPct: { width: 32, fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted, textAlign: 'right' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.white,
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
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  badgeSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
  reviewRow: { gap: spacing.xs, paddingVertical: spacing.sm },
  reviewBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  reviewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewCustomer: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  reviewDate: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  reviewService: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primary },
  reviewText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 18 },
  backLink: { alignItems: 'center', paddingVertical: spacing.sm },
  backLinkText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
});
