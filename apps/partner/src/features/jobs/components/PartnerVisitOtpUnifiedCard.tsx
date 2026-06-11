import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PartnerVisitOtpUnifiedCardProps {
  expectedOtp?: string;
  compact?: boolean;
}

export function PartnerVisitOtpUnifiedCard({
  expectedOtp = DEMO_VISIT_COMPLETION_OTP,
  compact,
}: PartnerVisitOtpUnifiedCardProps) {
  const digits = expectedOtp.replace(/\D/g, '').slice(0, 6).padStart(6, '0').split('');

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient
        colors={['#422006', '#92400E', '#B45309']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="keypad" size={18} color="#FCD34D" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>UNIFIED DEMO OTP</Text>
            <Text style={styles.title}>Auth + visit completion</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>123456</Text>
          </View>
        </View>

        <View style={styles.digitRow}>
          {digits.map((d, i) => (
            <View key={`${d}-${i}`} style={styles.digitBox}>
              <Text style={styles.digit}>{d}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pipeline}>
          <Step icon="phone-portrait-outline" label="Customer shows" />
          <Step icon="arrow-forward" label="You enter" />
          <Step icon="checkmark-done" label="Bridge complete" />
        </View>
      </LinearGradient>
    </View>
  );
}

function Step({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.step}>
      <Ionicons name={icon} size={12} color="#FCD34D" />
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.sm },
  wrapCompact: { marginBottom: 0 },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
    top: -25,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(252,211,77,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 10,
    color: '#FCD34D',
    letterSpacing: 1,
  },
  digitRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 5 },
  digitBox: {
    flex: 1,
    aspectRatio: 0.85,
    maxHeight: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  digit: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#78350F',
  },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
