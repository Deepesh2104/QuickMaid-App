import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingsSummaryBannerProps {
  total: number;
  upcoming: number;
  completed: number;
}

export function BookingsSummaryBanner({ total, upcoming, completed }: BookingsSummaryBannerProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      <View style={styles.top}>
        <View style={styles.badge}>
          <Ionicons name="calendar" size={14} color={colors.primaryDark} />
          <Text style={styles.badgeText}>Your visits</Text>
        </View>
        {upcoming > 0 ? (
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{upcoming} upcoming</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.headline}>
        {total} booking{total === 1 ? '' : 's'} on QuickMaid
      </Text>
      <Text style={styles.sub}>Track pros, invoices & rebook in one place</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{upcoming}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.section,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  glow: {
    position: 'absolute',
    right: -24,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.15)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  liveText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.success,
  },
  headline: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
    marginTop: spacing.xs,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statSep: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
  },
});
