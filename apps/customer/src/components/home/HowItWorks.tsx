import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme/fonts';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

const STEPS = [
  { icon: 'calendar-outline' as const, title: 'Book', desc: 'Pick service & slot' },
  { icon: 'person-outline' as const, title: 'We arrive', desc: 'Verified professional' },
  { icon: 'checkmark-circle-outline' as const, title: 'Relax', desc: 'Spotless home' },
];

export function HowItWorks() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>How it works</Text>
      <View style={styles.row}>
        {STEPS.map((step, i) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.iconWrap}>
              <Ionicons name={step.icon} size={20} color={colors.inkSecondary} />
            </View>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.desc}>{step.desc}</Text>
            {i < STEPS.length - 1 ? <View style={styles.connector} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heading: {
    ...type.overline,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  title: {
    ...type.caption,
    fontFamily: fonts.bold,
    color: colors.ink,
    marginBottom: 2,
  },
  desc: {
    ...type.caption,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 13,
  },
  connector: {
    position: 'absolute',
    top: 22,
    right: -8,
    width: 16,
    height: 1,
    backgroundColor: colors.border,
  },
});
