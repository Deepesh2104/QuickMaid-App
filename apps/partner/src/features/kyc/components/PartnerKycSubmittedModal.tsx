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

import { QmButton } from '@/components/ui/QmButton';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerKycSubmittedModalProps {
  visible: boolean;
  onClose: () => void;
  onViewEarnings?: () => void;
}

const NEXT_STEPS = [
  { icon: 'time-outline' as const, text: 'Review usually 24–48 hours' },
  { icon: 'briefcase-outline' as const, text: 'You can still accept demo jobs' },
  { icon: 'wallet-outline' as const, text: 'Monday payout after approval' },
];

export function PartnerKycSubmittedModal({
  visible,
  onClose,
  onViewEarnings,
}: PartnerKycSubmittedModalProps) {
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    ringScale.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 650 }), withTiming(1, { duration: 650 })),
      -1,
      true,
    );
  }, [visible, ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(220)} style={styles.backdrop}>
        <Animated.View entering={FadeInDown.duration(320).springify()} style={styles.sheet}>
          <LinearGradient colors={['#032A28', '#084F4A', '#0B6E67']} style={styles.hero}>
            <View style={styles.heroGlowA} />
            <View style={styles.heroGlowB} />

            <Animated.View entering={ZoomIn.delay(60).duration(380).springify()} style={styles.iconWrap}>
              <Animated.View style={[styles.iconRing, ringStyle]}>
                <LinearGradient
                  colors={['rgba(252,211,77,0.28)', 'rgba(252,211,77,0.06)']}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
              <LinearGradient colors={['#FCD34D', '#F59E0B']} style={styles.iconGrad}>
                <Ionicons name="shield-checkmark" size={30} color={colors.white} />
              </LinearGradient>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(120).duration(300)} style={styles.title}>
              KYC submitted
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(160).duration(300)} style={styles.sub}>
              Documents are under review. Payout unlock notification aayega — usually 24–48 hours.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Under review</Text>
            </Animated.View>
          </LinearGradient>

          <View style={styles.body}>
            {NEXT_STEPS.map((step, i) => (
              <Animated.View
                key={step.icon}
                entering={FadeInDown.delay(240 + i * 50).duration(280)}
                style={styles.row}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name={step.icon} size={15} color={colors.primary} />
                </View>
                <Text style={styles.rowText}>{step.text}</Text>
              </Animated.View>
            ))}

            <Animated.View entering={FadeInDown.delay(420).duration(280)}>
              <QmButton label="Back to home" icon="home-outline" onPress={onClose} />
            </Animated.View>
            {onViewEarnings ? (
              <Animated.View entering={FadeInDown.delay(460).duration(280)}>
                <Pressable
                  style={styles.secondary}
                  onPress={() => {
                    Haptics.selectionAsync();
                    onViewEarnings();
                  }}
                >
                  <Text style={styles.secondaryText}>View earnings while you wait</Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,42,40,0.58)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.lg,
  },
  hero: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
  },
  heroGlowA: {
    position: 'absolute',
    right: -20,
    top: -16,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.14)',
  },
  heroGlowB: {
    position: 'absolute',
    left: -24,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  iconGrad: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.white, letterSpacing: -0.3 },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(252,211,77,0.16)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.28)',
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.partnerGold,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 11, color: colors.partnerGold, letterSpacing: 0.4 },
  body: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },
  secondary: { alignItems: 'center', paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
});
