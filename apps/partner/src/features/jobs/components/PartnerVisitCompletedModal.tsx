import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface PartnerVisitCompletedModalProps {
  visible: boolean;
  job: PartnerJob | null;
  onClose: () => void;
  onViewEarnings: () => void;
}

const NEXT_STEPS = [
  'Visit customer app mein complete mark ho gaya',
  'Earning next Monday payout mein add hogi',
  'Customer rating aapke priority score ko boost kar sakti hai',
];

export function PartnerVisitCompletedModal({
  visible,
  job,
  onClose,
  onViewEarnings,
}: PartnerVisitCompletedModalProps) {
  const insets = useSafeAreaInsets();
  const { height: screenH, width: screenW } = useWindowDimensions();
  const compact = screenW < 360;
  const cardMaxH = Math.min(screenH * 0.72, 520);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    ringScale.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      true,
    );
  }, [visible, ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  if (!job) return null;

  const net = netEarningPaise(job.amountPaise);

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const viewEarnings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onViewEarnings();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Animated.View
        entering={FadeIn.duration(220)}
        style={[
          styles.backdrop,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <Animated.View
          entering={FadeInDown.duration(320).springify()}
          style={[styles.card, { maxHeight: cardMaxH }]}
        >
          <LinearGradient colors={['#ECFDF3', '#FFFFFF', '#F8FDFC']} style={styles.cardBg} />
          <View style={styles.greenBar} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            <Animated.View entering={ZoomIn.delay(80).duration(360).springify()} style={styles.iconWrap}>
              <Animated.View style={[styles.iconRing, ringStyle]}>
                <LinearGradient
                  colors={['rgba(3,152,85,0.2)', 'rgba(16,185,129,0.06)']}
                  style={styles.iconRingGrad}
                />
              </Animated.View>
              <LinearGradient colors={['#027A48', '#039855']} style={styles.iconGrad}>
                <Ionicons name="ribbon" size={compact ? 24 : 28} color={colors.white} />
              </LinearGradient>
            </Animated.View>

            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={10} color="#027A48" />
              <Text style={styles.badgeText}>VISIT COMPLETE</Text>
            </View>

            <Text style={[styles.title, compact && styles.titleCompact]}>Great work!</Text>
            <Text style={styles.sub} numberOfLines={2}>
              {job.bookingRef} successfully closed
            </Text>

            <View style={styles.earnCard}>
              <LinearGradient colors={['#027A48', '#039855']} style={StyleSheet.absoluteFill} />
              <View style={styles.earnLeft}>
                <Text style={styles.earnLabel}>Credited to payout</Text>
                <Text style={styles.earnValue}>{formatRs(net)}</Text>
              </View>
              <Ionicons name="wallet-outline" size={18} color="#A7F3D0" />
            </View>

            <View style={styles.summary}>
              <SummaryRow icon="person-outline" text={job.customerName} />
              <SummaryRow icon="sparkles-outline" text={job.service} />
              <SummaryRow icon="location-outline" text={`${job.zone} · Raipur`} />
            </View>

            <View style={styles.points}>
              {NEXT_STEPS.map((p) => (
                <View key={p} style={styles.point}>
                  <Ionicons name="checkmark-circle" size={13} color="#039855" />
                  <Text style={styles.pointText}>{p}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.primary} onPress={viewEarnings} accessibilityRole="button">
              <LinearGradient colors={['#027A48', '#039855']} style={StyleSheet.absoluteFill} />
              <Ionicons name="wallet-outline" size={16} color={colors.white} />
              <Text style={styles.primaryText}>View earnings</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={close} accessibilityRole="button">
              <Text style={styles.secondaryText}>Back to schedule</Text>
            </Pressable>
          </View>
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
      <Ionicons name={icon} size={13} color="#027A48" />
      <Text style={styles.summaryText} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.62)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  card: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(3,152,85,0.16)',
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  greenBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#10B981',
    zIndex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  iconWrap: { alignItems: 'center' },
  iconRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  iconRingGrad: { flex: 1 },
  iconGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    alignSelf: 'center',
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#027A48',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  titleCompact: { fontSize: 18 },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
  earnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    overflow: 'hidden',
  },
  earnLeft: { gap: 1 },
  earnLabel: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  earnValue: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: '#A7F3D0',
    letterSpacing: -0.3,
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  summaryText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.ink,
    lineHeight: 16,
  },
  points: { gap: 5, paddingTop: 2 },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  pointText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: 6 },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#027A48' },
});
