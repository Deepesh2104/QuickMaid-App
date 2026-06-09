import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BookingStatus } from '@/constants/demo';
import type { MaidProfileDetail } from '@/features/bookings/lib/maid.profile';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const HERO_H = 268;
const STATS_OVERLAP = 36;

export interface ProProfileBodyProps {
  maid: MaidProfileDetail;
  mode: 'sheet' | 'page';
  topInset?: number;
  bottomInset?: number;
  onClose: () => void;
  bookingStatus?: BookingStatus;
  onMessage?: () => void;
  onTrack?: () => void;
  onBook?: () => void;
}

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={rating >= n - 0.25 ? 'star' : rating >= n - 0.75 ? 'star-half' : 'star-outline'}
          size={size}
          color="#FCD34D"
        />
      ))}
    </View>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statPill}>
      <View style={styles.statIconWrap}>
        <Ionicons name={icon} size={15} color={colors.primaryDark} />
      </View>
      <Text style={styles.statPillVal}>{value}</Text>
      <Text style={styles.statPillLbl}>{label}</Text>
    </View>
  );
}

export function ProProfileBody({
  maid,
  mode,
  topInset = 0,
  bottomInset = 0,
  onClose,
  bookingStatus,
  onMessage,
  onTrack,
  onBook,
}: ProProfileBodyProps) {
  const showBookingActions = bookingStatus === 'upcoming' && (onMessage || onTrack);
  const showBookCta = !!onBook && !showBookingActions;
  const showFooter = showBookingActions || showBookCta;
  const isPage = mode === 'page';
  const firstName = maid.name.split(' ')[0];

  return (
    <View style={[styles.root, isPage && styles.rootPage]}>
      <View style={[styles.heroWrap, isPage && { marginBottom: STATS_OVERLAP }]}>
        <LinearGradient
          colors={['#010F0E', '#053D3A', '#084F4A', '#0B6E67', '#12A598']}
          locations={[0, 0.18, 0.42, 0.72, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, isPage && { paddingTop: topInset }]}
        >
          <View style={styles.meshA} pointerEvents="none" />
          <View style={styles.meshB} pointerEvents="none" />
          <View style={styles.meshC} pointerEvents="none" />
          <View style={styles.watermark} pointerEvents="none">
            <Ionicons name="person" size={140} color="rgba(255,255,255,0.035)" />
          </View>

          <View style={styles.heroTop}>
            <View style={styles.verifiedPill}>
              <View style={styles.verifiedDot} />
              <Ionicons name="shield-checkmark" size={11} color="#6EE7B7" />
              <Text style={styles.verifiedText}>Verified Pro</Text>
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityLabel={isPage ? 'Go back' : 'Close profile'}
            >
              <Ionicons name={isPage ? 'chevron-back' : 'close'} size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.heroCenter}>
            <View style={styles.avatarOrbit}>
              <View style={styles.avatarOrbitRing} />
              <View style={styles.avatarOrbitRing2} />
              <LinearGradient colors={['#6EE7B7', '#34D399', '#10B981']} style={styles.avatar}>
                <Text style={styles.avatarText}>{maid.name.charAt(0)}</Text>
              </LinearGradient>
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={11} color={colors.white} />
              </View>
            </View>

            <Text style={styles.heroEyebrow}>QUICKMAID PRO</Text>
            <Text style={styles.maidName} numberOfLines={1}>
              {maid.name}
            </Text>

            {maid.badge ? (
              <View style={styles.badgePill}>
                <LinearGradient
                  colors={['rgba(252,211,77,0.25)', 'rgba(252,211,77,0.08)']}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="ribbon" size={11} color="#FCD34D" />
                <Text style={styles.badgeText}>{maid.badge}</Text>
              </View>
            ) : null}

            <View style={styles.ratingHero}>
              <Text style={styles.ratingBig}>{maid.rating}</Text>
              <View style={styles.ratingMeta}>
                <StarRow rating={maid.rating} />
                <Text style={styles.ratingJobs}>{maid.jobs.toLocaleString('en-IN')} visits completed</Text>
              </View>
            </View>

            <Text style={styles.memberSince}>Member since {maid.memberSince}</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsFloat}>
          <LinearGradient colors={['#FFFFFF', '#F8FDFC']} style={StyleSheet.absoluteFill} />
          <StatPill icon="timer-outline" value={`${maid.onTimeRate}%`} label="On time" />
          <View style={styles.statPillSep} />
          <StatPill icon="repeat-outline" value={`${maid.repeatRate}%`} label="Rebooked" />
          <View style={styles.statPillSep} />
          <StatPill icon="briefcase-outline" value={`${maid.experienceYears} yrs`} label="Experience" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={isPage ? styles.scrollPage : undefined}
        contentContainerStyle={[
          styles.body,
          { paddingTop: STATS_OVERLAP + spacing.sm },
          isPage && !showFooter && { paddingBottom: Math.max(bottomInset, spacing.xl) },
        ]}
      >
        <View style={styles.bioCard}>
          <LinearGradient colors={['#F0FDF9', '#FFFFFF']} style={StyleSheet.absoluteFill} />
          <View style={styles.bioHead}>
            <View style={styles.bioIcon}>
              <Ionicons name="sparkles" size={14} color={colors.primaryDark} />
            </View>
            <Text style={styles.bioEyebrow}>ABOUT THIS PRO</Text>
          </View>
          <Text style={styles.bioText}>{maid.bio}</Text>
        </View>

        <View style={styles.verifyRow}>
          {maid.verified.map((v) => (
            <View key={v.label} style={styles.verifyChip}>
              <Ionicons name={v.icon as keyof typeof Ionicons.glyphMap} size={12} color={colors.primaryDark} />
              <Text style={styles.verifyText}>{v.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <View style={styles.blockHead}>
            <View style={styles.blockDot} />
            <Text style={styles.blockTitle}>Specialities</Text>
          </View>
          <View style={styles.chipRow}>
            {maid.skills.map((s) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <View style={styles.metaIcon}>
              <Ionicons name="language-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.metaLbl}>Languages</Text>
            <Text style={styles.metaVal}>{maid.languages.join(' · ')}</Text>
          </View>
          <View style={styles.metaCard}>
            <View style={styles.metaIcon}>
              <Ionicons name="map-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.metaLbl}>Areas served</Text>
            <Text style={styles.metaVal} numberOfLines={2}>
              {maid.zones.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.blockHead}>
            <View style={styles.blockDot} />
            <Text style={styles.blockTitle}>Rating breakdown</Text>
          </View>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHero}>
              <Text style={styles.breakdownScore}>{maid.rating}</Text>
              <View>
                <StarRow rating={maid.rating} size={14} />
                <Text style={styles.breakdownSub}>Average from {maid.jobs}+ visits</Text>
              </View>
            </View>
            {maid.ratingBreakdown.map((row) => (
              <View key={row.stars} style={styles.breakdownRow}>
                <Text style={styles.breakdownStars}>{row.stars}★</Text>
                <View style={styles.breakdownTrack}>
                  <LinearGradient
                    colors={['#F59E0B', '#FCD34D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.breakdownFill, { width: `${row.pct}%` }]}
                  />
                </View>
                <Text style={styles.breakdownPct}>{row.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.reviewsHead}>
            <View style={styles.blockHead}>
              <View style={styles.blockDot} />
              <Text style={styles.blockTitle}>Customer feedback</Text>
            </View>
            <View style={styles.reviewsBadge}>
              <Text style={styles.reviewsCount}>{maid.reviews.length} recent</Text>
            </View>
          </View>
          {maid.reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <LinearGradient colors={['#E6F4F2', '#D1FAE5']} style={styles.reviewAvatar}>
                  <Text style={styles.reviewInitial}>{r.customer.charAt(0)}</Text>
                </LinearGradient>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.customer}</Text>
                  <Text style={styles.reviewSub}>
                    {r.area} · {r.service}
                  </Text>
                </View>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={11} color={colors.star} />
                  <Text style={styles.reviewRatingText}>{r.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>"{r.text}"</Text>
              <Text style={styles.reviewWhen}>{r.when}</Text>
            </View>
          ))}
        </View>

        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.muted} />
          <Text style={styles.privacyText}>
            Limited profile for your booking. Phone number and home address are never shared with other customers.
          </Text>
        </View>
      </ScrollView>

      {showFooter ? (
        <View
          style={[
            styles.footer,
            isPage && styles.footerPage,
            isPage && { paddingBottom: Math.max(bottomInset, spacing.md) },
          ]}
        >
          {showBookCta ? (
            <Pressable
              style={styles.footerPrimary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onBook?.();
              }}
            >
              <LinearGradient
                colors={['#084F4A', '#0B6E67', '#12A598']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.footerPrimaryGrad}
              >
                <Ionicons name="calendar" size={18} color={colors.white} />
                <Text style={styles.footerPrimaryText}>Book with {firstName}</Text>
              </LinearGradient>
            </Pressable>
          ) : null}
          {showBookingActions && onMessage ? (
            <Pressable
              style={styles.footerSecondary}
              onPress={() => {
                Haptics.selectionAsync();
                onMessage();
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.footerSecondaryText}>Message</Text>
            </Pressable>
          ) : null}
          {showBookingActions && onTrack ? (
            <Pressable
              style={styles.footerPrimary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onTrack();
              }}
            >
              <LinearGradient
                colors={['#084F4A', '#0B6E67', '#12A598']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.footerPrimaryGrad}
              >
                <Ionicons name="navigate" size={18} color={colors.white} />
                <Text style={styles.footerPrimaryText}>Track live</Text>
              </LinearGradient>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  rootPage: { backgroundColor: '#F4F6F8' },
  scrollPage: { flex: 1 },

  heroWrap: { position: 'relative', marginBottom: STATS_OVERLAP },
  hero: { height: HERO_H, paddingHorizontal: layout.pad, overflow: 'hidden' },
  meshA: {
    position: 'absolute',
    top: -56,
    right: -44,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  meshB: {
    position: 'absolute',
    bottom: 48,
    left: -64,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  meshC: {
    position: 'absolute',
    top: 72,
    left: 48,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(252,211,77,0.08)',
  },
  watermark: { position: 'absolute', alignSelf: 'center', top: 40 },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    zIndex: 2,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
  },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE7B7' },
  verifiedText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#6EE7B7',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  heroCenter: { alignItems: 'center', paddingTop: spacing.sm, gap: 6, zIndex: 2 },
  avatarOrbit: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarOrbitRing: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1.5,
    borderColor: 'rgba(110,231,183,0.35)',
  },
  avatarOrbitRing2: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#010F0E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontFamily: fonts.extraBold,
    fontSize: 34,
    color: colors.primaryDark,
    letterSpacing: -1,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
  },

  heroEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.4,
  },
  maidName: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.6,
    textAlign: 'center',
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, color: '#FCD34D' },

  ratingHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ratingBig: {
    fontFamily: fonts.extraBold,
    fontSize: 36,
    color: colors.white,
    letterSpacing: -1.5,
    lineHeight: 40,
  },
  ratingMeta: { gap: 3, alignItems: 'flex-start' },
  starRow: { flexDirection: 'row', gap: 2 },
  ratingJobs: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  memberSince: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },

  statsFloat: {
    position: 'absolute',
    left: layout.pad,
    right: layout.pad,
    bottom: -STATS_OVERLAP,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    shadowColor: '#084F4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 5,
  },
  statPill: { flex: 1, alignItems: 'center', gap: 4 },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillVal: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.primaryDark,
    letterSpacing: -0.3,
  },
  statPillLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statPillSep: { width: 1, height: 44, backgroundColor: colors.divider },

  body: { paddingHorizontal: layout.pad, paddingBottom: spacing.xl, gap: spacing.lg },

  bioCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  bioHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bioIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.1,
  },
  bioText: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 22 },

  verifyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  verifyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  verifyText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },

  block: { gap: spacing.sm },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  blockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  blockTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  chipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },

  metaGrid: { flexDirection: 'row', gap: spacing.sm },
  metaCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  metaIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLbl: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaVal: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, lineHeight: 17 },

  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  breakdownHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  breakdownScore: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.primaryDark,
    letterSpacing: -1,
  },
  breakdownSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 2 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  breakdownStars: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted, width: 22 },
  breakdownTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  breakdownFill: { height: '100%', borderRadius: 4 },
  breakdownPct: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, width: 28, textAlign: 'right' },

  reviewsHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewsBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  reviewsCount: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInitial: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  reviewMeta: { flex: 1, minWidth: 0, gap: 1 },
  reviewName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  reviewSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  reviewRatingText: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  reviewText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  reviewWhen: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  privacyText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },

  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  footerPage: { paddingBottom: spacing.md },
  footerSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 13,
    backgroundColor: colors.primaryLight,
  },
  footerSecondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  footerPrimary: { flex: 1.2, borderRadius: radius.pill, overflow: 'hidden' },
  footerPrimaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
  },
  footerPrimaryText: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.white },
});
