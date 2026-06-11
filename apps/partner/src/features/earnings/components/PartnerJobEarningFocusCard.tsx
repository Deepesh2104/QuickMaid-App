import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { formatRs } from '@/features/home/lib/home.greeting';
import { jobEarningsBreakdown } from '@/features/jobs/lib/job-detail.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerJobEarningFocusCardProps {
  job: PartnerJob;
  onViewAll?: () => void;
}

export function PartnerJobEarningFocusCard({ job, onViewAll }: PartnerJobEarningFocusCardProps) {
  const { gross, net, fee } = jobEarningsBreakdown(job);

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.card}>
        <View style={styles.glow} />
        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="ribbon" size={18} color={colors.partnerGold} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>THIS VISIT</Text>
            <Text style={styles.title} numberOfLines={2}>{job.service}</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {job.bookingRef} · {job.customerName} · {job.visitDate}
            </Text>
          </View>
        </View>

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Your net earning</Text>
          <Text style={styles.netValue}>{formatRs(net)}</Text>
        </View>

        <View style={styles.breakdown}>
          <View style={styles.breakItem}>
            <Text style={styles.breakLabel}>Gross</Text>
            <Text style={styles.breakVal}>{formatRs(gross)}</Text>
          </View>
          <View style={styles.breakDivider} />
          <View style={styles.breakItem}>
            <Text style={styles.breakLabel}>Platform fee</Text>
            <Text style={styles.breakVal}>-{formatRs(fee)}</Text>
          </View>
          <View style={styles.breakDivider} />
          <View style={styles.breakItem}>
            <Text style={styles.breakLabel}>Net</Text>
            <Text style={[styles.breakVal, styles.breakNet]}>{formatRs(net)}</Text>
          </View>
        </View>

        <Text style={styles.hint}>Credited after visit completion · paid on weekly Monday payout</Text>
      </LinearGradient>

      {onViewAll ? (
        <Pressable style={styles.allBtn} onPress={onViewAll}>
          <Ionicons name="wallet-outline" size={14} color={colors.primary} />
          <Text style={styles.allText}>View full wallet & all earnings</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  card: {
    borderRadius: radius.xl + 2,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    ...shadow.md,
  },
  glow: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.14)',
  },
  head: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  netLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  netValue: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.white, letterSpacing: -0.5 },
  breakdown: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
  },
  breakItem: { flex: 1, alignItems: 'center', gap: 2, minWidth: 0 },
  breakLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  breakVal: { fontFamily: fonts.bold, fontSize: 13, color: colors.white, textAlign: 'center' },
  breakNet: { color: colors.partnerGold },
  breakDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  hint: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 14,
  },
  allBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  allText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
});
