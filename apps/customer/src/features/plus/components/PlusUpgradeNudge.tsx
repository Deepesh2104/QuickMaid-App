import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PlusUpgradeNudgeProps {
  selectedPlan: string;
  onSelectPlan: (id: string) => void;
}

const NUDGE: Record<string, { title: string; sub: string; cta: string; target: string } | null> = {
  plus: null,
  flex: {
    title: 'Upgrade to Plus',
    sub: 'Double your visits · Save 8% more · Same maid priority',
    cta: 'See Plus plan',
    target: 'plus',
  },
  onetime: {
    title: 'Members save ₹240/mo',
    sub: '12 visits for ₹1,199 — vs ₹1,788 pay-per-visit',
    cta: 'Compare plans',
    target: 'plus',
  },
};

export function PlusUpgradeNudge({ selectedPlan, onSelectPlan }: PlusUpgradeNudgeProps) {
  const nudge = NUDGE[selectedPlan];
  if (!nudge) return null;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelectPlan(nudge.target);
      }}
      accessibilityRole="button"
    >
      <LinearGradient colors={['#0F1419', '#1A2332']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      <View style={styles.glow} />

      <View style={styles.icon}>
        <Ionicons name="diamond" size={20} color="#FCD34D" />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{nudge.title}</Text>
        <Text style={styles.sub}>{nudge.sub}</Text>
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaText}>{nudge.cta}</Text>
        <Ionicons name="arrow-forward" size={14} color="#0F1419" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.section,
  },
  glow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.15)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(252,211,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.white,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 15,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FCD34D',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#0F1419',
  },
});
