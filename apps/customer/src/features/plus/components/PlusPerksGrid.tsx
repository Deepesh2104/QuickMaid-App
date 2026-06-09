import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const PERKS = [
  {
    icon: 'person' as const,
    title: 'Same maid',
    sub: 'Every single visit',
    gradient: ['#E6F4F2', '#FFFFFF'] as const,
    ink: colors.primaryDark,
    wide: true,
  },
  {
    icon: 'flash' as const,
    title: 'Priority slots',
    sub: 'Book first',
    gradient: ['#FFF8EE', '#FFFFFF'] as const,
    ink: '#B54708',
    wide: true,
  },
  {
    icon: 'refresh' as const,
    title: 'Free reschedule',
    sub: 'No penalty',
    gradient: ['#EEF6FF', '#FFFFFF'] as const,
    ink: '#175CD3',
    wide: false,
  },
  {
    icon: 'pause-circle' as const,
    title: 'Pause plan',
    sub: 'No lock-in',
    gradient: ['#FDF2F8', '#FFFFFF'] as const,
    ink: '#6941C6',
    wide: false,
  },
  {
    icon: 'pricetag' as const,
    title: '10% extra off',
    sub: 'All services',
    gradient: ['#ECFDF5', '#FFFFFF'] as const,
    ink: '#027A48',
    wide: false,
  },
];

const GAP = spacing.sm;

export function PlusPerksGrid() {
  const widePerks = PERKS.filter((p) => p.wide);
  const narrowPerks = PERKS.filter((p) => !p.wide);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Member perks"
        title="Why homes love Plus"
        subtitle="Exclusive benefits, every visit"
        icon="diamond-outline"
        compact
      />

      <View style={styles.wideRow}>
        {widePerks.map((p) => (
          <View key={p.title} style={styles.wideCard}>
            <LinearGradient colors={[...p.gradient]} style={StyleSheet.absoluteFill} />
            <View style={[styles.icon, { backgroundColor: colors.white }]}>
              <Ionicons name={p.icon} size={20} color={p.ink} />
            </View>
            <View style={styles.wideCopy}>
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.sub}>{p.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.narrowRow}>
        {narrowPerks.map((p) => (
          <View key={p.title} style={styles.narrowCard}>
            <LinearGradient colors={[...p.gradient]} style={StyleSheet.absoluteFill} />
            <View style={[styles.iconSm, { backgroundColor: colors.white }]}>
              <Ionicons name={p.icon} size={16} color={p.ink} />
            </View>
            <Text style={styles.narrowTitle}>{p.title}</Text>
            <Text style={styles.narrowSub}>{p.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  wideRow: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
    marginBottom: GAP,
  },
  wideCard: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    minHeight: 76,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideCopy: { flex: 1, minWidth: 0, gap: 2 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
  },
  narrowRow: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
  },
  narrowCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 3,
    overflow: 'hidden',
    minHeight: 96,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  iconSm: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  narrowTitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.ink,
    textAlign: 'center',
    width: '100%',
  },
  narrowSub: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
  },
});
