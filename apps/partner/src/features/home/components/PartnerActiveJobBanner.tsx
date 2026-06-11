import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerActiveJobBannerProps {
  job: PartnerJob;
}

export function PartnerActiveJobBanner({ job }: PartnerActiveJobBannerProps) {
  const router = useRouter();
  const live = job.status === 'in_progress';
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!live) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [live, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.45 - pulse.value * 0.1,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(`/job/${job.id}` as Href);
        }}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <LinearGradient
          colors={
            live
              ? ['#010F0E', '#084F4A', '#0B6E67']
              : ['#032A28', '#084F4A', '#12A598']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.glow} pointerEvents="none" />

          <View style={styles.top}>
            <View style={styles.liveRow}>
              {live ? (
                <>
                  <Animated.View style={[styles.pulseRing, pulseStyle]} />
                  <View style={styles.liveDotLive} />
                </>
              ) : (
                <View style={styles.liveDotConfirmed} />
              )}
              <Text style={styles.liveLabel}>
                {live ? 'VISIT LIVE · GPS BROADCAST' : 'CONFIRMED VISIT'}
              </Text>
            </View>
            <Text style={styles.earn}>{formatRs(netEarningPaise(job.amountPaise))}</Text>
          </View>

          <Text style={styles.service}>{job.service}</Text>
          <Text style={styles.customer}>
            {job.customerName} · {job.visitDate} · {job.slotLabel}
          </Text>
          <Text style={styles.addr} numberOfLines={1}>
            {job.address}
          </Text>

          <View style={styles.footer}>
            <View style={styles.chip}>
              <Ionicons name={live ? 'navigate' : 'calendar'} size={12} color="#6EE7B7" />
              <Text style={styles.chipText}>
                {live ? 'Customer tracking you' : 'Tap to start visit'}
              </Text>
            </View>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>{live ? 'Manage visit' : 'Open job'}</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg, ...shadow.lg },
  pressed: { opacity: 0.96 },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(18,165,152,0.18)',
    top: -40,
    right: -20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  pulseRing: {
    position: 'absolute',
    left: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(18,165,152,0.35)',
  },
  liveDotLive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6EE7B7',
  },
  liveDotConfirmed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FCD34D',
  },
  liveLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.6,
    flex: 1,
  },
  earn: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.partnerGold,
    letterSpacing: -0.3,
  },
  service: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    marginTop: 4,
  },
  customer: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  addr: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ctaText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
});
