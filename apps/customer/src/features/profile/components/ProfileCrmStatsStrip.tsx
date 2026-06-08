import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileCrmStatsStripProps {
  referrals: number;
  csat: number;
  supportTickets: number;
  planLabel: string;
}

export function ProfileCrmStatsStrip({ referrals, csat, supportTickets, planLabel }: ProfileCrmStatsStripProps) {
  const stats = [
    { icon: 'star' as const, value: csat.toFixed(1), label: 'CSAT' },
    { icon: 'gift-outline' as const, value: String(referrals), label: 'Referrals' },
    { icon: 'headset-outline' as const, value: String(supportTickets), label: 'Tickets' },
  ];

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.planRow}>
        <Ionicons name="ribbon-outline" size={14} color={colors.primary} />
        <Text style={styles.planText}>{planLabel}</Text>
      </View>
      <View style={styles.row}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Ionicons name={s.icon} size={13} color={colors.primary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const GAP = spacing.sm;
const STAT_W = (layout.screenWidth - layout.pad * 2 - spacing.lg * 2 - GAP * 2) / 3;

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', gap: GAP },
  stat: { width: STAT_W, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  statLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
});
