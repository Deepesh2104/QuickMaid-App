import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const PLANS = [
  {
    id: 'plus',
    name: 'Plus',
    price: '₹100',
    unit: '/visit',
    highlight: true,
    gradient: ['#0F1419', '#1A2332'] as const,
    perks: ['12 visits', '20% off', 'Same maid', 'Priority'],
  },
  {
    id: 'flex',
    name: 'Flex 6',
    price: '₹117',
    unit: '/visit',
    highlight: false,
    gradient: ['#E6F4F2', '#FFFFFF'] as const,
    perks: ['6 visits', '12% off', 'Pick maid', 'Weekends'],
  },
  {
    id: 'onetime',
    name: 'Per visit',
    price: '₹149',
    unit: '/visit',
    highlight: false,
    gradient: ['#F4F6F8', '#FFFFFF'] as const,
    perks: ['No plan', 'Full price', 'Anytime', 'All services'],
  },
];

const GAP = spacing.sm;

function PlanColumn({
  plan,
  width,
}: {
  plan: (typeof PLANS)[0];
  width?: number;
}) {
  return (
    <View style={[styles.col, width ? { width } : styles.colFlex, plan.highlight && styles.colHighlight]}>
      <LinearGradient colors={[...plan.gradient]} style={StyleSheet.absoluteFill} />

      {plan.highlight ? (
        <View style={styles.winnerBadge}>
          <Ionicons name="trophy" size={10} color="#FBBF24" />
          <Text style={styles.winnerText}>Best</Text>
        </View>
      ) : null}

      <Text style={[styles.colName, plan.highlight && styles.colNameLight]} numberOfLines={1}>
        {plan.name}
      </Text>
      <Text style={[styles.colPrice, plan.highlight && styles.colPriceGold]}>{plan.price}</Text>
      <Text style={[styles.colUnit, plan.highlight && styles.colUnitLight]}>{plan.unit}</Text>

      <View style={styles.perkList}>
        {plan.perks.map((perk) => (
          <View key={perk} style={styles.perkRow}>
            <Ionicons name="checkmark" size={10} color={plan.highlight ? '#6EE7B7' : colors.primary} />
            <Text style={[styles.perkText, plan.highlight && styles.perkTextLight]} numberOfLines={1}>
              {perk}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PlusCompareSection() {
  const { isCompact, threeColW } = useLayoutMetrics();
  const colW = isCompact ? Math.max(threeColW, 108) : undefined;

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Compare"
        title="See the difference"
        subtitle="Cost per visit · All plans"
        icon="git-compare-outline"
        compact
      />

      {isCompact ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollRow}
        >
          {PLANS.map((p) => (
            <PlanColumn key={p.id} plan={p} width={colW} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.row}>
          {PLANS.map((p) => (
            <PlanColumn key={p.id} plan={p} />
          ))}
        </View>
      )}

      <View style={styles.note}>
        <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
        <Text style={styles.noteText}>
          Plus saves <Text style={styles.noteBold}>₹49 per visit</Text> vs pay-as-you-go
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
    alignItems: 'flex-end',
  },
  scrollRow: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
    paddingRight: layout.pad + spacing.md,
    alignItems: 'flex-end',
  },
  col: {
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 2,
    overflow: 'hidden',
    minHeight: 200,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  colFlex: {
    flex: 1,
    minWidth: 0,
  },
  colHighlight: {
    minHeight: 220,
    borderColor: 'rgba(251,191,36,0.35)',
    borderWidth: 1.5,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
  },
  winnerText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#FBBF24',
  },
  colName: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.ink,
  },
  colNameLight: { color: colors.white },
  colPrice: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.4,
    marginTop: 4,
  },
  colPriceGold: { color: '#6EE7B7' },
  colUnit: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  colUnitLight: { color: 'rgba(255,255,255,0.65)' },
  perkList: { gap: 5, marginTop: spacing.xs },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 },
  perkText: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.inkSecondary,
  },
  perkTextLight: { color: 'rgba(255,255,255,0.82)' },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  noteText: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.primaryDark,
  },
  noteBold: {
    fontFamily: fonts.bold,
  },
});
