import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { VisitCompletePayload } from '../lib/booking.completion';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface BookingVisitCompleteModalProps {
  visible: boolean;
  payload: VisitCompletePayload | null;
  onClose: () => void;
  onRate?: () => void;
}

const NEXT_STEPS = [
  `OTP ${DEMO_VISIT_COMPLETION_OTP} verified · unified demo flow`,
  'Partner bridge sync → booking completed',
  'Ab aap apni pro ko rate kar sakte ho',
];

export function BookingVisitCompleteModal({
  visible,
  payload,
  onClose,
  onRate,
}: BookingVisitCompleteModalProps) {
  const insets = useSafeAreaInsets();
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    ringScale.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      true,
    );
  }, [visible, ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  if (!payload) return null;

  const time = new Date(payload.completedAt).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(220)}
        style={[
          styles.backdrop,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <Animated.View entering={FadeInDown.duration(320).springify()} style={styles.card}>
          <LinearGradient colors={['#010F0E', '#084F4A', '#0B6E67']} style={styles.cardBg} />
          <View style={styles.glowA} pointerEvents="none" />
          <View style={styles.glowB} pointerEvents="none" />

          <Animated.View entering={ZoomIn.delay(80).duration(360).springify()} style={styles.iconWrap}>
            <Animated.View style={[styles.iconRing, ringStyle]}>
              <LinearGradient
                colors={['rgba(110,231,183,0.25)', 'rgba(18,165,152,0.05)']}
                style={styles.iconRingGrad}
              />
            </Animated.View>
            <LinearGradient colors={['#12A598', '#084F4A']} style={styles.iconGrad}>
              <Ionicons name="checkmark-done" size={32} color={colors.white} />
            </LinearGradient>
          </Animated.View>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>BRIDGE SYNCED</Text>
          </View>

          <Text style={styles.title}>Visit complete!</Text>
          <Text style={styles.sub}>
            <Text style={styles.maid}>{payload.maidName}</Text> ne OTP verify kiya · customer app
            updated
          </Text>

          <View style={styles.otpVerified}>
            <Ionicons name="key" size={14} color="#6EE7B7" />
            <Text style={styles.otpVerifiedText}>
              Visit OTP verified · unified demo {DEMO_VISIT_COMPLETION_OTP}
            </Text>
          </View>

          <View style={styles.summary}>
            <SummaryRow icon="sparkles-outline" text={payload.service} />
            <SummaryRow icon="receipt-outline" text={payload.bookingRef ?? payload.bookingId} />
            <SummaryRow icon="shield-checkmark-outline" text={`Verified · ${time}`} />
          </View>

          <View style={styles.points}>
            {NEXT_STEPS.map((p) => (
              <View key={p} style={styles.point}>
                <Ionicons name="checkmark-circle" size={13} color="#6EE7B7" />
                <Text style={styles.pointText}>{p}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.primary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRate?.();
              onClose();
            }}
          >
            <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
            <Ionicons name="star" size={18} color={colors.white} />
            <Text style={styles.primaryText}>Rate your visit</Text>
          </Pressable>

          <Pressable style={styles.ghost} onPress={onClose}>
            <Text style={styles.ghostText}>Done</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function SummaryRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={14} color="#6EE7B7" />
      <Text style={styles.summaryText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.72)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  glowA: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(18,165,152,0.2)',
    top: -50,
    right: -30,
  },
  glowB: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(18,165,152,0.1)',
    bottom: -20,
    left: 20,
  },
  iconWrap: { alignItems: 'center', marginBottom: spacing.xs },
  iconRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
  },
  iconRingGrad: { flex: 1 },
  iconGrad: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.4)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  maid: { fontFamily: fonts.bold, color: '#6EE7B7' },
  otpVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(18,165,152,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
  },
  otpVerifiedText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#6EE7B7',
    lineHeight: 15,
  },
  summary: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: spacing.xs,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 13, color: colors.white },
  points: { width: '100%', gap: 6, paddingTop: spacing.xs },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  pointText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 16,
  },
  primary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.white },
  ghost: { paddingVertical: spacing.sm },
  ghostText: { fontFamily: fonts.semiBold, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});
