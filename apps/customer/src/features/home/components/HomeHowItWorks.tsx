import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STEPS = [
  { icon: 'calendar-outline' as const, step: '01', title: 'Book', desc: 'Pick service & time slot' },
  { icon: 'shield-checkmark-outline' as const, step: '02', title: 'Pro arrives', desc: 'Verified & on-time' },
  { icon: 'sparkles-outline' as const, step: '03', title: 'Enjoy', desc: 'Spotless home, guaranteed' },
];

export function HomeHowItWorks() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Simple process"
        title="How it works"
        subtitle="Book to clean in 3 easy steps"
        icon="list-outline"
        compact
      />
      <View style={styles.card}>
        <View style={styles.rail} />
        {STEPS.map((s, i) => (
          <View key={s.title} style={[styles.step, i < STEPS.length - 1 && styles.stepBorder]}>
            <View style={styles.stepBadge}>
              <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.iconWrap}>
                <Ionicons name={s.icon} size={18} color={colors.primaryDark} />
              </LinearGradient>
              <View style={styles.stepDot} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.stepNum}>STEP {s.step}</Text>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.desc}>{s.desc}</Text>
            </View>
            {i < STEPS.length - 1 ? (
              <Ionicons name="arrow-forward" size={14} color={colors.mutedLight} style={styles.chev} />
            ) : (
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { ...premium.section },
  card: {
    marginHorizontal: layout.pad,
    ...premium.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  rail: {
    position: 'absolute',
    left: layout.pad + 21,
    top: spacing.xl + 8,
    bottom: spacing.xl + 8,
    width: 2,
    backgroundColor: colors.primaryLight,
    borderRadius: 1,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  stepBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  stepBadge: {
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  copy: { flex: 1, gap: 2 },
  stepNum: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  chev: { marginRight: 2 },
  doneBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
