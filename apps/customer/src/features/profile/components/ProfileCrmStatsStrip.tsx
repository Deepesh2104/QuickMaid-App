import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const router = useRouter();
  const stats = [
    { id: 'csat', icon: 'star' as const, value: csat.toFixed(1), label: 'CSAT' },
    { id: 'referrals', icon: 'gift-outline' as const, value: String(referrals), label: 'Referrals' },
    { id: 'tickets', icon: 'headset-outline' as const, value: String(supportTickets), label: 'Tickets' },
  ];

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.planRow}>
        <Ionicons name="ribbon-outline" size={14} color={colors.primary} />
        <Text style={styles.planText}>{planLabel}</Text>
      </View>
      <View style={styles.row}>
        {stats.map((s) => {
          const inner = (
            <>
              <Ionicons name={s.icon} size={13} color={colors.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </>
          );

          if (s.id === 'referrals') {
            return (
              <Pressable
                key={s.label}
                style={styles.stat}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/account/referrals' as Href);
                }}
                accessibilityRole="button"
              >
                {inner}
              </Pressable>
            );
          }

          if (s.id === 'tickets') {
            return (
              <Pressable
                key={s.label}
                style={styles.stat}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/support/tickets' as Href);
                }}
                accessibilityRole="button"
              >
                {inner}
              </Pressable>
            );
          }

          return (
            <View key={s.label} style={styles.stat}>
              {inner}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const GAP = spacing.sm;

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
  stat: { flex: 1, minWidth: 0, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  statLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
});
