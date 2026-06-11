import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatRs } from '@/features/home/lib/home.greeting';
import type { PartnerRuntimeState } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerEarningsHeroProps {
  state: PartnerRuntimeState;
}

const STATS = [
  { key: 'weekJobs', label: 'Jobs this week', icon: 'briefcase-outline' as const },
  { key: 'onTime', label: 'On-time rate', icon: 'time-outline' as const },
  { key: 'rating', label: 'Partner rating', icon: 'star-outline' as const },
];

export function PartnerEarningsHero({ state }: PartnerEarningsHeroProps) {
  const router = useRouter();
  const values: Record<string, string> = {
    weekJobs: String(state.weekJobs),
    onTime: '98%',
    rating: '4.9',
  };

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/(tabs)/earnings' as Href);
      }}
    >
      <LinearGradient
        colors={[colors.white, '#FAFCFB']}
        style={styles.hero}
      >
        <LinearGradient
          colors={['#084F4A', '#0B6E67']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsBand}
        >
          <View>
            <Text style={styles.earningsLabel}>TODAY&apos;S EARNINGS</Text>
            <Text style={styles.earningsValue}>{formatRs(state.todayEarningsPaise)}</Text>
            <Text style={styles.earningsSub}>After platform fee · UPI weekly</Text>
          </View>
          <View style={styles.coinWrap}>
            <Ionicons name="wallet" size={22} color={colors.partnerGold} />
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.key} style={styles.stat}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{values[s.key]}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...shadow.lg,
  },
  hero: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  earningsBand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  earningsLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.1,
    color: 'rgba(255,255,255,0.6)',
  },
  earningsValue: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.white,
    marginTop: 4,
    letterSpacing: -0.8,
  },
  earningsSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  coinWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 12,
  },
});
