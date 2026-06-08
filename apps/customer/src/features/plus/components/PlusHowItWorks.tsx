import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STEPS = [
  {
    icon: 'diamond-outline' as const,
    step: '01',
    title: 'Pick your plan',
    sub: 'Plus, Flex 6, or pay per visit',
  },
  {
    icon: 'calendar-outline' as const,
    step: '02',
    title: 'Book your cleans',
    sub: 'Priority slots for members',
  },
  {
    icon: 'wallet-outline' as const,
    step: '03',
    title: 'Save every month',
    sub: 'Lower per-visit cost, every time',
  },
];

export function PlusHowItWorks() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="How it works"
        title="Three simple steps"
        subtitle="Up and running in minutes"
        icon="footsteps-outline"
        compact
      />

      <View style={styles.timeline}>
        {STEPS.map((s, i) => (
          <View key={s.step} style={styles.stepWrap}>
            {i < STEPS.length - 1 ? <View style={styles.connector} /> : null}
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={s.icon} size={18} color={colors.primaryDark} />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepNum}>{s.step}</Text>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepSub}>{s.sub}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  timeline: {
    marginHorizontal: layout.pad,
    gap: spacing.md,
  },
  stepWrap: { position: 'relative' },
  connector: {
    position: 'absolute',
    left: 23,
    top: 52,
    width: 2,
    height: spacing.md + 28,
    backgroundColor: colors.primaryLight,
    zIndex: 0,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    zIndex: 1,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: { flex: 1, gap: 2 },
  stepNum: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  stepTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  stepSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
});
