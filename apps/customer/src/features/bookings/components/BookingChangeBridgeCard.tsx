import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

type ChangeVariant = 'cancel' | 'reschedule';

interface BookingChangeBridgeCardProps {
  booking: DemoBooking;
  variant: ChangeVariant;
  /** Reschedule preview — new slot before save */
  previewDate?: string;
  previewSlot?: string;
}

const CONFIG: Record<
  ChangeVariant,
  {
    colors: [string, string, string];
    glow: string;
    eyebrow: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    steps: { icon: keyof typeof Ionicons.glyphMap; label: string }[];
  }
> = {
  cancel: {
    colors: ['#450A0A', '#7F1D1D', '#B91C1C'],
    glow: 'rgba(248,113,113,0.2)',
    eyebrow: 'CANCEL BRIDGE',
    title: 'Partner app sync on confirm',
    icon: 'close-circle-outline',
    steps: [
      { icon: 'document-text', label: 'Booking cancelled' },
      { icon: 'swap-horizontal', label: 'Bridge push' },
      { icon: 'briefcase', label: 'Partner job removed' },
    ],
  },
  reschedule: {
    colors: ['#042F2E', '#0F766E', '#14B8A6'],
    glow: 'rgba(45,212,191,0.2)',
    eyebrow: 'RESCHEDULE BRIDGE',
    title: 'New slot syncs to partner schedule',
    icon: 'calendar-outline',
    steps: [
      { icon: 'calendar', label: 'Slot updated' },
      { icon: 'swap-horizontal', label: 'Bridge push' },
      { icon: 'time', label: 'Partner calendar' },
    ],
  },
};

export function BookingChangeBridgeCard({
  booking,
  variant,
  previewDate,
  previewSlot,
}: BookingChangeBridgeCardProps) {
  const cfg = CONFIG[variant];

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={cfg.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[styles.glow, { backgroundColor: cfg.glow }]} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name={cfg.icon} size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>{cfg.eyebrow}</Text>
            <Text style={styles.title}>{cfg.title}</Text>
            <Text style={styles.sub}>Ref {booking.bookingRef} · {booking.maid}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DEMO</Text>
          </View>
        </View>

        {variant === 'reschedule' && previewDate && previewSlot ? (
          <View style={styles.preview}>
            <Ionicons name="arrow-forward" size={12} color="#5EEAD4" />
            <Text style={styles.previewText}>
              New slot · <Text style={styles.previewBold}>{previewDate} · {previewSlot}</Text>
            </Text>
          </View>
        ) : null}

        <View style={styles.pipeline}>
          {cfg.steps.map((step, i) => (
            <View key={step.label} style={styles.step}>
              <View style={[styles.stepDot, i === cfg.steps.length - 1 && styles.stepDotActive]}>
                <Ionicons name={step.icon} size={11} color={colors.white} />
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.trust}>
          <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
          <Text style={styles.trustText}>
            Partner app refresh ya Settings sync se update dikhega · same device demo
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -35,
    right: -15,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  previewText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  previewBold: { fontFamily: fonts.bold, color: '#5EEAD4' },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  step: { flex: 1, alignItems: 'center', gap: 5 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  stepDotActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.35)',
    borderWidth: 2,
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 14,
  },
});
