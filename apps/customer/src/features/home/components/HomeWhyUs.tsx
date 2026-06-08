import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const REASONS = [
  {
    icon: 'shield-checkmark' as const,
    title: 'Verified pros',
    desc: 'Background-checked & trained cleaners',
    tone: '#E6F4F2',
    ink: colors.primaryDark,
  },
  {
    icon: 'leaf-outline' as const,
    title: 'Eco-safe products',
    desc: 'Family & pet friendly supplies',
    tone: '#ECFDF3',
    ink: '#047857',
  },
  {
    icon: 'cash-outline' as const,
    title: 'Transparent pricing',
    desc: 'No hidden fees · Pay after service',
    tone: '#EEF6FF',
    ink: '#175CD3',
  },
  {
    icon: 'refresh-outline' as const,
    title: 'Free reschedule',
    desc: 'Change slot up to 2 hrs before',
    tone: '#FFF8EE',
    ink: '#B54708',
  },
];

const STATS = [
  { value: '4.8★', label: 'Avg rating' },
  { value: '12k+', label: 'Homes cleaned' },
  { value: '30m', label: 'Pro assigned' },
];

function ReasonCell({
  item,
  index,
  rightBorder,
  bottomBorder,
}: {
  item: (typeof REASONS)[0];
  index: number;
  rightBorder?: boolean;
  bottomBorder?: boolean;
}) {
  return (
    <View style={[styles.cell, rightBorder && styles.cellRight, bottomBorder && styles.cellBottom]}>
      <LinearGradient colors={[item.tone, colors.bg]} style={styles.cellBg} />
      <Text style={styles.cellNum}>{String(index + 1).padStart(2, '0')}</Text>
      <View style={[styles.cellIcon, { backgroundColor: item.tone }]}>
        <Ionicons name={item.icon} size={18} color={item.ink} />
      </View>
      <Text style={styles.cellTitle}>{item.title}</Text>
      <Text style={styles.cellDesc}>{item.desc}</Text>
    </View>
  );
}

export function HomeWhyUs() {
  const topRow = REASONS.slice(0, 2);
  const bottomRow = REASONS.slice(2, 4);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Why QuickMaid"
        title="Built for Raipur homes"
        subtitle="Trust, quality & convenience"
        icon="heart-outline"
        compact
      />

      <View style={styles.card}>
        <LinearGradient colors={['#F8FDFC', colors.bg]} style={styles.cardBg} />

        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i < STATS.length - 1 && styles.statDivider]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            {topRow.map((r, i) => (
              <ReasonCell key={r.title} item={r} index={i} rightBorder={i === 0} bottomBorder />
            ))}
          </View>
          <View style={styles.gridRow}>
            {bottomRow.map((r, i) => (
              <ReasonCell key={r.title} item={r} index={i + 2} rightBorder={i === 0} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { ...premium.section },
  card: {
    marginHorizontal: layout.pad,
    overflow: 'hidden',
    ...premium.surface,
    borderColor: 'rgba(11,110,103,0.1)',
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardBg: { ...StyleSheet.absoluteFill, opacity: 0.85 },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  statDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.divider,
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.primaryDark,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  grid: { gap: 0 },
  gridRow: { flexDirection: 'row' },
  cell: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xs,
    minHeight: 132,
    overflow: 'hidden',
    position: 'relative',
  },
  cellRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.divider,
  },
  cellBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  cellBg: { ...StyleSheet.absoluteFill, opacity: 0.5 },
  cellNum: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: 'rgba(15,20,25,0.05)',
    letterSpacing: -1,
  },
  cellIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cellTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
    marginTop: 2,
  },
  cellDesc: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
});
